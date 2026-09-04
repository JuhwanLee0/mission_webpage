/**
 * Tree of Life Global Missions — Auth & RBAC Engine (Supabase Ready)
 * Schema & State mapped 1:1 to Supabase `auth.users` and `public.permissions`
 * Default: Admin mode active for seamless local testing
 */

const DEFAULT_AUTH_USERS = [
  {
    id: "usr_admin_primary",
    email: "john0823.lee@gmail.com",
    name: "Juhwan Lee",
    role: "admin", // 'admin' | 'staff'
    password: "TreeOfLife2026!",
    avatar: "",
    grantedAt: "2026-09-04"
  }
];

class AuthRBACEngine {
  constructor() {
    this.sessionKey = 'tol_auth_session_v2';
    this.usersKey = 'tol_rbac_users_v2';
    
    this.users = this.loadUsers();
    
    // Check saved session state (Default: Public Guest Mode)
    const savedSession = localStorage.getItem(this.sessionKey);
    if (savedSession && savedSession !== 'logged_out') {
      try {
        const parsed = JSON.parse(savedSession);
        // Clean out any rogue/test sessions like 111@gmail.com
        const isAuthorized = parsed && parsed.email && (
          this.users.some(u => u.email.toLowerCase() === parsed.email.toLowerCase()) ||
          parsed.provider === 'supabase'
        ) && !parsed.email.includes('111@');

        if (isAuthorized) {
          this.currentUser = parsed;
        } else {
          this.currentUser = null;
          localStorage.setItem(this.sessionKey, 'logged_out');
        }
      } catch (e) {
        this.currentUser = null;
        localStorage.setItem(this.sessionKey, 'logged_out');
      }
    } else {
      this.currentUser = null;
      localStorage.setItem(this.sessionKey, 'logged_out');
    }
    
    this.initUI();
  }

