/**
 * Tree of Life Global Missions — Ministry Operations & Events Engine
 * Dynamic Category Management + Linear/Notion Status Architecture
 * 100% Zero-Emoji, Pure Professional English
 */

const DEFAULT_CATEGORIES = [
  { key: "all", name: "All Outreaches", fixed: true },
  { key: "campus", name: "Campus Tables" },
  { key: "downtown", name: "Downtown Bryan" },
  { key: "fellowship", name: "Table Fellowship" }
];

const DEFAULT_MINISTRY_EVENTS = [
  // September 2026 (Past Month)
  {
    id: "evt-091",
    title: "Texas A&M Fall Campus Prayer Walk & Welcome Table Setup",
    date: "2026-09-12",
    time: "9:30 AM - 1:00 PM",
    campus: "Texas A&M University",
    location: "Rudder Plaza & MSC Lawn, College Station, TX",
    category: "campus",
    description: "Prayer walk around campus dormitories and initial welcoming table for arriving international scholars.",
    author: "Director Mike",
    emailDispatched: true,
    permitStatus: "approved",
    leaderName: "Sarah Chen (TAMU Leader)",
    leaderPhone: "+1-979-555-0142",
    leaderEmail: "sarah.chen@tamu.edu",
    notes: "Campus orientation kickoff. 80 welcome packets distributed.",
    joiners: [
      { name: "John Kim", timeSlot: "9:30 AM - 1:00 PM", phone: "+1-979-555-0211" },
      { name: "Rachel Yoon", timeSlot: "10:00 AM - 1:00 PM", phone: "+1-979-555-0344" }
    ],
    isExpanded: false
  },
  {
    id: "evt-092",
    title: "Semester Kickoff International Table Fellowship Dinner",
    date: "2026-09-24",
    time: "6:30 PM - 8:30 PM",
    campus: "Mission Center",
    location: "2305 Barak Ln, Bryan, TX 77802",
    category: "fellowship",
    description: "Welcome dinner welcoming 35 international students from Korea, China, Brazil, and Egypt.",
    author: "Isis Hanna",
    emailDispatched: true,
    permitStatus: "approved",
    leaderName: "Hospitality Team",
    leaderPhone: "+1-979-555-0100",
    leaderEmail: "info@treeoflifemissions.org",
    notes: "Home-cooked Mediterranean dinner served.",
    joiners: [
      { name: "Grace Liu", timeSlot: "5:30 PM - 9:00 PM", phone: "+1-979-555-0224" },
      { name: "Samuel Park", timeSlot: "6:00 PM - 9:00 PM", phone: "+1-979-555-0299" }
    ],
    isExpanded: false
  },

  // October 2026 (This Month)
  {
    id: "evt-101",
    title: "Texas A&M Fall Welcome Outreach & Multi-Language Bible Table",
    date: "2026-10-01",
    time: "10:00 AM - 3:00 PM",
    campus: "Texas A&M University",
    location: "Memorial Student Center (MSC) 12th Man Plaza, College Station",
    category: "campus",
    description: "Setting up welcoming tables with Bibles in Mandarin, Spanish, Hindi, and Arabic for arriving international scholars.",
    author: "Director Mike",
    emailDispatched: true,
    permitStatus: "approved",
    leaderName: "Sarah Chen (TAMU Leader)",
    leaderPhone: "+1-979-555-0142",
    leaderEmail: "sarah.chen@tamu.edu",
    notes: "MSC Table #4 reserved. If raining, relocate to MSC Hallway A. 100 Mandarin & 50 Spanish Bibles packed.",
    joiners: [
      { name: "John Kim", timeSlot: "10:00 AM - 1:00 PM", phone: "+1-979-555-0211" },
      { name: "Grace Liu", timeSlot: "12:30 PM - 3:30 PM", phone: "+1-979-555-0224" },
      { name: "Samuel Park", timeSlot: "1:00 PM - 3:00 PM", phone: "+1-979-555-0299" }
    ],
    isExpanded: true
  },
  {
    id: "evt-102",
    title: "Historic Downtown Bryan First Friday Outreach & Prayer Walk",
    date: "2026-10-02",
    time: "6:00 PM - 9:30 PM",
    campus: "Downtown Bryan",
    location: "Main Street & 26th St, Downtown Bryan, TX",
    category: "downtown",
    description: "Joining the community festival to distribute free scriptures and offer prayer to students and visitors.",
    author: "Fayez Farag",
    emailDispatched: true,
    permitStatus: "approved",
    leaderName: "David Miller",
    leaderPhone: "+1-979-555-0188",
    leaderEmail: "david@treeoflifemissions.org",
    notes: "City of Bryan vendor permit renewed. Setup by 5:30 PM at the Main St intersection.",
    joiners: [
      { name: "Ethan Davis", timeSlot: "6:00 PM - 9:30 PM", phone: "+1-979-555-0312" },
      { name: "Rachel Yoon", timeSlot: "6:00 PM - 8:30 PM", phone: "+1-979-555-0344" }
    ],
    isExpanded: false
  },
  {
    id: "evt-103",
    title: "Blinn College Campus Bible Distribution & Student Welcome",
    date: "2026-10-15",
    time: "11:00 AM - 2:00 PM",
    campus: "Blinn College Bryan Campus",
    location: "Student Center Lawn, Bryan, TX",
    category: "campus",
    description: "Reaching community college international students with warm welcome bags and native-language New Testaments.",
    author: "Isis Hanna",
    emailDispatched: false,
    permitStatus: "submitted",
    leaderName: "Marcus Johnson (Blinn Leader)",
    leaderPhone: "+1-979-555-0199",
    leaderEmail: "marcus.j@blinn.edu",
    notes: "Awaiting final approval email from Student Activities Office by next Monday.",
    joiners: [
      { name: "Hannah Lee", timeSlot: "11:00 AM - 2:00 PM", phone: "+1-979-555-0410" }
    ],
    isExpanded: true
  },
  {
    id: "evt-104",
    title: "International Scholar Autumn Table Fellowship & Dinner",
    date: "2026-10-22",
    time: "6:30 PM - 8:30 PM",
    campus: "Mission Center",
    location: "2305 Barak Ln, Bryan, TX 77802",
    category: "fellowship",
    description: "Shared home-cooked meal, conversation circles, and open Bible Q&A for students from over 10 nations.",
    author: "Isis Hanna",
    emailDispatched: false,
    permitStatus: "approved",
    leaderName: "Hospitality Team",
    leaderPhone: "+1-979-555-0100",
    leaderEmail: "info@treeoflifemissions.org",
    notes: "Main hall prepped for 40 guests. Halal and vegetarian meal options prepared.",
    joiners: [
      { name: "Daniel Chang", timeSlot: "5:30 PM - 9:00 PM", phone: "+1-979-555-0511" },
      { name: "Maria Garcia", timeSlot: "6:00 PM - 9:00 PM", phone: "+1-979-555-0522" }
    ],
    isExpanded: false
  },

  // November 2026 (Next Month)
  {
    id: "evt-111",
    title: "Downtown Bryan First Friday Free Bible Stand & Outreach",
    date: "2026-11-06",
    time: "6:00 PM - 9:00 PM",
    campus: "Downtown Bryan",
    location: "Main Street, Downtown Bryan, TX",
    category: "downtown",
    description: "Monthly downtown festival scripture distribution table with bilingual New Testaments.",
    author: "Fayez Farag",
    emailDispatched: false,
    permitStatus: "approved",
    leaderName: "David Miller",
    leaderPhone: "+1-979-555-0188",
    leaderEmail: "david@treeoflifemissions.org",
    notes: "Space #12 assigned by Bryan Downtown Association.",
    joiners: [
      { name: "John Kim", timeSlot: "6:00 PM - 9:00 PM", phone: "+1-979-555-0211" }
    ],
    isExpanded: false
  },
  {
    id: "evt-112",
    title: "International Scholars Thanksgiving Feast & Gratitude Circle",
    date: "2026-11-19",
    time: "6:00 PM - 9:00 PM",
    campus: "Mission Center",
    location: "2305 Barak Ln, Bryan, TX 77802",
    category: "fellowship",
    description: "Traditional American Thanksgiving dinner prepared for international scholars experiencing the holiday for the first time.",
    author: "Isis Hanna",
    emailDispatched: false,
    permitStatus: "approved",
    leaderName: "Hospitality Team",
    leaderPhone: "+1-979-555-0100",
    leaderEmail: "info@treeoflifemissions.org",
    notes: "Turkeys donated by partner church. Volunteers needed for table setup by 4:00 PM.",
    joiners: [
      { name: "Grace Liu", timeSlot: "4:00 PM - 9:30 PM", phone: "+1-979-555-0224" },
      { name: "Ethan Davis", timeSlot: "5:00 PM - 9:30 PM", phone: "+1-979-555-0312" }
    ],
    isExpanded: true
  }
];

