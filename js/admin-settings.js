/**
 * Tree of Life Global Missions — Admin Center & Outreach Dispatch Settings Engine
 * Manages Inbound Contact Routing, Outbound Email Group Broadcasting, SMS & Email Smart Prompts.
 * 100% Zero-Emoji, Pure Clean Modern Standard
 */

const DEFAULT_EMAIL_GROUPS = [
  {
    id: "grp_leaders",
    name: "All Field Leaders",
    description: "Campus table leaders and downtown outreach coordinators",
    emails: [
      "sarah.chen@tamu.edu",
      "fayez@treeoflifemissions.org",
      "isis@treeoflifemissions.org",
      "david@treeoflifemissions.org",
      "admin@treeoflifemissions.org"
    ]
  },
  {
    id: "grp_volunteers",
    name: "Student Volunteers",
    description: "Registered student leaders and campus table helpers",
    emails: [
      "john.kim@tamu.edu",
      "rachel.yoon@tamu.edu",
      "grace.liu@tamu.edu",
      "samuel.park@tamu.edu",
      "daniel.chang@tamu.edu",
      "maria.garcia@tamu.edu",
      "ethan.davis@tamu.edu"
    ]
  },
  {
    id: "grp_staff",
    name: "Ministry Staff",
    description: "Core full-time staff, media directors, and board members",
    emails: [
      "admin@treeoflifemissions.org",
      "media@treeoflifemissions.org",
      "isis@treeoflifemissions.org",
      "fayez@treeoflifemissions.org"
    ]
  },
  {
    id: "grp_partners",
    name: "Prayer & Church Partners",
    description: "Partner church pastors, intercessory prayer network, and monthly supporters",
    emails: [
      "prayer@treeoflifemissions.org",
      "partners@gracebryan.org",
      "outreach@calvarybcs.org"
    ]
  }
];

const DEFAULT_INBOUND_SETTINGS = {
  // Web3Forms public access key (configured for direct delivery)
  accessKey: "297926ea-8ef6-4df1-86fc-7788fa76ceea",
  recipients: [
    "info@treeoflifemissions.org",
    "admin@treeoflifemissions.org"
  ],
  notifyLeaders: true,
  autoReply: true
};

const DEFAULT_PROMPT_TEMPLATES = {
  sms: "[Tree of Life] Hi {leaderName}! For the upcoming '{title}' outreach on {date} ({time}), please confirm if the campus permit (Status: {permitStatus}) and volunteer roster ({joinersCount} joiners) are set. Logistics: {notes}",
  
  email: `Subject: [Tree of Life Missions] Ministry Operations Briefing: {title} ({date})

Dear {leaderName} and Outreach Team,

Here is the operational briefing for our upcoming mission outreach:

• Outreach Event: {title}
• Date & Time: {date} ({time})
• Campus / Venue: {location} ({campus})
• Permit Status: [{permitStatus}]
• Field Leader: {leaderName} ({leaderPhone} / {leaderEmail})
• Registered Student Volunteers ({joinersCount}):
{joinersList}

• Logistics & Contingency Notes:
{notes}

Thank you for your faithful service in sharing the Word of God with international students!

Tree of Life Global Missions Operations
Headquarters: 2305 Barak Ln, Bryan, TX 77802
Contact: info@treeoflifemissions.org`
};

class AdminSettingsEngine {
  constructor() {
    this.groupsStorageKey = 'tol_email_groups_v1';
    this.promptsStorageKey = 'tol_prompt_templates_v1';
    this.inboundStorageKey = 'tol_inbound_settings_v1';

    this.groups = this.loadGroups();
    this.templates = this.loadTemplates();
    this.inbound = this.loadInboundSettings();
    this.currentTab = 'groups'; // 'groups' | 'prompts' | 'inbound' | 'users'

    this.initUI();
  }

