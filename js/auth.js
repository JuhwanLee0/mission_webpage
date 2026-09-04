/**
 * Tree of Life Global Missions — Auth & RBAC Engine (Supabase Ready)
 * Schema & State mapped 1:1 to Supabase `auth.users` and `public.permissions`
 * Default: Admin mode active for seamless local testing
 */

const DEFAULT_AUTH_USERS = [
  {
    id: "usr_admin_primary",
    username: "admin",
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
        const isAuthorized = parsed && (parsed.email || parsed.username) && (
          this.users.some(u => 
            (parsed.email && u.email && u.email.toLowerCase() === parsed.email.toLowerCase()) ||
            (parsed.username && u.username && u.username.toLowerCase() === parsed.username.toLowerCase()) ||
            (parsed.id && u.id && u.id.toLowerCase() === parsed.id.toLowerCase())
          ) ||
          parsed.provider === 'supabase'
        ) && !(parsed.email && parsed.email.includes('111@'));

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

  async login(identifier, password = '') {
    const cleanId = (identifier || '').trim().toLowerCase();

    if (!cleanId) {
      alert("Please enter your staff email or ID.");
      return false;
    }

    if (!password) {
      alert("Please enter your password.");
      return false;
    }

    // 1. Supabase Hybrid Client Check (Queries Supabase staff_users whitelist & password)
    if (window.supabaseClient) {
      const result = await window.supabaseClient.signIn(cleanId, password);
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

    // 2. Preset Authorized Users Fallback (Matches email, username, or id)
    const existing = this.users.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.id && u.id.toLowerCase() === cleanId)
    );
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
    alert(`Access Denied: "${cleanId}" is not registered as an authorized account.\n\nOnly registered admin and staff members can access ministry operations.\nPlease contact the administrator.`);
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

  async grantPermission(identifier, name, role = 'staff', password = 'TreeOfLife2026!') {
    const cleanId = (identifier || '').toLowerCase().trim();
    if (!cleanId) return;

    const userPassword = password || 'TreeOfLife2026!';
    const isEmail = cleanId.includes('@');
    const emailVal = isEmail ? cleanId : `${cleanId}@staff.tol`;
    const usernameVal = isEmail ? cleanId.split('@')[0] : cleanId;

    const existing = this.users.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.id && u.id.toLowerCase() === cleanId)
    );

    if (existing) {
      existing.role = role;
      if (name) existing.name = name;
      if (password) existing.password = userPassword;
      if (!existing.username) existing.username = usernameVal;
      if (!existing.email) existing.email = emailVal;
    } else {
      this.users.push({
        id: "usr_" + Date.now(),
        email: emailVal,
        username: usernameVal,
        name: name || usernameVal,
        role: role,
        password: userPassword,
        avatar: "",
        grantedAt: new Date().toISOString().split('T')[0]
      });
    }
    this.saveUsers(this.users);
    this.renderRbacTable();
    if (window.adminSettings && typeof window.adminSettings.renderUsersTab === 'function') {
      window.adminSettings.renderUsersTab();
    }

    // Sync to Supabase staff_users table if connected
    if (window.supabaseClient && window.supabaseClient.isLive()) {
      try {
        await window.supabaseClient.client.from('staff_users').upsert({
          id: 'usr_' + Date.now(),
          email: emailVal,
          name: name || usernameVal,
          role: role,
          password: userPassword
        }, { onConflict: 'email' });
        console.log('[Supabase] Whitelist updated in cloud DB:', emailVal);
      } catch (err) {
        console.warn('[Supabase] Failed to sync staff_users:', err);
      }
    }
  }

  async revokePermission(identifier) {
    const cleanId = (identifier || '').toLowerCase().trim();
    const primaryAdmin = DEFAULT_AUTH_USERS[0];
    if (
      cleanId === primaryAdmin.email.toLowerCase() ||
      cleanId === (primaryAdmin.username && primaryAdmin.username.toLowerCase()) ||
      cleanId === primaryAdmin.id.toLowerCase()
    ) {
      alert("Cannot revoke primary super administrator.");
      return;
    }
    this.users = this.users.filter(u => 
      u.email.toLowerCase() !== cleanId &&
      (u.username ? u.username.toLowerCase() !== cleanId : true) &&
      u.id.toLowerCase() !== cleanId
    );
    this.saveUsers(this.users);
    this.renderRbacTable();
    if (window.adminSettings && typeof window.adminSettings.renderUsersTab === 'function') {
      window.adminSettings.renderUsersTab();
    }

    // Delete from Supabase staff_users table if connected
    if (window.supabaseClient && window.supabaseClient.isLive()) {
      try {
        await window.supabaseClient.client.from('staff_users').delete().or(`email.eq.${cleanId},email.eq.${cleanId}@staff.tol`);
        console.log('[Supabase] Staff revoked in cloud DB:', cleanId);
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
              Sign in with your verified staff email or ID and password to access ministry operations.
            </p>
            <form id="staffLoginForm">
              <div class="form-group">
                <label class="form-label" for="staffLoginEmail">Staff Email or ID</label>
                <input type="text" id="staffLoginEmail" class="form-input" placeholder="admin, staff01, or email" required />
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
                  <label class="form-label" style="font-size: 0.74rem;">Email or ID</label>
                  <input type="text" id="grantEmail" class="form-input" placeholder="staff01 or user@email.com" required style="padding: 8px 10px; font-size: 0.85rem;" />
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
                  <th>Email / ID</th>
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
        <td>${u.username ? `${u.username} <span style="color:var(--color-text-muted); font-size:0.75rem;">(${u.email})</span>` : u.email}</td>
        <td><span class="role-badge role-${u.role}">${u.role.toUpperCase()}</span></td>
        <td>
          ${(u.email.toLowerCase() !== DEFAULT_AUTH_USERS[0].email.toLowerCase() && u.username !== 'admin') ? `
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