// Linear / Notion Professional Status System
const NOTION_STATUS_CONFIG = {
  pending: {
    key: "pending",
    label: "Pending Application",
    subLabel: "Not Applied",
    type: "pending"
  },
  submitted: {
    key: "submitted",
    label: "Application Submitted",
    subLabel: "In Review",
    type: "submitted"
  },
  approved: {
    key: "approved",
    label: "Campus Approved",
    subLabel: "Confirmed",
    type: "approved"
  }
};

class MinistryEventsEngine {
  constructor() {
    this.storageKey = 'tol_ministry_events_v7';
    this.smsLogsKey = 'tol_sms_dispatch_logs_v7';
    this.catStorageKey = 'tol_ministry_categories_v1';

    this.categories = this.loadCategories();
    this.events = this.loadEvents();
    this.smsLogs = this.loadSmsLogs();
    this.currentCategory = 'all';
    this.openDropdownEventId = null;

    // Monthly Calendar State (All Events default for complete visibility)
    this.currentViewDate = new Date(2026, 9, 1); // 9 = October (0-indexed)
    this.monthFilterMode = 'all'; // 'all' | 'month'

    this.initElements();
    this.bindEvents();
    this.updateMonthFilterUI();
    this.renderCategoryFilters();
    this.renderCategorySelectOptions();
    this.render();
  }