  loadGroups() {
    const saved = localStorage.getItem(this.groupsStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error reading groups", e);
      }
    }
    this.saveGroups(DEFAULT_EMAIL_GROUPS);
    return DEFAULT_EMAIL_GROUPS;
  }

  saveGroups(groups) {
    this.groups = groups;
    localStorage.setItem(this.groupsStorageKey, JSON.stringify(groups));
  }

  loadTemplates() {
    const saved = localStorage.getItem(this.promptsStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.sms && parsed.email) return parsed;
      } catch (e) {
        console.error("Error reading prompts", e);
      }
    }
    this.saveTemplates(DEFAULT_PROMPT_TEMPLATES);
    return DEFAULT_PROMPT_TEMPLATES;
  }

  saveTemplates(templates) {
    this.templates = templates;
    localStorage.setItem(this.promptsStorageKey, JSON.stringify(templates));
  }

  loadInboundSettings() {
    const saved = localStorage.getItem(this.inboundStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.accessKey && Array.isArray(parsed.recipients)) {
          return parsed;
        }
      } catch (e) {
        console.error("Error reading inbound settings", e);
      }
    }
    this.saveInboundSettings(DEFAULT_INBOUND_SETTINGS);
    return DEFAULT_INBOUND_SETTINGS;
  }

  saveInboundSettings(settings) {
    this.inbound = settings;
    localStorage.setItem(this.inboundStorageKey, JSON.stringify(settings));
  }

  renderTemplate(type, data) {
    const template = this.templates[type] || DEFAULT_PROMPT_TEMPLATES[type] || "";
    if (!data) return template;

    let joinersFormatted = "None registered yet.";
    if (data.joiners && data.joiners.length > 0) {
      joinersFormatted = data.joiners.map(j => `  - ${j.name} (Time: ${j.timeSlot || 'Full'}, Tel: ${j.phone || 'N/A'})`).join('\n');
    }

    return template
      .replace(/{title}/g, data.title || "Ministry Outreach")
      .replace(/{date}/g, data.date || "Upcoming Date")
      .replace(/{time}/g, data.time || "Scheduled Time")
      .replace(/{location}/g, data.location || "Mission Venue")
      .replace(/{campus}/g, data.campus || "Texas Campus")
      .replace(/{permitStatus}/g, (data.permitStatus || "APPROVED").toUpperCase())
      .replace(/{leaderName}/g, data.leaderName || "Field Leader")
      .replace(/{leaderPhone}/g, data.leaderPhone || "N/A")
      .replace(/{leaderEmail}/g, data.leaderEmail || "info@treeoflifemissions.org")
      .replace(/{joinersCount}/g, (data.joiners && data.joiners.length) || 0)
      .replace(/{joinersList}/g, joinersFormatted)
      .replace(/{notes}/g, data.notes || "Standard campus table setup. Check Bible supply.");
  }

  initUI() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.injectAdminModal();
        this.injectGroupEditorModal();
        this.injectBroadcastComposerModal();
      });
    } else {
      this.injectAdminModal();
      this.injectGroupEditorModal();
      this.injectBroadcastComposerModal();
    }
  }

  injectAdminModal() {
    if (document.getElementById('adminCenterModal')) return;

    const modalDiv = document.createElement('div');
    modalDiv.id = 'adminCenterModal';
    modalDiv.className = 'modal-backdrop';
    modalDiv.innerHTML = `
      <div class="modal-card admin-center-card">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3 class="modal-title">
              <i class="fa-solid fa-sliders" style="color: var(--color-amber);"></i> Admin Operations Control Center
            </h3>
            <p style="font-size: 0.76rem; color: var(--color-text-muted); margin: 0;">
              Manage Email Groups, Inbound Form Routing, Smart Prompts, and Staff Access
            </p>
          </div>
          <button type="button" class="modal-close-btn" onclick="window.adminSettings.closeModal()" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Admin Navigation Tabs -->
        <div class="admin-tab-nav">
          <button type="button" class="admin-tab-btn active" data-tab="groups" onclick="window.adminSettings.switchTab('groups')">
            <i class="fa-solid fa-users"></i> Email Groups Hub
          </button>
          <button type="button" class="admin-tab-btn" data-tab="inbound" onclick="window.adminSettings.switchTab('inbound')">
            <i class="fa-solid fa-inbox"></i> Inbound Form Routing
          </button>
          <button type="button" class="admin-tab-btn" data-tab="prompts" onclick="window.adminSettings.switchTab('prompts')">
            <i class="fa-solid fa-feather"></i> Smart Prompts & Templates
          </button>
          <button type="button" class="admin-tab-btn" data-tab="users" onclick="window.adminSettings.switchTab('users')">
            <i class="fa-solid fa-user-shield"></i> Staff Access (RBAC)
          </button>
        </div>

        <div class="modal-body admin-center-body">
          <!-- TAB 1: Email Groups -->
          <div id="adminTabGroups" class="admin-tab-pane active">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <div>
                <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--color-forest); margin: 0;">
                  Recipient Groups & One-Click Dispatch
                </h4>
                <p style="font-size: 0.76rem; color: var(--color-text-muted); margin: 2px 0 0 0;">
                  Configure distribution lists for instant group broadcast.
                </p>
              </div>
              <button type="button" class="btn btn-forest" style="padding: 6px 12px; font-size: 0.78rem;" onclick="window.adminSettings.openCreateGroupModal()">
                <i class="fa-solid fa-plus"></i> New Group
              </button>
            </div>

            <div id="adminEmailGroupsList" class="admin-groups-grid">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- TAB 2: Inbound Form Routing & Notification Recipients -->
          <div id="adminTabInbound" class="admin-tab-pane" style="display: none;">
            <div style="margin-bottom: 14px;">
              <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--color-forest); margin: 0;">
                Contact Us & Volunteer Form Routing
              </h4>
              <p style="font-size: 0.76rem; color: var(--color-text-muted); margin: 2px 0 0 0;">
                Configure who receives notifications when visitors submit Contact Us messages or Volunteer applications.
              </p>
            </div>

            <form id="adminInboundSettingsForm" onsubmit="window.adminSettings.handleSaveInboundSettings(event)">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.8rem;">
                  <i class="fa-solid fa-key" style="color: var(--color-amber);"></i> Web3Forms Access Key
                </label>
                <div style="display: flex; gap: 8px;">
                  <input type="text" id="inboundAccessKeyInput" class="form-input" placeholder="e.g. 297926ea-8ef6-4df1-86fc-7788fa76ceea" required style="font-family: monospace; font-size: 0.82rem;" />
                  <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="white-space: nowrap; font-size: 0.76rem; padding: 8px 12px;">
                    Get Free Key
                  </a>
                </div>
                <span style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: 4px; display: block;">
                  Zero backend required. Encrypted submissions route straight to the emails configured below.
                </span>
              </div>

              <div class="form-group" style="margin-top: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <label class="form-label" style="font-size: 0.8rem; margin: 0;">
                    <i class="fa-solid fa-envelope" style="color: var(--color-forest);"></i> Notification Recipient Emails (Add / Remove)
                  </label>
                  <span id="inboundRecipientCountBadge" style="font-size: 0.72rem; font-weight: 750; color: var(--color-amber);">
                    2 Recipients
                  </span>
                </div>
                <textarea id="inboundRecipientsInput" class="form-textarea" placeholder="Enter notification emails separated by comma or new line (e.g. info@treeoflifemissions.org, mike@tamu.edu)" required style="min-height: 100px; font-size: 0.84rem; font-family: monospace;" oninput="window.adminSettings.updateInboundRecipientCount()"></textarea>
              </div>

              <!-- Recipient Chips Preview -->
              <div style="margin-top: 8px;">
                <div style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 700; margin-bottom: 4px;">Active Target Inboxes:</div>
                <div id="inboundRecipientChipsPreview" style="display: flex; flex-wrap: wrap; gap: 4px;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 12px; border-top: 1px dashed var(--color-sand-border);">
                <button type="button" class="btn btn-outline" style="font-size: 0.78rem;" onclick="window.adminSettings.testInboundEmailDispatch()">
                  <i class="fa-solid fa-paper-plane"></i> Send Test Notification
                </button>
                <button type="submit" class="btn btn-forest" style="font-size: 0.82rem;">
                  <i class="fa-solid fa-floppy-disk"></i> Save Routing Settings
                </button>
              </div>
            </form>
          </div>

          <!-- TAB 3: Smart Prompts & Templates -->
          <div id="adminTabPrompts" class="admin-tab-pane" style="display: none;">
            <div style="margin-bottom: 14px;">
              <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--color-forest); margin: 0;">
                Smart Prompt & Template Editor
              </h4>
              <p style="font-size: 0.76rem; color: var(--color-text-muted); margin: 2px 0 0 0;">
                Available Smart Tags: <code class="tag-code">{title}</code> <code class="tag-code">{date}</code> <code class="tag-code">{time}</code> <code class="tag-code">{location}</code> <code class="tag-code">{leaderName}</code> <code class="tag-code">{permitStatus}</code> <code class="tag-code">{joinersList}</code> <code class="tag-code">{notes}</code>
              </p>
            </div>

            <form id="adminPromptForm" onsubmit="window.adminSettings.handleSavePrompts(event)">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.8rem;">
                  <i class="fa-solid fa-comment-sms" style="color: var(--color-amber);"></i> SMS Check-in Prompt Template
                </label>
                <textarea id="promptSmsInput" class="form-textarea" style="min-height: 80px; font-size: 0.82rem; font-family: monospace;"></textarea>
              </div>

              <div class="form-group" style="margin-top: 14px;">
                <label class="form-label" style="font-size: 0.8rem;">
                  <i class="fa-solid fa-envelope-open-text" style="color: var(--color-forest);"></i> Email Operations Briefing Prompt Template
                </label>
                <textarea id="promptEmailInput" class="form-textarea" style="min-height: 180px; font-size: 0.82rem; font-family: monospace;"></textarea>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
                <button type="button" class="btn btn-outline" style="font-size: 0.78rem;" onclick="window.adminSettings.resetDefaultPrompts()">
                  <i class="fa-solid fa-rotate-left"></i> Reset Defaults
                </button>
                <button type="submit" class="btn btn-forest" style="font-size: 0.82rem;">
                  <i class="fa-solid fa-floppy-disk"></i> Save All Prompts
                </button>
              </div>
            </form>
          </div>

          <!-- TAB 4: Staff Access (RBAC) -->
          <div id="adminTabUsers" class="admin-tab-pane" style="display: none;">
            <div style="margin-bottom: 12px;">
              <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--color-forest); margin: 0;">
                Staff Role & Security Control
              </h4>
              <p style="font-size: 0.76rem; color: var(--color-text-muted); margin: 2px 0 0 0;">
                Grant or revoke Administrator and Media Staff permissions.
              </p>
            </div>

            <!-- Grant Form -->
            <form id="adminGrantForm" style="display: flex; gap: 8px; margin-bottom: 14px;" onsubmit="window.adminSettings.handleGrantUser(event)">
              <input type="text" id="grantUserEmail" class="form-input" placeholder="staff01 or leader@tamu.edu" required style="flex: 2; padding: 8px 12px; font-size: 0.82rem;" />
              <input type="text" id="grantUserName" class="form-input" placeholder="Staff Name" style="flex: 2; padding: 8px 12px; font-size: 0.82rem;" />
              <input type="password" id="grantUserPassword" class="form-input" placeholder="Password" required style="flex: 2; padding: 8px 12px; font-size: 0.82rem;" />
              <select id="grantUserRole" class="form-input" style="flex: 1; padding: 8px 10px; font-size: 0.82rem;">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" class="btn btn-forest" style="padding: 8px 14px; font-size: 0.8rem; white-space: nowrap;">
                <i class="fa-solid fa-user-plus"></i> Grant
              </button>
            </form>

            <div class="notion-table-wrap">
              <table class="notion-joiners-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email / ID</th>
                    <th>Role</th>
                    <th style="text-align: center; width: 60px;">Action</th>
                  </tr>
                </thead>
                <tbody id="adminUsersTableBody">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }

  injectGroupEditorModal() {
    if (document.getElementById('emailGroupEditorModal')) return;

    const modalDiv = document.createElement('div');
    modalDiv.id = 'emailGroupEditorModal';
    modalDiv.className = 'modal-backdrop';
    modalDiv.style.zIndex = '3200';
    modalDiv.innerHTML = `
      <div class="modal-card" style="max-width: 520px;">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3 class="modal-title" id="groupEditorModalTitle">
              <i class="fa-solid fa-folder-plus" style="color: var(--color-amber);"></i> Manage Distribution Group
            </h3>
            <p style="font-size: 0.76rem; color: var(--color-text-muted); margin: 0;">
              Configure recipient list for 1-click team broadcast.
            </p>
          </div>
          <button type="button" class="modal-close-btn" onclick="window.adminSettings.closeGroupEditorModal()" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form id="emailGroupEditorForm" onsubmit="window.adminSettings.handleSaveGroup(event)" style="padding: 22px;">
          <input type="hidden" id="editingGroupId" value="" />
          
          <div class="form-group">
            <label class="form-label">Group Name</label>
            <input type="text" id="groupNameInput" class="form-input" placeholder="e.g. Campus Table Volunteers" required />
          </div>

          <div class="form-group" style="margin-top: 12px;">
            <label class="form-label">Description / Purpose</label>
            <input type="text" id="groupDescInput" class="form-input" placeholder="e.g. Registered leaders for MSC tables" />
          </div>

          <div class="form-group" style="margin-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label class="form-label" style="margin: 0;">Recipient Email Addresses</label>
              <span id="groupRecipientCountBadge" style="font-size: 0.72rem; font-weight: 750; color: var(--color-amber);">
                0 Recipients
              </span>
            </div>
            <textarea id="groupEmailsInput" class="form-textarea" placeholder="Enter emails separated by comma or new line (e.g. a@tamu.edu, b@gmail.com)" required style="min-height: 110px; font-size: 0.84rem; font-family: monospace;" oninput="window.adminSettings.updateEditorRecipientCount()"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
            <button type="button" class="btn btn-outline" onclick="window.adminSettings.closeGroupEditorModal()">
              Cancel
            </button>
            <button type="submit" class="btn btn-forest">
              <i class="fa-solid fa-check"></i> Save Group
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }

  /* ==========================================================================
     Dedicated Outbound Broadcast Composer Modal (Direct Web Send + Mailto)
     ========================================================================== */
  injectBroadcastComposerModal() {
    if (document.getElementById('emailBroadcastComposerModal')) return;

    const modalDiv = document.createElement('div');
    modalDiv.id = 'emailBroadcastComposerModal';
    modalDiv.className = 'modal-backdrop';
    modalDiv.style.zIndex = '3300';
    modalDiv.innerHTML = `
      <div class="modal-card" style="max-width: 620px;">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3 class="modal-title" id="broadcastComposerModalTitle">
              <i class="fa-solid fa-paper-plane" style="color: var(--color-amber);"></i> Send Group Email Broadcast
            </h3>
            <p style="font-size: 0.76rem; color: var(--color-text-muted); margin: 0;">
              Dispatch live ministry briefing to selected distribution group.
            </p>
          </div>
          <button type="button" class="modal-close-btn" onclick="window.adminSettings.closeBroadcastComposerModal()" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form id="emailBroadcastComposerForm" onsubmit="window.adminSettings.handleExecuteBroadcast(event)" style="padding: 22px;">
          <input type="hidden" id="broadcastGroupId" value="" />
          
          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label class="form-label" style="margin: 0;">Recipients</label>
              <span id="broadcastRecipientCountBadge" style="font-size: 0.72rem; font-weight: 750; color: var(--color-forest);">
                0 Recipients
              </span>
            </div>
            <input type="text" id="broadcastRecipientsDisplay" class="form-input" readonly style="background: var(--color-sand-bg); font-family: monospace; font-size: 0.8rem;" />
          </div>

          <div class="form-group" style="margin-top: 12px;">
            <label class="form-label">Subject Line</label>
            <input type="text" id="broadcastSubjectInput" class="form-input" required style="font-weight: 700; font-size: 0.86rem;" />
          </div>

          <div class="form-group" style="margin-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label class="form-label" style="margin: 0;">Email Body</label>
              <button type="button" class="btn btn-outline" style="font-size: 0.7rem; padding: 2px 8px;" onclick="window.adminSettings.reloadBroadcastDefaultTemplate()">
                <i class="fa-solid fa-rotate"></i> Reset Template
              </button>
            </div>
            <textarea id="broadcastBodyInput" class="form-textarea" required style="min-height: 180px; font-size: 0.82rem; font-family: monospace; line-height: 1.5;"></textarea>
          </div>

          <!-- Status Banner for Real-time Dispatch Feedback -->
          <div id="broadcastStatusBanner" style="display: none; padding: 10px 12px; border-radius: 6px; font-size: 0.8rem; margin-top: 12px;"></div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; flex-wrap: wrap; gap: 8px;">
            <button type="button" class="btn btn-outline" onclick="window.adminSettings.launchBroadcastInMailClient()">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Open in Mail App
            </button>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn btn-outline" onclick="window.adminSettings.closeBroadcastComposerModal()">
                Cancel
              </button>
              <button type="submit" class="btn btn-forest" id="btnSendDirectBroadcast">
                <i class="fa-solid fa-paper-plane"></i> Send Live Email Now
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }

  openModal(tab = 'groups') {
    if (!window.authRBAC || !window.authRBAC.isAdmin()) {
      alert("Administrator Access Required: Only authorized administrators can open Admin Operations Control Center.");
      if (window.authRBAC) window.authRBAC.openLoginModal();
      return;
    }

    this.injectAdminModal();
    this.injectGroupEditorModal();
    this.injectBroadcastComposerModal();

    this.switchTab(tab);
    const m = document.getElementById('adminCenterModal');
    if (m) {
      m.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('adminCenterModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  switchTab(tabKey) {
    this.currentTab = tabKey;
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabKey);
    });

    const panes = {
      groups: document.getElementById('adminTabGroups'),
      inbound: document.getElementById('adminTabInbound'),
      prompts: document.getElementById('adminTabPrompts'),
      users: document.getElementById('adminTabUsers')
    };

    Object.keys(panes).forEach(k => {
      if (panes[k]) {
        panes[k].style.display = k === tabKey ? 'block' : 'none';
      }
    });

    if (tabKey === 'groups') this.renderEmailGroups();
    if (tabKey === 'inbound') this.renderInboundTab();
    if (tabKey === 'prompts') this.renderPromptsTab();
    if (tabKey === 'users') this.renderUsersTab();
  }

  renderEmailGroups() {
    const container = document.getElementById('adminEmailGroupsList');
    if (!container) return;

    container.innerHTML = this.groups.map(grp => `
      <div class="admin-group-card" data-id="${grp.id}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <h5 style="font-size: 0.88rem; font-weight: 800; color: var(--color-forest); margin: 0;">
              ${grp.name}
            </h5>
            <p style="font-size: 0.72rem; color: var(--color-text-muted); margin: 2px 0 0 0;">
              ${grp.description}
            </p>
          </div>
          <div style="display: flex; gap: 4px;">
            <button type="button" class="btn-icon-mini" onclick="window.adminSettings.openEditGroupModal('${grp.id}')" title="Edit Group">
              <i class="fa-solid fa-pen"></i>
            </button>
            ${grp.id !== 'grp_staff' && grp.id !== 'grp_leaders' ? `
              <button type="button" class="btn-icon-mini btn-icon-delete" onclick="window.adminSettings.deleteGroup('${grp.id}')" title="Delete Group">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Email Chips -->
        <div class="admin-email-chips">
          ${grp.emails.map(em => `<span class="email-chip">${em}</span>`).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--color-sand-border);">
          <span style="font-size: 0.74rem; font-weight: 700; color: var(--color-amber);">
            <i class="fa-solid fa-at"></i> ${grp.emails.length} Recipients
          </span>
          <button type="button" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.74rem;" onclick="window.adminSettings.openBroadcastComposerModal('${grp.id}')">
            <i class="fa-solid fa-paper-plane"></i> Send Group Email
          </button>
        </div>
      </div>
    `).join('');
  }

  renderInboundTab() {
    const keyInput = document.getElementById('inboundAccessKeyInput');
    const recInput = document.getElementById('inboundRecipientsInput');

    if (keyInput) keyInput.value = this.inbound.accessKey || DEFAULT_INBOUND_SETTINGS.accessKey;
    if (recInput) recInput.value = (this.inbound.recipients || DEFAULT_INBOUND_SETTINGS.recipients).join(',\n');

    this.updateInboundRecipientCount();
  }

  updateInboundRecipientCount() {
    const recInput = document.getElementById('inboundRecipientsInput');
    const badge = document.getElementById('inboundRecipientCountBadge');
    const previewContainer = document.getElementById('inboundRecipientChipsPreview');

    if (!recInput || !badge) return;

    const raw = recInput.value.trim();
    const list = raw.split(/[,;\n\s]+/).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    badge.textContent = `${list.length} Recipient(s)`;

    if (previewContainer) {
      previewContainer.innerHTML = list.map(em => `<span class="email-chip" style="background: rgba(18,54,37,0.08);">${em}</span>`).join('');
    }
  }

  handleSaveInboundSettings(e) {
    e.preventDefault();
    const accessKey = document.getElementById('inboundAccessKeyInput').value.trim();
    const rawRecipients = document.getElementById('inboundRecipientsInput').value.trim();

    if (!accessKey) {
      alert("Please provide a valid Web3Forms Access Key.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const parsed = rawRecipients.split(/[,;\n\s]+/).map(e => e.trim()).filter(Boolean);
    const valid = parsed.filter(e => emailRegex.test(e));
    const invalid = parsed.filter(e => !emailRegex.test(e));

    if (invalid.length > 0) {
      alert(`Invalid emails detected:\n${invalid.join('\n')}\n\nPlease correct them.`);
      return;
    }

    if (valid.length === 0) {
      alert("Please add at least one notification recipient email.");
      return;
    }

    const unique = [...new Set(valid)];

    this.saveInboundSettings({
      accessKey: accessKey,
      recipients: unique,
      notifyLeaders: true,
      autoReply: true
    });

    alert("Inbound Routing Settings saved! Future Contact Us messages and Volunteer applications will be routed directly to these recipients.");
  }

  async testInboundEmailDispatch() {
    const key = this.inbound.accessKey || DEFAULT_INBOUND_SETTINGS.accessKey;
    const recipients = (this.inbound.recipients || DEFAULT_INBOUND_SETTINGS.recipients).join(', ');

    if (!confirm(`Send a live test notification to [${recipients}]?`)) return;

    try {
      const payload = {
        access_key: key,
        subject: "[Tree of Life Test] Inbound Form Notification Test",
        from_name: "Tree of Life System Diagnostic",
        email: "system@treeoflifemissions.org",
        message: `This is a verified test dispatch from Tree of Life Global Missions Admin Center.\n\nTarget Inboxes: ${recipients}\nTimestamp: ${new Date().toLocaleString('en-US')}\nStatus: Routing operational.`,
        to: recipients
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        alert("Test notification successfully dispatched! Check your configured email inboxes.");
      } else {
        alert(`Dispatch notice: ${data.message || 'Check your Web3Forms access key.'}`);
      }
    } catch (err) {
      alert(`Dispatch error: ${err.message}. Please check your internet connection.`);
    }
  }

  renderPromptsTab() {
    const smsInput = document.getElementById('promptSmsInput');
    const emailInput = document.getElementById('promptEmailInput');
    if (smsInput) smsInput.value = this.templates.sms || DEFAULT_PROMPT_TEMPLATES.sms;
    if (emailInput) emailInput.value = this.templates.email || DEFAULT_PROMPT_TEMPLATES.email;
  }

  handleSavePrompts(e) {
    e.preventDefault();
    const sms = document.getElementById('promptSmsInput').value.trim();
    const email = document.getElementById('promptEmailInput').value.trim();

    if (!sms || !email) {
      alert("Please ensure both SMS and Email prompts have content.");
      return;
    }

    this.saveTemplates({ sms, email });
    alert("Smart Prompts & Templates successfully saved! Schedule dispatches will now use this format.");
  }

  resetDefaultPrompts() {
    if (confirm("Reset prompts to official Tree of Life standard templates?")) {
      this.saveTemplates(DEFAULT_PROMPT_TEMPLATES);
      this.renderPromptsTab();
      alert("Prompts reset to defaults.");
    }
  }

  renderUsersTab() {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody || !window.authRBAC) return;

    tbody.innerHTML = window.authRBAC.users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.username ? `${u.username} <span style="color:var(--color-text-muted); font-size:0.75rem;">(${u.email})</span>` : u.email}</td>
        <td><span class="role-badge role-${u.role}">${u.role.toUpperCase()}</span></td>
        <td style="text-align: center;">
          ${(u.email.toLowerCase() !== (window.authRBAC.users[0]?.email?.toLowerCase() || 'john0823.lee@gmail.com') && u.username !== 'admin') ? `
            <button type="button" class="btn-remove-joiner" onclick="window.authRBAC.revokePermission('${u.email}'); window.adminSettings.renderUsersTab();" title="Revoke Permission">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          ` : '<span style="color: var(--color-text-muted); font-size: 0.72rem; font-weight: 750;">Super</span>'}
        </td>
      </tr>
    `).join('');
  }

  handleGrantUser(e) {
    e.preventDefault();
    const identifier = document.getElementById('grantUserEmail').value.trim();
    const name = document.getElementById('grantUserName').value.trim();
    const password = document.getElementById('grantUserPassword') ? document.getElementById('grantUserPassword').value.trim() : 'TreeOfLife2026!';
    const role = document.getElementById('grantUserRole').value;

    if (!identifier) return;

    window.authRBAC.grantPermission(identifier, name, role, password);
    document.getElementById('grantUserEmail').value = '';
    document.getElementById('grantUserName').value = '';
    if (document.getElementById('grantUserPassword')) document.getElementById('grantUserPassword').value = '';
    this.renderUsersTab();
    alert(`Permission granted to ${name || identifier} as ${role.toUpperCase()} (ID/Password configured)!`);
  }

  /* ==========================================================================
     Group Editor Modal
     ========================================================================== */
  openCreateGroupModal() {
    this.injectGroupEditorModal();
    const modal = document.getElementById('emailGroupEditorModal');
    const title = document.getElementById('groupEditorModalTitle');
    const idInput = document.getElementById('editingGroupId');
    const nameInput = document.getElementById('groupNameInput');
    const descInput = document.getElementById('groupDescInput');
    const emailsInput = document.getElementById('groupEmailsInput');

    if (!modal) return;

    title.innerHTML = `<i class="fa-solid fa-folder-plus" style="color: var(--color-amber);"></i> Create New Email Group`;
    idInput.value = "";
    nameInput.value = "";
    descInput.value = "";
    emailsInput.value = "";
    this.updateEditorRecipientCount();

    modal.classList.add('active');
  }

  openEditGroupModal(groupId) {
    this.injectGroupEditorModal();
    const grp = this.groups.find(g => g.id === groupId);
    if (!grp) return;

    const modal = document.getElementById('emailGroupEditorModal');
    const title = document.getElementById('groupEditorModalTitle');
    const idInput = document.getElementById('editingGroupId');
    const nameInput = document.getElementById('groupNameInput');
    const descInput = document.getElementById('groupDescInput');
    const emailsInput = document.getElementById('groupEmailsInput');

    if (!modal) return;

    title.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--color-forest);"></i> Edit "${grp.name}" Group`;
    idInput.value = grp.id;
    nameInput.value = grp.name;
    descInput.value = grp.description || "";
    emailsInput.value = grp.emails.join(',\n');
    this.updateEditorRecipientCount();

    modal.classList.add('active');
  }

  closeGroupEditorModal() {
    const modal = document.getElementById('emailGroupEditorModal');
    if (modal) modal.classList.remove('active');
  }

  updateEditorRecipientCount() {
    const emailsInput = document.getElementById('groupEmailsInput');
    const countBadge = document.getElementById('groupRecipientCountBadge');
    if (!emailsInput || !countBadge) return;

    const raw = emailsInput.value.trim();
    const list = raw.split(/[,;\n\s]+/).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    countBadge.textContent = `${list.length} Valid Recipient(s)`;
  }

  handleSaveGroup(e) {
    e.preventDefault();
    const id = document.getElementById('editingGroupId').value.trim();
    const name = document.getElementById('groupNameInput').value.trim();
    const desc = document.getElementById('groupDescInput').value.trim();
    const rawEmails = document.getElementById('groupEmailsInput').value.trim();

    if (!name) {
      alert("Please enter a group name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const parsed = rawEmails
      .split(/[,;\n\s]+/)
      .map(em => em.trim())
      .filter(Boolean);

    const validEmails = parsed.filter(em => emailRegex.test(em));
    const invalidEmails = parsed.filter(em => !emailRegex.test(em));

    if (invalidEmails.length > 0) {
      alert(`Invalid email addresses detected:\n${invalidEmails.join('\n')}\n\nPlease correct them before saving.`);
      return;
    }

    if (validEmails.length === 0) {
      alert("Please enter at least one valid recipient email address.");
      return;
    }

    const uniqueEmails = [...new Set(validEmails)];

    if (id) {
      const existing = this.groups.find(g => g.id === id);
      if (existing) {
        existing.name = name;
        existing.description = desc || "Custom distribution group";
        existing.emails = uniqueEmails;
      }
    } else {
      this.groups.push({
        id: "grp_" + Date.now(),
        name: name,
        description: desc || "Custom distribution group",
        emails: uniqueEmails
      });
    }

    this.saveGroups(this.groups);
    this.closeGroupEditorModal();
    this.renderEmailGroups();
  }

  deleteGroup(groupId) {
    const grp = this.groups.find(g => g.id === groupId);
    if (!grp) return;

    if (confirm(`Delete email group "${grp.name}"? This action cannot be undone.`)) {
      this.groups = this.groups.filter(g => g.id !== groupId);
      this.saveGroups(this.groups);
      this.renderEmailGroups();
    }
  }

  /* ==========================================================================
     Broadcast Composer & Direct Live Email Dispatcher
     ========================================================================== */
  openBroadcastComposerModal(groupId) {
    this.injectBroadcastComposerModal();
    const grp = this.groups.find(g => g.id === groupId);
    if (!grp || grp.emails.length === 0) {
      alert("Selected group has no registered recipient emails.");
      return;
    }

    const modal = document.getElementById('emailBroadcastComposerModal');
    const idInput = document.getElementById('broadcastGroupId');
    const countBadge = document.getElementById('broadcastRecipientCountBadge');
    const recDisplay = document.getElementById('broadcastRecipientsDisplay');
    const subjectInput = document.getElementById('broadcastSubjectInput');
    const bodyInput = document.getElementById('broadcastBodyInput');
    const statusBanner = document.getElementById('broadcastStatusBanner');

    if (!modal) return;

    idInput.value = grp.id;
    countBadge.textContent = `${grp.emails.length} Recipients in "${grp.name}"`;
    recDisplay.value = grp.emails.join(', ');
    subjectInput.value = `[Tree of Life Missions] Ministry Operations Update: ${grp.name}`;

    const defaultBriefing = this.renderTemplate('email', {
      title: "Monthly Campus & Table Outreach Operations",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: "Scheduled Outreach Slots",
      location: "Texas A&M Campus & Downtown Bryan",
      campus: "Texas Campus",
      permitStatus: "Approved",
      leaderName: "Director Mike",
      leaderPhone: "+1-979-555-0100",
      leaderEmail: "admin@treeoflifemissions.org",
      joiners: [],
      notes: "Please review upcoming schedule details and pray for the gospel outreach."
    });

    bodyInput.value = defaultBriefing;
    if (statusBanner) statusBanner.style.display = 'none';

    modal.classList.add('active');
  }

  closeBroadcastComposerModal() {
    const modal = document.getElementById('emailBroadcastComposerModal');
    if (modal) modal.classList.remove('active');
  }

  reloadBroadcastDefaultTemplate() {
    const bodyInput = document.getElementById('broadcastBodyInput');
    if (!bodyInput) return;
    bodyInput.value = this.templates.email || DEFAULT_PROMPT_TEMPLATES.email;
  }

  launchBroadcastInMailClient() {
    const recDisplay = document.getElementById('broadcastRecipientsDisplay');
    const subjectInput = document.getElementById('broadcastSubjectInput');
    const bodyInput = document.getElementById('broadcastBodyInput');

    if (!recDisplay || !subjectInput || !bodyInput) return;

    const toField = recDisplay.value;
    const subject = encodeURIComponent(subjectInput.value);
    const body = encodeURIComponent(bodyInput.value);

    window.location.href = `mailto:${toField}?subject=${subject}&body=${body}`;
  }

  async handleExecuteBroadcast(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSendDirectBroadcast');
    const recDisplay = document.getElementById('broadcastRecipientsDisplay');
    const subjectInput = document.getElementById('broadcastSubjectInput');
    const bodyInput = document.getElementById('broadcastBodyInput');
    const statusBanner = document.getElementById('broadcastStatusBanner');

    if (!btn || !recDisplay || !subjectInput || !bodyInput) return;

    const key = this.inbound.accessKey || DEFAULT_INBOUND_SETTINGS.accessKey;
    const recipients = recDisplay.value;
    const subject = subjectInput.value;
    const message = bodyInput.value;

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Live Email...`;

    try {
      const payload = {
        access_key: key,
        subject: subject,
        from_name: "Tree of Life Global Missions Operations",
        email: "admin@treeoflifemissions.org",
        message: message,
        to: recipients
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Live Email Now`;

      if (data.success) {
        if (statusBanner) {
          statusBanner.style.display = 'block';
          statusBanner.style.background = 'rgba(18, 54, 37, 0.1)';
          statusBanner.style.color = 'var(--color-forest)';
          statusBanner.style.border = '1px solid var(--color-forest)';
          statusBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Broadcast Dispatched!</strong> Live email sent to ${recipients}.`;
        }
        setTimeout(() => {
          this.closeBroadcastComposerModal();
        }, 1800);
      } else {
        throw new Error(data.message || "Failed to deliver via Web3Forms gateway.");
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Live Email Now`;

      if (statusBanner) {
        statusBanner.style.display = 'block';
        statusBanner.style.background = 'rgba(198, 40, 40, 0.1)';
        statusBanner.style.color = '#C62828';
        statusBanner.style.border = '1px solid #C62828';
        statusBanner.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Direct dispatch notice: ${err.message}. You can also use 'Open in Mail App'.`;
      }
    }
  }

  // Public helper to dispatch outbound emails directly from other pages (events.js, etc.)
  async sendOutboundEmail({ to, subject, message, senderName = "Tree of Life Operations" }) {
    const key = this.inbound.accessKey || DEFAULT_INBOUND_SETTINGS.accessKey;
    const payload = {
      access_key: key,
      subject: subject,
      from_name: senderName,
      email: "info@treeoflifemissions.org",
      message: message,
      to: to
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    });

    return await res.json();
  }
}

window.adminSettings = new AdminSettingsEngine();

