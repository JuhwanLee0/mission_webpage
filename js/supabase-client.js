/**
 * Tree of Life Global Missions — Supabase Cloud & Local Hybrid Storage Engine
 * Seamlessly switches between live Supabase Cloud and High-Performance Local DB.
 * Supports: Email/Password Auth, Storage Buckets ('mission-photos'), and PostgreSQL Tables.
 */

const SUPABASE_DEFAULT_CONFIG = {
  // 여기에 발급받으신 Project URL과 anon public 키를 넣어주세요.
  url: localStorage.getItem('tol_supabase_url') || 'https://여기에_프로젝트_URL.supabase.co',
  anonKey: localStorage.getItem('tol_supabase_key') || '여기에_anon_public_키_입력',
  bucketName: 'mission-photo'
};

class SupabaseHybridClient {
  constructor() {
    this.config = { ...SUPABASE_DEFAULT_CONFIG };
    this.client = null;
    this.storageKey = 'tol_photos_store_v1';
    this.authKey = 'tol_auth_session_v2';
    
    this.init();
  }

  init() {
    const isPlaceholder = !this.config.url || 
      this.config.url.includes('여기에_') || 
      !this.config.anonKey || 
      this.config.anonKey.includes('여기에_');

    if (!isPlaceholder && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.config.url, this.config.anonKey);
        console.log('[Supabase] Live Cloud Client Initialized successfully.');
      } catch (err) {
        console.warn('[Supabase] Failed to init cloud client, using local mock DB:', err);
        this.client = null;
      }
    } else {
      console.log('[Supabase] Running in Hybrid Local Mode (Live credentials pending).');
    }
  }

  isLive() {
    return Boolean(this.client && this.config.url && this.config.anonKey);
  }

  setCredentials(url, anonKey) {
    if (!url || !anonKey) {
      localStorage.removeItem('tol_supabase_url');
      localStorage.removeItem('tol_supabase_key');
      this.config.url = '';
      this.config.anonKey = '';
      this.client = null;
      console.log('[Supabase] Cleared credentials, switched to local mock mode.');
      return false;
    }

    localStorage.setItem('tol_supabase_url', url.trim());
    localStorage.setItem('tol_supabase_key', anonKey.trim());
    this.config.url = url.trim();
    this.config.anonKey = anonKey.trim();

    if (window.supabase) {
      try {
        this.client = window.supabase.createClient(this.config.url, this.config.anonKey);
        console.log('[Supabase] Switched to Live Supabase Cloud!');
        return true;
      } catch (e) {
        console.error('[Supabase] Init error with new keys:', e);
        return false;
      }
    }
    return false;
  }

  /* ==========================================================================
     1. Authentication API (Strict Whitelist Access Control)
     ========================================================================== */
  async signIn(identifier, password = '') {
    const cleanId = (identifier || '').trim().toLowerCase();

    if (!cleanId) {
      return { success: false, error: 'Please enter your staff email or ID.' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // 1. Live Supabase Database Whitelist & Password Check
    if (this.isLive()) {
      try {
        let query = this.client.from('staff_users').select('*');
        if (cleanId.includes('@')) {
          query = query.eq('email', cleanId);
        } else {
          // If pure ID, check email matches cleanId or cleanId@staff.tol or name
          query = query.or(`email.eq.${cleanId},email.eq.${cleanId}@staff.tol,name.eq.${cleanId}`);
        }
        const { data: staffMember, error: staffErr } = await query.maybeSingle();

        if (staffErr) {
          console.warn('[Supabase] staff_users query note:', staffErr.message);
        }

        if (staffMember) {
          // If staffMember has a password column set in DB, verify it!
          if (staffMember.password && staffMember.password !== password) {
            return {
              success: false,
              error: 'Authentication Failed: Incorrect password. Please check your password and try again.'
            };
          }

          const user = {
            id: staffMember.id || ('usr_' + Date.now()),
            email: staffMember.email,
            username: cleanId.includes('@') ? staffMember.email.split('@')[0] : cleanId,
            name: staffMember.name || cleanId,
            role: staffMember.role || 'staff',
            avatar: staffMember.avatar || '',
            provider: 'supabase'
          };
          this.saveLocalSession(user);
          return { success: true, user };
        } else {
          // Explicit rejection: not in Supabase staff whitelist
          return {
            success: false,
            error: `Access Denied: "${cleanId}" is not in the authorized staff list.\n\nPlease ask an Administrator to register your ID or email in the Admin Center.`
          };
        }
      } catch (cloudErr) {
        console.warn('[Supabase] Cloud whitelist check failed:', cloudErr.message);
      }
    }

    // 2. Local Fallback Whitelist & Password Check
    const allowedUsers = (window.authRBAC && window.authRBAC.users) ? window.authRBAC.users : [];
    const matched = allowedUsers.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.id && u.id.toLowerCase() === cleanId)
    );

    if (matched) {
      if (matched.password && matched.password !== password) {
        return {
          success: false,
          error: 'Authentication Failed: Incorrect password. Please check your password and try again.'
        };
      }
      this.saveLocalSession(matched);
      return { success: true, user: matched };
    }

    // Strict Rejection: Unknown identifier
    return {
      success: false,
      error: `Access Denied: "${cleanId}" is not registered as an authorized staff account.\n\nOnly pre-approved team members can access staff features.`
    };
  }

  async signOut() {
    if (this.isLive()) {
      try {
        await this.client.auth.signOut();
      } catch (e) {
        console.warn('[Supabase] Cloud signout note:', e);
      }
    }
    localStorage.setItem(this.authKey, 'logged_out');
    return true;
  }

  /* ==========================================================================
     3. Delete Photo API (Supabase Cloud + Local Storage Sync)
     ========================================================================== */
  async deletePhoto(photoId) {
    if (!photoId) return false;

    // 1. Live Supabase Cloud DB Delete
    if (this.isLive()) {
      try {
        const { error } = await this.client
          .from('photos')
          .delete()
          .eq('id', photoId);

        if (error) {
          console.warn('[Supabase] DB photo delete error:', error.message);
        } else {
          console.log('[Supabase] Cloud photo record deleted:', photoId);
        }
      } catch (cloudErr) {
        console.warn('[Supabase] Cloud photo delete failed:', cloudErr.message);
      }
    }

    // 2. Local Storage Cache Cleanup
    try {
      const existing = this.getLocalPhotos();
      const updated = existing.filter(p => p.id !== photoId);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('[Supabase] Local storage delete cache note:', e);
    }

    return true;
  }

  getCurrentUser() {
    const saved = localStorage.getItem(this.authKey);
    if (saved && saved !== 'logged_out') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  saveLocalSession(user) {
    if (user) {
      localStorage.setItem(this.authKey, JSON.stringify(user));
    } else {
      localStorage.setItem(this.authKey, 'logged_out');
    }
    window.dispatchEvent(new CustomEvent('auth_state_changed', { detail: user }));
  }

  /* ==========================================================================
     2. Photo & Media Storage API (Supabase Storage Bucket or Local Base64)
     ========================================================================== */
  async uploadPhoto(file, metadata = {}) {
    if (!file) throw new Error('No file provided for upload.');

    const timestamp = Date.now();
    const cleanFileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const currentUser = this.getCurrentUser();
    const authorName = currentUser ? currentUser.name : 'Ministry Staff';

    // 1. Live Supabase Storage + DB Table
    if (this.isLive()) {
      try {
        // Step A: Upload to Storage Bucket 'mission-photos'
        const { data: uploadData, error: uploadErr } = await this.client.storage
          .from(this.config.bucketName)
          .upload(`public/${cleanFileName}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadErr) throw uploadErr;

        // Step B: Get Public URL
        const { data: urlData } = this.client.storage
          .from(this.config.bucketName)
          .getPublicUrl(`public/${cleanFileName}`);

        const publicUrl = urlData.publicUrl;

        // Step C: Insert Record to 'photos' Table
        const photoRecord = {
          id: 'photo_' + timestamp,
          image_url: publicUrl,
          caption: metadata.caption || 'Tree of Life Ministry Moment',
          tag: metadata.tag || 'community',
          date: metadata.date || new Date().toISOString().split('T')[0],
          location: metadata.location || 'Bryan & College Station, TX',
          author: authorName,
          created_at: new Date().toISOString()
        };

        const { data: dbData, error: dbErr } = await this.client
          .from('photos')
          .insert([photoRecord])
          .select();

        if (dbErr) {
          console.warn('[Supabase] DB row insert note (Storage succeeded):', dbErr.message);
        }

        // Also save to local cache for instant UI rendering
        this.saveLocalPhoto({
          id: photoRecord.id,
          imageUrl: publicUrl,
          caption: photoRecord.caption,
          tag: photoRecord.tag,
          date: photoRecord.date,
          location: photoRecord.location,
          author: photoRecord.author
        });

        return {
          success: true,
          photo: {
            id: photoRecord.id,
            imageUrl: publicUrl,
            caption: photoRecord.caption,
            tag: photoRecord.tag,
            date: photoRecord.date,
            location: photoRecord.location,
            author: photoRecord.author
          }
        };
      } catch (cloudErr) {
        console.warn('[Supabase] Cloud storage failed, falling back to local storage:', cloudErr);
      }
    }

    // 2. Hybrid Local Persistent Storage (Base64 Data URL)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const localPhoto = {
          id: 'photo_loc_' + timestamp,
          imageUrl: base64Data,
          caption: metadata.caption || 'Tree of Life Ministry Moment',
          tag: metadata.tag || 'community',
          date: metadata.date || new Date().toISOString().split('T')[0],
          location: metadata.location || 'Bryan & College Station, TX',
          author: authorName,
          isLocal: true,
          created_at: new Date().toISOString()
        };

        this.saveLocalPhoto(localPhoto);
        resolve({ success: true, photo: localPhoto });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  saveLocalPhoto(photo) {
    try {
      const existing = this.getLocalPhotos();
      existing.unshift(photo);
      localStorage.setItem(this.storageKey, JSON.stringify(existing));
    } catch (e) {
      console.warn('[Supabase] Local storage save note:', e);
    }
  }

  getLocalPhotos() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[Supabase] Local photo read note:', e);
    }
    return [];
  }

  async getPhotos(tag = 'all') {
    let photos = [];

    // 1. Fetch from live Supabase if connected
    if (this.isLive()) {
      try {
        let query = this.client
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false });

        if (tag && tag !== 'all') {
          query = query.eq('tag', tag);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          photos = data.map(item => ({
            id: item.id,
            imageUrl: item.image_url,
            caption: item.caption,
            tag: item.tag,
            date: item.date,
            location: item.location,
            author: item.author
          }));
        }
      } catch (e) {
        console.warn('[Supabase] Cloud photo fetch note:', e);
      }
    }

    // 2. Merge with local photos
    const local = this.getLocalPhotos();
    const all = [...photos, ...local];

    // Deduplicate by ID
    const seen = new Set();
    const deduped = [];
    for (const p of all) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        if (tag === 'all' || p.tag === tag) {
          deduped.push(p);
        }
      }
    }
    return deduped;
  }
}

// Global Singleton
window.supabaseClient = new SupabaseHybridClient();