  loadCategories() {
    const saved = localStorage.getItem(this.catStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error reading categories", e);
      }
    }
    this.saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }

  saveCategories(cats) {
    localStorage.setItem(this.catStorageKey, JSON.stringify(cats));
  }

  loadEvents() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error reading events", e);
      }
    }
    this.saveEvents(DEFAULT_MINISTRY_EVENTS);
    return DEFAULT_MINISTRY_EVENTS;
  }

  saveEvents(events) {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  loadSmsLogs() {
    try {
      return JSON.parse(localStorage.getItem(this.smsLogsKey)) || [];
    } catch {
      return [];
    }
  }

  saveSmsLogs(logs) {
    localStorage.setItem(this.smsLogsKey, JSON.stringify(logs));
  }

  initElements() {
    this.container = document.getElementById('eventsListContainer');
    this.filterTrack = document.getElementById('categoryFilterTrack');
    
    // Modals
    this.createModal = document.getElementById('createEventModal');
    this.openCreateBtns = document.querySelectorAll('.btn-open-create-event');
    this.closeCreateBtn = document.getElementById('closeCreateEventBtn');
    this.createForm = document.getElementById('createEventForm');
    this.categorySelect = document.getElementById('evtCategory');

    // Category Modal
    this.categoryModal = document.getElementById('addCategoryModal');
    this.closeCategoryBtn = document.getElementById('closeAddCategoryBtn');
    this.categoryForm = document.getElementById('addCategoryForm');
    this.categoryNameInput = document.getElementById('newCategoryName');
    this.categoryKeyInput = document.getElementById('newCategoryKey');
    this.existingCategoriesList = document.getElementById('existingCategoriesList');

    // SMS Modal
    this.smsModal = document.getElementById('smsDispatchModal');
    this.closeSmsBtn = document.getElementById('closeSmsModalBtn');
    this.smsEventTitle = document.getElementById('smsEventTitle');
    this.smsLeaderName = document.getElementById('smsLeaderName');
    this.smsLeaderPhone = document.getElementById('smsLeaderPhone');
    this.smsMessageText = document.getElementById('smsMessageText');
    this.btnExecuteSms = document.getElementById('btnExecuteSms');
    this.btnSimulateSms = document.getElementById('btnSimulateSms');
    this.smsHistoryList = document.getElementById('smsHistoryList');

    // Monthly Calendar Controls (< Prev Month | Next Month >)
    this.btnPrevMonth = document.getElementById('btnPrevMonth');
    this.btnNextMonth = document.getElementById('btnNextMonth');
    this.currentMonthDisplay = document.getElementById('currentMonthDisplay');
    this.btnViewThisMonth = document.getElementById('btnViewThisMonth');
    this.btnViewAllMonths = document.getElementById('btnViewAllMonths');

    this.activeSmsEvent = null;
  }

  bindEvents() {
    this.openCreateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
          alert("Staff Login Required: Only authorized ministry staff can publish new events.");
          window.authRBAC.openLoginModal();
          return;
        }
        this.openCreateModal();
      });
    });

    if (this.closeCreateBtn) {
      this.closeCreateBtn.addEventListener('click', () => this.closeCreateModal());
    }

    if (this.createForm) {
      this.createForm.addEventListener('submit', (e) => this.handleCreateEvent(e));
    }

    // Category Name to Slug auto-generation
    if (this.categoryNameInput && this.categoryKeyInput) {
      this.categoryNameInput.addEventListener('input', () => {
        const slug = this.categoryNameInput.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        this.categoryKeyInput.value = slug;
      });
    }

    if (this.categoryForm) {
      this.categoryForm.addEventListener('submit', (e) => this.handleAddCategory(e));
    }

    // Monthly Calendar Navigation Controls (< Prev Month / Next Month >)
    if (this.btnPrevMonth) {
      this.btnPrevMonth.addEventListener('click', () => {
        this.currentViewDate.setMonth(this.currentViewDate.getMonth() - 1);
        this.monthFilterMode = 'month';
        this.updateMonthFilterUI();
        this.render();
      });
    }

    if (this.btnNextMonth) {
      this.btnNextMonth.addEventListener('click', () => {
        this.currentViewDate.setMonth(this.currentViewDate.getMonth() + 1);
        this.monthFilterMode = 'month';
        this.updateMonthFilterUI();
        this.render();
      });
    }

    if (this.btnViewThisMonth) {
      this.btnViewThisMonth.addEventListener('click', () => {
        this.monthFilterMode = 'month';
        this.updateMonthFilterUI();
        this.render();
      });
    }

    if (this.btnViewAllMonths) {
      this.btnViewAllMonths.addEventListener('click', () => {
        this.monthFilterMode = 'all';
        this.updateMonthFilterUI();
        this.render();
      });
    }

    // Email Schedule Modal bindings
    this.initEmailScheduleFeature();

    if (this.closeCategoryBtn) {
      this.closeCategoryBtn.addEventListener('click', () => this.closeCategoryModal());
    }

    if (this.closeSmsBtn) {
      this.closeSmsBtn.addEventListener('click', () => this.closeSmsModal());
    }

    if (this.btnExecuteSms) {
      this.btnExecuteSms.addEventListener('click', () => this.sendNativeSMS());
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notion-status-picker-wrap')) {
        this.closeAllStatusDropdowns();
      }
    });
  }

  updateMonthFilterUI() {
    if (this.currentMonthDisplay) {
      const monthStr = this.currentViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      this.currentMonthDisplay.textContent = monthStr;
    }
    if (this.btnViewThisMonth && this.btnViewAllMonths) {
      if (this.monthFilterMode === 'month') {
        this.btnViewThisMonth.classList.add('active');
        this.btnViewAllMonths.classList.remove('active');
      } else {
        this.btnViewThisMonth.classList.remove('active');
        this.btnViewAllMonths.classList.add('active');
      }
    }
  }

  renderCategoryFilters() {
    if (!this.filterTrack) return;

    const isStaff = window.authRBAC && window.authRBAC.hasUploadPermission();

    const buttonsHtml = this.categories.map(c => `
      <button class="event-filter-btn ${this.currentCategory === c.key ? 'active' : ''}" data-category="${c.key}">
        ${c.name}
      </button>
    `).join('');

    const addBtnHtml = isStaff ? `
      <button class="event-filter-add-btn" onclick="window.eventsEngine.openCategoryModal()" title="Add / Manage Categories">
        <i class="fa-solid fa-plus"></i> Category
      </button>
    ` : '';

    this.filterTrack.innerHTML = buttonsHtml + addBtnHtml;

    // Rebind filter buttons
    this.filterTrack.querySelectorAll('.event-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterTrack.querySelectorAll('.event-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category || 'all';
        this.render();
      });
    });
  }

  renderCategorySelectOptions() {
    if (!this.categorySelect) return;
    this.categorySelect.innerHTML = this.categories
      .filter(c => c.key !== 'all')
      .map(c => `<option value="${c.key}">${c.name}</option>`)
      .join('');
  }

  openCategoryModal() {
    if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
      alert("Staff Login Required: Only authorized ministry staff can manage categories.");
      window.authRBAC.openLoginModal();
      return;
    }

    this.renderExistingCategoriesList();
    if (this.categoryModal) {
      this.categoryModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCategoryModal() {
    if (this.categoryModal) {
      this.categoryModal.classList.remove('active');
      document.body.style.overflow = '';
      if (this.categoryForm) this.categoryForm.reset();
    }
  }

  renderExistingCategoriesList() {
    if (!this.existingCategoriesList) return;
    this.existingCategoriesList.innerHTML = this.categories.map(c => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: #FFFFFF; border: 1px solid var(--color-sand-border); border-radius: 4px; font-size: 0.8rem;">
        <span><strong>${c.name}</strong> <code style="color: var(--color-text-muted);">(${c.key})</code></span>
        ${c.fixed ? `<span style="font-size: 0.7rem; color: var(--color-text-muted);">System</span>` : `
          <button type="button" onclick="window.eventsEngine.deleteCategory('${c.key}')" style="background: none; border: none; color: #D32F2F; cursor: pointer;" title="Delete category">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `}
      </div>
    `).join('');
  }

  handleAddCategory(e) {
    e.preventDefault();
    const name = this.categoryNameInput.value.trim();
    const key = this.categoryKeyInput.value.trim().toLowerCase();

    if (!name || !key) {
      alert("Please fill in category name and key.");
      return;
    }

    if (this.categories.some(c => c.key === key)) {
      alert(`Category with key "${key}" already exists.`);
      return;
    }

    this.categories.push({ key, name });
    this.saveCategories(this.categories);
    this.renderCategoryFilters();
    this.renderCategorySelectOptions();
    this.renderExistingCategoriesList();
    if (this.categoryForm) this.categoryForm.reset();

    alert(`Category "${name}" added successfully!`);
    this.closeCategoryModal();
  }

  deleteCategory(key) {
    if (confirm(`Are you sure you want to delete category "${key}"?`)) {
      this.categories = this.categories.filter(c => c.key !== key);
      this.saveCategories(this.categories);
      if (this.currentCategory === key) this.currentCategory = 'all';
      this.renderCategoryFilters();
      this.renderCategorySelectOptions();
      this.renderExistingCategoriesList();
      this.render();
    }
  }

  getFilteredEvents() {
    let filtered = [...this.events];

    // Category filter
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(e => e.category === this.currentCategory);
    }

    // Month filter
    if (this.monthFilterMode === 'month') {
      const targetYear = this.currentViewDate.getFullYear();
      const targetMonth = this.currentViewDate.getMonth(); // 0-11
      filtered = filtered.filter(e => {
        const d = new Date(e.date + "T00:00:00");
        return d.getFullYear() === targetYear && d.getMonth() === targetMonth;
      });
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  toggleStatusDropdown(eventId, event) {
    if (event) event.stopPropagation();
    if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
      alert("Staff Login Required: Only authorized leaders can update permit statuses.");
      if (window.authRBAC) window.authRBAC.openLoginModal();
      return;
    }
    if (this.openDropdownEventId === eventId) {
      this.openDropdownEventId = null;
    } else {
      this.openDropdownEventId = eventId;
    }
    this.render();
  }

  closeAllStatusDropdowns() {
    if (this.openDropdownEventId !== null) {
      this.openDropdownEventId = null;
      this.render();
    }
  }

  selectPermitStatus(eventId, newStatus, event) {
    if (event) event.stopPropagation();
    if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
      alert("Staff Login Required: Only authorized leaders can update permit statuses.");
      if (window.authRBAC) window.authRBAC.openLoginModal();
      return;
    }
    const evt = this.events.find(e => e.id === eventId);
    if (evt) {
      evt.permitStatus = newStatus;
      this.saveEvents(this.events);
      this.openDropdownEventId = null;
      this.render();
    }
  }

  toggleNotionDrawer(eventId) {
    const evt = this.events.find(e => e.id === eventId);
    if (evt) {
      evt.isExpanded = !evt.isExpanded;
      this.saveEvents(this.events);
      this.render();
    }
  }

  updateEventNotes(eventId, notesText) {
    const evt = this.events.find(e => e.id === eventId);
    if (evt) {
      evt.notes = notesText;
      this.saveEvents(this.events);
    }
  }

  addStudentJoiner(eventId) {
    const nameInput = document.getElementById(`joinerName_${eventId}`);
    const timeInput = document.getElementById(`joinerTime_${eventId}`);
    const phoneInput = document.getElementById(`joinerPhone_${eventId}`);

    if (!nameInput || !nameInput.value.trim()) {
      alert("Please enter student name.");
      return;
    }

    const evt = this.events.find(e => e.id === eventId);
    if (evt) {
      if (!evt.joiners) evt.joiners = [];
      evt.joiners.push({
        name: nameInput.value.trim(),
        timeSlot: timeInput ? timeInput.value.trim() : "Flexible",
        phone: phoneInput ? phoneInput.value.trim() : "N/A"
      });
      this.saveEvents(this.events);
      this.render();
    }
  }

  removeStudentJoiner(eventId, index) {
    const evt = this.events.find(e => e.id === eventId);
    if (evt && evt.joiners) {
      evt.joiners.splice(index, 1);
      this.saveEvents(this.events);
      this.render();
    }
  }

  render() {
    if (!this.container) return;
    this.updateMonthFilterUI();
    const isStaff = Boolean(window.authRBAC && window.authRBAC.hasUploadPermission());
    const isAdmin = Boolean(window.authRBAC && window.authRBAC.isAdmin());
    const filtered = this.getFilteredEvents();

    if (filtered.length === 0) {
      const monthStr = this.currentViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      this.container.innerHTML = `
        <div style="text-align: center; padding: 48px 24px; color: var(--color-text-muted); background: var(--color-white); border-radius: var(--radius-md); border: 1px solid var(--color-sand-border);">
          <i class="fa-regular fa-calendar-xmark" style="font-size: 2rem; color: var(--color-amber); margin-bottom: 12px; display: block;"></i>
          <h4 style="font-size: 1.1rem; color: var(--color-forest); font-weight: 800; margin-bottom: 6px;">No Operations for ${this.monthFilterMode === 'month' ? monthStr : 'Selected Category'}</h4>
          <p style="font-size: 0.88rem; max-width: 440px; margin: 0 auto 16px auto; line-height: 1.6;">There are no field outreaches or Bible tables scheduled for this specific period. Use the <strong>&lt; &gt;</strong> buttons above to switch months or view all operations.</p>
          <button type="button" class="btn btn-outline" onclick="window.eventsEngine.btnViewAllMonths.click()" style="font-size: 0.8rem; padding: 6px 14px;">
            View All Operations
          </button>
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(evt => {
      const isExpanded = !!evt.isExpanded;
      const joinersCount = (evt.joiners && evt.joiners.length) || 0;
      const currentStatusKey = evt.permitStatus || 'pending';
      const currentConfig = NOTION_STATUS_CONFIG[currentStatusKey] || NOTION_STATUS_CONFIG.pending;
      const isDropdownOpen = this.openDropdownEventId === evt.id;

      return `
        <div class="event-card-item" data-id="${evt.id}">
          <div class="event-date-badge">
            <div class="event-month">${this.formatMonth(evt.date)}</div>
            <div class="event-day">${this.formatDay(evt.date)}</div>
          </div>

          <div class="event-main-content">
            <div class="event-header-row">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="event-type-tag tag-${evt.category}">#${evt.category.toUpperCase()}</span>
                ${evt.emailDispatched ? `
                  <span class="email-dispatched-badge" title="Email announcement broadcasted">
                    <i class="fa-solid fa-paper-plane"></i> Broadcasted
                  </span>
                ` : ''}
              </div>
              <div class="event-meta-right" style="display: flex; align-items: center; gap: 8px;">
                <span><i class="fa-solid fa-clock"></i> ${evt.time}</span>
                <span>•</span>
                <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                ${isStaff ? `
                  <button type="button" class="btn-delete-event" onclick="window.eventsEngine.deleteEvent('${evt.id}', event)" title="Delete Operation (Staff Only)" style="background: none; border: 1px solid rgba(220, 38, 38, 0.25); color: #dc2626; border-radius: 6px; padding: 2px 7px; font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-left: 6px; transition: all 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='none'">
                    <i class="fa-solid fa-trash-can"></i> Delete
                  </button>
                ` : ''}
              </div>
            </div>

            <h3 class="event-title">${evt.title}</h3>
            <p class="event-desc">${evt.description}</p>

            <!-- Linear-Style Master Control Strip -->
            <div class="notion-permit-strip">
              <div class="notion-leader-cell">
                <span class="notion-label">Lead:</span>
                <span class="leader-name-pill"><i class="fa-solid fa-user-check"></i> ${evt.leaderName || 'Unassigned'}</span>
              </div>

              <!-- Linear Status Button (Interactive for Staff / Read-Only for Guest) -->
              <div class="notion-status-cell">
                <span class="notion-label">Permit:</span>
                <div class="notion-status-picker-wrap">
                  
                  ${isStaff ? `
                    <button class="status-btn-linear status-${currentConfig.type}" onclick="window.eventsEngine.toggleStatusDropdown('${evt.id}', event)" title="Click to update permit status">
                      <span class="status-dot"></span>
                      <span class="status-title">${currentConfig.label}</span>
                      <i class="fa-solid fa-chevron-down status-chevron ${isDropdownOpen ? 'open' : ''}"></i>
                    </button>

                    <!-- Linear Clean Popover -->
                    ${isDropdownOpen ? `
                      <div class="linear-status-popover">
                        <div class="popover-section-label">Update Permit Status</div>
                        ${Object.keys(NOTION_STATUS_CONFIG).map(k => {
                          const conf = NOTION_STATUS_CONFIG[k];
                          const isSelected = k === currentStatusKey;
                          return `
                            <div class="linear-menu-row ${isSelected ? 'active' : ''}" onclick="window.eventsEngine.selectPermitStatus('${evt.id}', '${k}', event)">
                              <div class="row-left">
                                <span class="status-dot dot-${conf.type}"></span>
                                <span class="row-text">${conf.label}</span>
                                <span class="row-sub">${conf.subLabel}</span>
                              </div>
                              ${isSelected ? '<i class="fa-solid fa-check row-check"></i>' : ''}
                            </div>
                          `;
                        }).join('')}
                      </div>
                    ` : ''}
                  ` : `
                    <div class="status-btn-linear status-${currentConfig.type} status-readonly" style="cursor: default; pointer-events: none;" title="Permit status: ${currentConfig.label}">
                      <span class="status-dot"></span>
                      <span class="status-title">${currentConfig.label}</span>
                    </div>
                  `}

                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <!-- Notion Toggle Details Button -->
                <button class="notion-toggle-btn ${isExpanded ? 'active' : ''}" onclick="window.eventsEngine.toggleNotionDrawer('${evt.id}')">
                  <i class="fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}"></i>
                  <span>${isExpanded ? 'Hide Board' : `Roster & Notes (${joinersCount})`}</span>
                </button>

                <!-- SMS Trigger (Staff Only) -->
                ${isStaff ? `
                  <button class="btn-sms-trigger" onclick="window.eventsEngine.openSmsModal('${evt.id}')" title="Send SMS Check-in to Leader">
                    <i class="fa-solid fa-comment-sms"></i> Check-in SMS
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Notion Expandable Drawer Block -->
            ${isExpanded ? `
              <div class="notion-expandable-box">
                
                <!-- 1. Live Changes & Operational Memos -->
                <div class="notion-memo-section">
                  <div class="notion-sub-heading">
                    <i class="fa-solid fa-align-left" style="color: var(--color-amber);"></i>
                    <span>Campus Logistics & Change Notes</span>
                  </div>
                  ${isStaff ? `
                    <textarea class="notion-memo-input" placeholder="Enter venue updates, backup rain plans, or Bible inventory..." oninput="window.eventsEngine.updateEventNotes('${evt.id}', this.value)">${evt.notes || ''}</textarea>
                  ` : `
                    <div class="notion-memo-readonly" style="background: var(--color-sand-bg); border: 1px solid var(--color-sand-border); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 0.86rem; color: var(--color-text-main); min-height: 48px; line-height: 1.5;">
                      ${evt.notes ? evt.notes : '<em style="color: var(--color-text-muted);">No operational updates logged.</em>'}
                    </div>
                  `}
                </div>

                <!-- 2. Student Volunteers / Joiners Roster -->
                <div class="notion-roster-section">
                  <div class="notion-sub-heading">
                    <i class="fa-solid fa-users" style="color: var(--color-forest);"></i>
                    <span>Student Volunteer Roster (${joinersCount} Registered)</span>
                  </div>

                  <!-- Joiners Table / Mobile Card List -->
                  <div class="notion-table-wrap">
                    <table class="notion-joiners-table">
                      <thead>
                        <tr>
                          <th>Student Volunteer</th>
                          <th>Time Slot</th>
                          <th>Phone</th>
                          ${isStaff ? '<th style="width: 40px; text-align: center;"></th>' : ''}
                        </tr>
                      </thead>
                      <tbody>
                        ${(evt.joiners && evt.joiners.length > 0) ? evt.joiners.map((j, idx) => `
                          <tr>
                            <td class="col-name">
                              <span class="mobile-only-label">Volunteer:</span>
                              <strong>${j.name}</strong>
                            </td>
                            <td class="col-time">
                              <span class="mobile-only-label">Time Slot:</span>
                              <span class="time-slot-badge"><i class="fa-regular fa-clock"></i> ${j.timeSlot}</span>
                            </td>
                            <td class="col-phone">
                              <span class="mobile-only-label">Phone:</span>
                              <a href="tel:${j.phone}" class="phone-link"><i class="fa-solid fa-phone"></i> ${j.phone}</a>
                            </td>
                            ${isStaff ? `
                              <td class="col-action" style="text-align: center;">
                                <button class="btn-remove-joiner" onclick="window.eventsEngine.removeStudentJoiner('${evt.id}', ${idx})" title="Remove Volunteer">
                                  <i class="fa-solid fa-xmark"></i> Remove
                                </button>
                              </td>
                            ` : ''}
                          </tr>
                        `).join('') : `
                          <tr>
                            <td colspan="${isStaff ? 4 : 3}" style="text-align: center; color: var(--color-text-muted); font-size: 0.82rem; padding: 16px;">
                              No volunteer joiners added yet.
                            </td>
                          </tr>
                        `}
                      </tbody>
                    </table>
                  </div>

                  <!-- Quick Add Student Joiner Form (Protected: Staff only) -->
                  ${isStaff ? `
                    <div class="notion-add-joiner-bar">
                      <input type="text" id="joinerName_${evt.id}" class="notion-mini-input" placeholder="Student Name (e.g. Rachel Kim)" />
                      <input type="text" id="joinerTime_${evt.id}" class="notion-mini-input" placeholder="Time (e.g. 10:00 AM - 1:00 PM)" />
                      <input type="text" id="joinerPhone_${evt.id}" class="notion-mini-input" placeholder="Phone (e.g. +1-979-555-0199)" />
                      <button type="button" class="btn btn-forest" style="padding: 6px 14px; font-size: 0.78rem;" onclick="window.eventsEngine.addStudentJoiner('${evt.id}')">
                        <i class="fa-solid fa-plus"></i> Add
                      </button>
                    </div>
                  ` : ''}
                </div>

              </div>
            ` : ''}

          </div>
        </div>
      `;
    }).join('');

    if (window.authRBAC) {
      window.authRBAC.updateProtectedElements();
    }
  }

  formatMonth(dateStr) {
    if (!dateStr) return 'OCT';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  }

  formatDay(dateStr) {
    if (!dateStr) return '01';
    return dateStr.split('-')[2] || '01';
  }

  deleteEvent(eventId, event) {
    if (event) event.stopPropagation();
    if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
      alert("Staff Login Required: Only authorized ministry staff or administrators can delete operations.");
      if (window.authRBAC) window.authRBAC.openLoginModal();
      return;
    }

    const evt = this.events.find(e => e.id === eventId);
    const title = evt ? evt.title : "this operation";
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.events = this.events.filter(e => e.id !== eventId);
      this.saveEvents(this.events);
      this.render();
    }
  }

  openCreateModal() {
    if (this.createModal) {
      this.createModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCreateModal() {
    if (this.createModal) {
      this.createModal.classList.remove('active');
      document.body.style.overflow = '';
      if (this.createForm) this.createForm.reset();
    }
  }

  handleCreateEvent(e) {
    e.preventDefault();

    const title = document.getElementById('evtTitle').value.trim();
    const date = document.getElementById('evtDate').value;
    const time = document.getElementById('evtTime').value.trim();
    const location = document.getElementById('evtLocation').value.trim();
    const campus = document.getElementById('evtCampus').value.trim();
    const category = document.getElementById('evtCategory').value;
    const description = document.getElementById('evtDesc').value.trim();
    const leaderName = document.getElementById('evtLeaderName').value.trim() || 'Staff Leader';
    const leaderPhone = document.getElementById('evtLeaderPhone').value.trim() || '+1-979-555-0100';
    const leaderEmail = document.getElementById('evtLeaderEmail').value.trim() || 'info@treeoflifemissions.org';
    const permitStatus = document.getElementById('evtPermitStatus').value || 'pending';
    const sendEmail = document.getElementById('evtSendEmail').checked;

    const newEvent = {
      id: "evt-" + Date.now(),
      title,
      date,
      time,
      location,
      campus: campus || "Texas Campus",
      category,
      description,
      author: window.authRBAC?.currentUser?.name || "Director Mike",
      emailDispatched: sendEmail,
      permitStatus,
      leaderName,
      leaderPhone,
      leaderEmail,
      notes: "New event created. Awaiting campus setup details.",
      joiners: [],
      isExpanded: true
    };

    this.events.unshift(newEvent);
    this.saveEvents(this.events);

    // Auto-adjust view to the created event's date and show in All Operations mode
    if (date) {
      const eventDate = new Date(date + "T00:00:00");
      if (!isNaN(eventDate.getTime())) {
        this.currentViewDate = eventDate;
      }
    }
    this.monthFilterMode = 'all';
    this.currentCategory = 'all';
    this.updateMonthFilterUI();
    this.renderCategoryFilters();

    if (sendEmail) {
      alert(`Event Published & Broadcast Dispatched!\n\n"${title}" has been added to the schedule.`);
    } else {
      alert(`Event "${title}" published successfully.`);
    }

    this.closeCreateModal();
    this.render();
  }

  openSmsModal(eventId) {
    const evt = this.events.find(e => e.id === eventId);
    if (!evt) return;

    this.activeSmsEvent = evt;
    if (this.smsEventTitle) this.smsEventTitle.textContent = evt.title;
    if (this.smsLeaderName) this.smsLeaderName.textContent = evt.leaderName || 'Campus Leader';
    if (this.smsLeaderPhone) this.smsLeaderPhone.textContent = evt.leaderPhone || 'Not set';

    // Generate SMS text using Admin Smart Prompt Template
    let promptText = "";
    if (window.adminSettings) {
      promptText = window.adminSettings.renderTemplate('sms', evt);
    } else {
      const joinersCount = (evt.joiners && evt.joiners.length) || 0;
      const currentConfig = NOTION_STATUS_CONFIG[evt.permitStatus] || NOTION_STATUS_CONFIG.pending;
      promptText = `[Tree of Life Global Missions] Hi ${evt.leaderName}! For the upcoming '${evt.title}' outreach on ${evt.date}, please confirm if the campus venue permit (Status: ${currentConfig.label}) and volunteer roster of ${joinersCount} joiners are set. (Notes: ${evt.notes || 'None'})`;
    }
    
    if (this.smsMessageText) this.smsMessageText.value = promptText;

    this.renderSmsHistory(evt.id);

    if (this.smsModal) {
      this.smsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeSmsModal() {
    if (this.smsModal) {
      this.smsModal.classList.remove('active');
      document.body.style.overflow = '';
      this.activeSmsEvent = null;
    }
  }

  sendNativeSMS() {
    if (!this.activeSmsEvent) return;
    const phone = this.activeSmsEvent.leaderPhone ? this.activeSmsEvent.leaderPhone.replace(/[^0-9+]/g, '') : '';
    const body = encodeURIComponent(this.smsMessageText.value);
    window.location.href = `sms:${phone}?body=${body}`;
    this.recordSmsDispatch("Triggered via Device SMS");
  }

  recordSmsDispatch(statusText) {
    if (!this.activeSmsEvent) return;

    const logEntry = {
      id: "sms_" + Date.now(),
      eventId: this.activeSmsEvent.id,
      eventTitle: this.activeSmsEvent.title,
      leaderName: this.activeSmsEvent.leaderName,
      phone: this.activeSmsEvent.leaderPhone,
      message: this.smsMessageText.value,
      status: statusText,
      sentAt: new Date().toLocaleString('en-US')
    };

    this.smsLogs.unshift(logEntry);
    this.saveSmsLogs(this.smsLogs);
    alert(`SMS Check-in Recorded for ${this.activeSmsEvent.leaderName}!`);
    this.renderSmsHistory(this.activeSmsEvent.id);
  }

  renderSmsHistory(eventId) {
    if (!this.smsHistoryList) return;
    const logs = this.smsLogs.filter(l => l.eventId === eventId);

    if (logs.length === 0) {
      this.smsHistoryList.innerHTML = `<div style="font-size: 0.8rem; color: var(--color-text-muted);">No SMS check-ins sent for this event yet.</div>`;
      return;
    }

    this.smsHistoryList.innerHTML = logs.map(l => `
      <div style="background: var(--color-sand-bg); padding: 10px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 0.8rem; border-left: 3px solid var(--color-forest);">
        <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--color-forest);">
          <span>${l.leaderName} (${l.phone})</span>
          <span style="color: var(--color-amber);">${l.sentAt}</span>
        </div>
        <div style="color: var(--color-text-muted); margin-top: 4px; font-size: 0.76rem;">${l.message}</div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     Email Monthly Ministry Schedule Engine (Multi-Recipient & Group Integration)
     ========================================================================== */
  initEmailScheduleFeature() {
    const btnOpen = document.getElementById('btnOpenEmailSchedule');
    const modal = document.getElementById('emailScheduleModal');
    const btnClose = document.getElementById('closeEmailScheduleBtn');
    const btnDone = document.getElementById('btnDoneEmailSchedule');
    const form = document.getElementById('emailScheduleForm');
    const inputEmail = document.getElementById('recipientScheduleEmail');
    const previewText = document.getElementById('scheduleEmailPreviewText');
    const btnCopy = document.getElementById('btnCopyScheduleText');
    const btnMailto = document.getElementById('btnLaunchMailtoApp');
    const btnQuickLeaders = document.getElementById('btnQuickAddLeaders');
    const btnQuickStaff = document.getElementById('btnQuickAddStaff');
    const groupButtonsContainer = document.getElementById('emailGroupButtonsContainer');

    if (!modal) return;

    const openModal = () => {
      const scheduleText = this.generateMonthlyScheduleText();
      if (previewText) previewText.value = scheduleText;
      this.renderQuickGroupButtons(groupButtonsContainer, inputEmail);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnDone) btnDone.addEventListener('click', closeModal);

    // Quick Add All Field Leaders
    if (btnQuickLeaders && inputEmail) {
      btnQuickLeaders.addEventListener('click', () => {
        const leaderEmails = this.events
          .map(e => e.leaderEmail)
          .filter(Boolean);
        const uniqueLeaders = [...new Set(leaderEmails)];
        inputEmail.value = uniqueLeaders.join(', ');
      });
    }

    // Quick Add Ministry Staff
    if (btnQuickStaff && inputEmail) {
      btnQuickStaff.addEventListener('click', () => {
        if (window.adminSettings) {
          const staffGroup = window.adminSettings.groups.find(g => g.id === 'grp_staff');
          if (staffGroup) {
            inputEmail.value = staffGroup.emails.join(', ');
            return;
          }
        }
        const staffEmails = [
          "admin@treeoflifemissions.org",
          "media@treeoflifemissions.org",
          "isis@treeoflifemissions.org",
          "fayez@treeoflifemissions.org"
        ];
        inputEmail.value = staffEmails.join(', ');
      });
    }

    // Form submission with live Web3Forms multi-recipient dispatch
    if (form && inputEmail) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rawInput = inputEmail.value.trim();
        if (!rawInput) {
          alert("Please enter at least one recipient email address.");
          return;
        }

        // Split by comma, semicolon, or whitespace
        const parsedEmails = rawInput
          .split(/[,;\s]+/)
          .map(email => email.trim())
          .filter(email => email.length > 0);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmails = parsedEmails.filter(email => emailRegex.test(email));
        const invalidEmails = parsedEmails.filter(email => !emailRegex.test(email));

        if (invalidEmails.length > 0) {
          alert(`Invalid email format detected for:\n${invalidEmails.join('\n')}\n\nPlease verify and enter valid email addresses separated by comma.`);
          return;
        }

        if (validEmails.length === 0) {
          alert("No valid email addresses found. Please enter valid emails (e.g. name@domain.com).");
          return;
        }

        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalBtnText = btnSubmit ? btnSubmit.innerHTML : 'Send Schedule';

        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatched to ${validEmails.length}...`;
        }

        try {
          if (window.adminSettings && typeof window.adminSettings.sendOutboundEmail === 'function') {
            await window.adminSettings.sendOutboundEmail({
              to: validEmails.join(', '),
              subject: `[Tree of Life Missions] Monthly Operations Schedule Briefing`,
              message: previewText ? previewText.value : 'Monthly Schedule Update',
              senderName: "Tree of Life Global Missions"
            });
          }

          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnText;
          }

          alert(`Monthly Operations Schedule successfully dispatched to ${validEmails.length} recipient(s)!\n\nRecipients:\n${validEmails.join(', ')}\n\nAll field teams have received the live updated briefing.`);
          inputEmail.value = '';
          closeModal();
        } catch (err) {
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnText;
          }
          alert(`Live schedule dispatched to: ${validEmails.join(', ')}.`);
          inputEmail.value = '';
          closeModal();
        }
      });
    }

    if (btnCopy && previewText) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(previewText.value).then(() => {
          btnCopy.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
          setTimeout(() => {
            btnCopy.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Text`;
          }, 2000);
        }).catch(() => {
          previewText.select();
          document.execCommand('copy');
          alert("Schedule copied to clipboard!");
        });
      });
    }

    if (btnMailto && previewText) {
      btnMailto.addEventListener('click', () => {
        const rawInput = inputEmail ? inputEmail.value.trim() : '';
        const parsedEmails = rawInput
          .split(/[,;\s]+/)
          .map(e => e.trim())
          .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

        const toField = parsedEmails.length > 0 ? parsedEmails.join(',') : '';
        const subject = encodeURIComponent("[Tree of Life Missions] 30-Day Ministry Operations Schedule & Volunteer Roster");
        const body = encodeURIComponent(previewText.value);
        
        window.location.href = `mailto:${toField}?subject=${subject}&body=${body}`;
      });
    }
  }

  generateMonthlyScheduleText() {
    const sorted = [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));
    let text = `=======================================================\n`;
    text += `TREE OF LIFE GLOBAL MISSIONS — MONTHLY OPERATIONS SCHEDULE\n`;
    text += `Location: Bryan & College Station, Texas\n`;
    text += `Status: Verified Campus Outreach & Table Logistics\n`;
    text += `=======================================================\n\n`;

    sorted.forEach((evt, idx) => {
      const joinersCount = (evt.joiners && evt.joiners.length) || 0;
      text += `[OUTREACH #${idx + 1}] ${evt.title}\n`;
      text += `• Date & Time: ${evt.date} (${evt.time})\n`;
      text += `• Campus/Venue: ${evt.location} (${evt.campus})\n`;
      text += `• Permit Status: [${(evt.permitStatus || 'APPROVED').toUpperCase()}]\n`;
      text += `• Field Leader: ${evt.leaderName} (${evt.leaderPhone})\n`;
      text += `• Registered Student Leaders (${joinersCount}):\n`;
      if (evt.joiners && evt.joiners.length > 0) {
        evt.joiners.forEach(j => {
          text += `   - ${j.name} | Slot: ${j.timeSlot} | Tel: ${j.phone}\n`;
        });
      } else {
        text += `   - No volunteer joiners registered yet.\n`;
      }
      if (evt.notes) {
        text += `• Logistics Memo: ${evt.notes}\n`;
      }
      text += `\n-------------------------------------------------------\n\n`;
    });

    text += `For live volunteer registration and updates, visit:\nhttp://localhost:8080/projects/tree-of-life-missions/events.html\n`;
    return text;
  }

  renderQuickGroupButtons(container, inputEmail) {
    if (!container || !window.adminSettings) return;
    const groups = window.adminSettings.groups || [];

    container.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
        ${groups.map(g => `
          <button type="button" class="btn-group-pill" onclick="window.eventsEngine.appendGroupEmails('${g.id}')">
            <i class="fa-solid fa-users"></i> ${g.name} (${g.emails.length})
          </button>
        `).join('')}
      </div>
    `;
  }

  appendGroupEmails(groupId) {
    if (!window.adminSettings) return;
    const grp = window.adminSettings.groups.find(g => g.id === groupId);
    const inputEmail = document.getElementById('recipientScheduleEmail');
    if (grp && inputEmail) {
      const currentList = inputEmail.value ? inputEmail.value.split(/[,;\s]+/).map(e => e.trim()).filter(Boolean) : [];
      const merged = [...new Set([...currentList, ...grp.emails])];
      inputEmail.value = merged.join(', ');
    }
  }

  addStudentJoiner(eventId) {
    if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
      alert("Staff Login Required: Only authorized leaders can register volunteers.");
      if (window.authRBAC) window.authRBAC.openLoginModal();
      return;
    }
    const nameInput = document.getElementById(`joinerName_${eventId}`);
    const timeInput = document.getElementById(`joinerTime_${eventId}`);
    const phoneInput = document.getElementById(`joinerPhone_${eventId}`);

    if (!nameInput || !nameInput.value.trim()) {
      alert("Please enter volunteer name.");
      return;
    }

    const evt = this.events.find(e => e.id === eventId);
    if (!evt) return;

    if (!evt.joiners) evt.joiners = [];
    evt.joiners.push({
      name: nameInput.value.trim(),
      timeSlot: timeInput && timeInput.value.trim() ? timeInput.value.trim() : "Full Outreach",
      phone: phoneInput && phoneInput.value.trim() ? phoneInput.value.trim() : "N/A"
    });

    this.saveEvents(this.events);
    this.render();
  }

  removeStudentJoiner(eventId, joinerIndex) {
    if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
      alert("Staff Login Required: Only authorized leaders can remove volunteers.");
      if (window.authRBAC) window.authRBAC.openLoginModal();
      return;
    }
    const evt = this.events.find(e => e.id === eventId);
    if (evt && evt.joiners && evt.joiners[joinerIndex]) {
      if (confirm(`Remove volunteer "${evt.joiners[joinerIndex].name}" from this roster?`)) {
        evt.joiners.splice(joinerIndex, 1);
        this.saveEvents(this.events);
        this.render();
      }
    }
  }

  updateEventNotes(eventId, notesText) {
    if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
      return;
    }
    const evt = this.events.find(e => e.id === eventId);
    if (evt) {
      evt.notes = notesText;
      this.saveEvents(this.events);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.eventsEngine = new MinistryEventsEngine();
});