  loadUsers() {
    const demoEmails = [
      'admin@treeoflifemissions.org',
      'fayez@treeoflifemissions.org',
      'media@treeoflifemissions.org',
      'isis@treeoflifemissions.org',
      'sarah.chen@tamu.edu'
    ];
    const saved = localStorage.getItem(this.usersKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          let filtered = parsed.filter(u => u && u.email && !demoEmails.includes(u.email.toLowerCase()));
          // Ensure primary admin is always in whitelist
          if (!filtered.some(u => u.email.toLowerCase() === DEFAULT_AUTH_USERS[0].email.toLowerCase())) {
            filtered.unshift(DEFAULT_AUTH_USERS[0]);
          }
          this.saveUsers(filtered);
          return filtered;
        }
      } catch (e) {
        console.error("Error loading users", e);
      }
    }
    this.saveUsers(DEFAULT_AUTH_USERS);
    return DEFAULT_AUTH_USERS;
  }

  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  saveSession(user) {
    if (user) {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
    } else {
      localStorage.setItem(this.sessionKey, 'logged_out');
    }
    this.currentUser = user;
    this.renderAuthStatus();
  }

  async login(email, password = '') {
    const cleanEmail = email.trim().toLowerCase();

    if (!password) {
      alert("Please enter your password.");
      return false;
    }

    // 1. Supabase Hybrid Client Check (Queries Supabase staff_users whitelist & password)
    if (window.supabaseClient) {
      const result = await window.supabaseClient.signIn(cleanEmail, password);
      if (result && result.success) {
        this.currentUser = result.user;
        this.closeLoginModal();
        const mode = window.supabaseClient.isLive() ? 'Supabase Cloud' : 'Authorized Staff Mode';
        alert(`Welcome, ${this.currentUser.name}!\n\nLogged in successfully (${mode} - ${this.currentUser.role.toUpperCase()} Role).`);
        this.renderAuthStatus();
        location.reload();
        return true;
      } else if (result && result.error) {
        alert(result.error);
        return false;
      }
    }

    // 2. Preset Authorized Users Fallback
    const existing = this.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.password && existing.password !== password) {
        alert("Authentication Failed: Incorrect password. Please try again.");
        return false;
      }
      this.saveSession(existing);
      this.closeLoginModal();
      alert(`Welcome back, ${existing.name}!\n\n(${existing.role.toUpperCase()} Role active)`);
      this.renderAuthStatus();
      location.reload();
      return true;
    }

    // 3. Strict Rejection: Unregistered Accounts are completely blocked
    alert(`Access Denied: "${cleanEmail}" is not registered as an authorized account.\n\nOnly registered admin and staff members can access ministry operations.\nPlease contact the administrator.`);
    return false;
  }

  logout() {
    this.saveSession(null);
    alert("Signed out successfully. Switched to public guest mode.");
    this.renderAuthStatus();
    location.reload();
  }

  hasUploadPermission() {
    if (!this.currentUser) return false;
    return this.currentUser.role === 'admin' || this.currentUser.role === 'staff';
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  async grantPermission(email, name, role = 'staff', password = 'TreeOfLife2026!') {
    const cleanEmail = email.toLowerCase().trim();
    const userPassword = password || 'TreeOfLife2026!';
    const existing = this.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      existing.role = role;
      if (name) existing.name = name;
      if (password) existing.password = userPassword;
    } else {
      this.users.push({
        id: "usr_" + Date.now(),
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        role: role,
        password: userPassword,
        avatar: "",
        grantedAt: new Date().toISOString().split('T')[0]
      });
    }
    this.saveUsers(this.users);
    this.renderRbacTable();

    // Sync to Supabase staff_users table if connected
    if (window.supabaseClient && window.supabaseClient.isLive()) {
      try {
        await window.supabaseClient.client.from('staff_users').upsert({
          id: 'usr_' + Date.now(),
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          role: role,
          password: userPassword
        }, { onConflict: 'email' });
        console.log('[Supabase] Whitelist updated in cloud DB:', cleanEmail);
      } catch (err) {
        console.warn('[Supabase] Failed to sync staff_users:', err);
      }
    }
  }

  async revokePermission(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === DEFAULT_AUTH_USERS[0].email.toLowerCase()) {
      alert("Cannot revoke primary super administrator.");
      return;
    }
    this.users = this.users.filter(u => u.email.toLowerCase() !== cleanEmail);
    this.saveUsers(this.users);
    this.renderRbacTable();

    // Delete from Supabase staff_users table if connected
    if (window.supabaseClient && window.supabaseClient.isLive()) {
      try {
        await window.supabaseClient.client.from('staff_users').delete().eq('email', cleanEmail);
        console.log('[Supabase] Staff revoked in cloud DB:', cleanEmail);
      } catch (err) {
        console.warn('[Supabase] Failed to delete from staff_users:', err);
      }
    }
  }

  initUI() {
    // Immediate execution if DOM already parsed
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      this.renderAuthStatus();
      this.bindAuthEvents();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.renderAuthStatus();
        this.bindAuthEvents();
      });
    }
    window.addEventListener('load', () => this.renderAuthStatus());
  }

  renderAuthStatus() {
    const containers = [
      document.getElementById('globalAuthContainer'),
      document.getElementById('authStatusContainer')
    ].filter(Boolean);

    containers.forEach(container => {
      if (this.currentUser) {
        container.innerHTML = `
          <div class="auth-pill-logged" title="Logged in as ${this.currentUser.name} (${this.currentUser.email})">
            <span class="auth-pill-name">${this.currentUser.name}</span>
            <span class="role-badge role-${this.currentUser.role}">[${this.currentUser.role.toUpperCase()}]</span>
            ${this.isAdmin() ? `
              <button type="button" class="btn-rbac-mini" onclick="window.adminSettings ? window.adminSettings.openModal('groups') : window.authRBAC.openRbacModal()" title="Admin Operations & Settings Center">
                <i class="fa-solid fa-sliders"></i> Setting
              </button>
            ` : ''}
            <button type="button" class="btn-logout-mini" onclick="window.authRBAC.logout()" title="Sign Out" aria-label="Sign Out">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <button type="button" class="btn-auth-signin" onclick="window.authRBAC.openLoginModal()" title="Staff / Admin Sign In">
            <i class="fa-solid fa-shield-halved"></i> Staff
          </button>
        `;
      }
    });

    this.updateProtectedElements();
  }

  updateProtectedElements() {
    const hasPermission = this.hasUploadPermission();

    // 1. Gallery: Upload Photo button
    document.querySelectorAll('.btn-gallery-upload, .btn-open-upload').forEach(btn => {
      btn.style.display = hasPermission ? 'inline-flex' : 'none';
    });

    // 2. Announcements: Post Notice button
    document.querySelectorAll('#btnOpenPostNotice, .btn-post-notice').forEach(btn => {
      btn.style.display = hasPermission ? 'inline-flex' : 'none';
    });

    // 3. Schedule & Join: Publish Event & Email Monthly Schedule buttons
    document.querySelectorAll('.btn-open-create-event').forEach(btn => {
      btn.style.display = hasPermission ? 'inline-flex' : 'none';
    });

    document.querySelectorAll('.btn-email-schedule, #btnOpenEmailSchedule').forEach(btn => {
      btn.style.display = hasPermission ? 'inline-flex' : 'none';
    });

    // 4. Any elements with data-auth-required attributes
    document.querySelectorAll('[data-auth-required="staff"]').forEach(el => {
      el.style.display = hasPermission ? '' : 'none';
    });

    document.querySelectorAll('[data-auth-required="admin"]').forEach(el => {
      el.style.display = this.isAdmin() ? '' : 'none';
    });
  }

  ensureLoginModal() {
    let modal = document.getElementById('staffLoginModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-backdrop';
      modal.id = 'staffLoginModal';
      modal.innerHTML = `
        <div class="upload-modal-box" style="max-width: 440px;">
          <div class="modal-header">
            <div class="modal-title"><i class="fa-solid fa-shield-halved"></i> Staff Sign In</div>
            <button class="modal-close-btn" onclick="window.authRBAC.closeLoginModal()">&times;</button>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 0.86rem; color: var(--color-text-muted); margin-bottom: 18px;">
              Sign in with your verified staff or administrator email to manage announcements, schedules, and operations.
            </p>
            <form id="staffLoginForm">
              <div class="form-group">
                <label class="form-label" for="staffLoginEmail">Staff Email Address</label>
                <input type="email" id="staffLoginEmail" class="form-input" placeholder="john0823.lee@gmail.com" required />
              </div>
              <div class="form-group" style="margin-top: 12px;">
                <label class="form-label" for="staffLoginPassword">Password</label>
                <input type="password" id="staffLoginPassword" class="form-input" placeholder="Enter password" required />
              </div>
              <button type="submit" class="btn btn-forest" style="width: 100%; padding: 12px; margin-top: 16px;">
                <i class="fa-solid fa-right-to-bracket"></i> Sign In
              </button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeLoginModal();
      });
    }
    this.bindAuthEvents();
    return modal;
  }

  ensureRbacModal() {
    let modal = document.getElementById('staffRbacModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-backdrop';
      modal.id = 'staffRbacModal';
      modal.innerHTML = `
        <div class="upload-modal-box" style="max-width: 680px;">
          <div class="modal-header">
            <div class="modal-title"><i class="fa-solid fa-users-gear"></i> Staff Permission Manager</div>
            <button class="modal-close-btn" onclick="window.authRBAC.closeRbacModal()">&times;</button>
          </div>
          <div style="padding: 24px; max-height: 80vh; overflow-y: auto;">
            <form id="grantStaffForm" style="background: var(--color-sand-bg); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--color-sand-border); margin-bottom: 20px;">
              <div style="font-weight: 750; font-size: 0.88rem; color: var(--color-forest); margin-bottom: 12px;">
                <i class="fa-solid fa-user-plus"></i> Grant Staff Permission
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 8px; align-items: end;">
                <div>
                  <label class="form-label" style="font-size: 0.74rem;">Name</label>
                  <input type="text" id="grantName" class="form-input" placeholder="Sarah Chen" required style="padding: 8px 10px; font-size: 0.85rem;" />
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.74rem;">Email</label>
                  <input type="email" id="grantEmail" class="form-input" placeholder="sarah@tamu.edu" required style="padding: 8px 10px; font-size: 0.85rem;" />
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.74rem;">Password</label>
                  <input type="password" id="grantPassword" class="form-input" placeholder="Initial Pass" required style="padding: 8px 10px; font-size: 0.85rem;" />
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.74rem;">Role</label>
                  <select id="grantRole" class="form-input" style="padding: 8px 10px; font-size: 0.85rem;">
                    <option value="staff">Staff (Upload / Edit)</option>
                    <option value="admin">Admin (Full Access)</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-forest" style="padding: 9px 14px; font-size: 0.8rem;">Grant</button>
              </div>
            </form>
            <h4 style="font-size: 0.9rem; font-weight: 800; color: var(--color-forest); margin-bottom: 10px;">
              Authorized Ministry Accounts
            </h4>
            <table class="rbac-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="rbacTableBody"></tbody>
            </table>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeRbacModal();
      });
    }
    this.bindRbacEvents();
    return modal;
  }

  bindRbacEvents() {
    const grantForm = document.getElementById('grantStaffForm');
    if (grantForm && !grantForm._bound) {
      grantForm._bound = true;
      grantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('grantEmail').value;
        const name = document.getElementById('grantName').value;
        const role = document.getElementById('grantRole').value;
        const password = document.getElementById('grantPassword') ? document.getElementById('grantPassword').value : 'TreeOfLife2026!';
        this.grantPermission(email, name, role, password);
        grantForm.reset();
        alert(`Granted ${role.toUpperCase()} permissions to ${email}`);
      });
    }
  }

  bindAuthEvents() {
    const loginForm = document.getElementById('staffLoginForm');
    if (loginForm && !loginForm._bound) {
      loginForm._bound = true;
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('staffLoginEmail').value;
        const password = document.getElementById('staffLoginPassword') ? document.getElementById('staffLoginPassword').value : '';
        this.login(email, password);
      });
    }
  }

  openLoginModal() {
    const modal = this.ensureLoginModal();
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const emailInput = document.getElementById('staffLoginEmail');
      if (emailInput) setTimeout(() => emailInput.focus(), 150);
    }
  }

  closeLoginModal() {
    const modal = document.getElementById('staffLoginModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openRbacModal() {
    const modal = this.ensureRbacModal();
    if (modal) {
      this.renderRbacTable();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeRbacModal() {
    const modal = document.getElementById('staffRbacModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  renderRbacTable() {
    const tbody = document.getElementById('rbacTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="role-badge role-${u.role}">${u.role.toUpperCase()}</span></td>
        <td>
          ${u.email.toLowerCase() !== DEFAULT_AUTH_USERS[0].email.toLowerCase() ? `
            <button class="btn-revoke" onclick="window.authRBAC.revokePermission('${u.email}')">
              <i class="fa-solid fa-trash-can"></i> Revoke
            </button>
          ` : '<span style="color: var(--color-text-muted); font-size: 0.76rem; font-weight: 750;">Super</span>'}
        </td>
      </tr>
    `).join('');
  }
}

window.authRBAC = new AuthRBACEngine();

