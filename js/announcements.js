/**
 * Tree of Life Global Missions — Official Bulletins & Announcements Engine
 * Dynamic Category Filtering, Pinned Bulletins, Image Attachments & Staff Management
 */

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "notice-001",
    title: "Blinn & Texas A&M Fall Welcome Outreach & Native Bible Tables",
    category: "campus",
    date: "2026-09-04",
    pinned: true,
    author: "Director Michael Baer",
    content: "We are officially launching our fall campus welcome tables at Blinn College and Texas A&M! Join us at the student crossroads as we welcome arriving international freshmen and scholars with warm greetings, campus guides, and free scriptures in their heart languages.",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/b72ba8aa-e21f-4b70-9bba-db66be2e04ac/IMG_9240.jpeg"
  },
  {
    id: "notice-002",
    title: "Urgent Prayer Request: Native Scripture Shipment Clearing Customs",
    category: "urgent",
    date: "2026-09-02",
    pinned: true,
    author: "Founder Fayez Farag",
    content: "Please join our intercessory prayer network in lifting up the upcoming shipment of 500 Arabic, Mandarin, and Spanish study Bibles. Pray that logistics and port clearance proceed smoothly without administrative delays so our student teams can distribute them next week.",
    imageUrl: ""
  },
  {
    id: "notice-003",
    title: "Weekly Thursday Home-Cooked Dinner & Table Fellowship",
    category: "fellowship",
    date: "2026-08-31",
    pinned: false,
    author: "Isis Hanna",
    content: "All university scholars, international students, and visiting families are invited to our weekly Thursday fellowship dinner at the Mission Hub (2305 Barak Ln, Bryan). Enjoy authentic home-cooked meals, genuine friendship, and uplifting conversation.",
    imageUrl: "images/im-fbc-team.jpg"
  },
  {
    id: "notice-004",
    title: "First Friday Downtown Bryan Ministry Table Briefing",
    category: "outreach",
    date: "2026-08-28",
    pinned: false,
    author: "Campus Ministry Team",
    content: "Our monthly downtown outreach table will be stationed near Main Street for First Friday. Volunteers are needed for setup at 5:00 PM and hospitality greeting through 9:00 PM. Sign up on the Schedule page or contact the team.",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/e8629fff-f094-4a24-afe8-d44e11656140/IMG_9247.jpeg"
  }
];

class AnnouncementsEngine {
  constructor() {
    this.storageKey = "tol_announcements_db";
    this.announcements = this.loadAnnouncements();
    this.currentCategory = "all";
    this.pendingImageBase64 = null;

    this.init();
  }

  loadAnnouncements() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Storage read note:", e);
    }
    return [...DEFAULT_ANNOUNCEMENTS];
  }

  saveAnnouncements() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.announcements));
    } catch (e) {
      console.warn("Storage write note:", e);
    }
  }

  init() {
    this.renderList();
    this.setupCategoryFilters();
    this.setupModalInteractions();
    this.setupDropzone();
    this.setupAuthSync();
  }

  setupCategoryFilters() {
    const filterTrack = document.getElementById("announcementFilterTrack");
    if (!filterTrack) return;

    filterTrack.addEventListener("click", (e) => {
      const btn = e.target.closest(".event-filter-btn");
      if (!btn) return;

      filterTrack.querySelectorAll(".event-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.currentCategory = btn.dataset.category || "all";
      this.renderList();
    });
  }

  setupAuthSync() {
    const postBtn = document.getElementById("btnOpenPostNotice");
    const checkAuth = () => {
      if (window.authRBAC && window.authRBAC.currentUser) {
        if (postBtn) postBtn.style.display = "inline-flex";
      } else {
        if (postBtn) postBtn.style.display = "none";
      }
      this.renderList();
    };

    checkAuth();
    window.addEventListener("auth_state_changed", checkAuth);
  }

  setupModalInteractions() {
    const modal = document.getElementById("postNoticeModal");
    const openBtn = document.getElementById("btnOpenPostNotice");
    const closeBtn = document.getElementById("closePostNoticeBtn");
    const cancelBtn = document.getElementById("btnCancelNotice");
    const form = document.getElementById("postNoticeForm");

    const openModal = () => {
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        const dateInput = document.getElementById("noticeDate");
        if (dateInput && !dateInput.value) {
          dateInput.value = new Date().toISOString().split("T")[0];
        }
      }
    };

    const closeModal = () => {
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        if (form) form.reset();
        this.clearImagePreview();
      }
    };

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Lightbox modal close
    const lightbox = document.getElementById("noticeImageLightbox");
    const closeLightboxBtn = document.getElementById("closeNoticeLightboxBtn");
    if (closeLightboxBtn && lightbox) {
      closeLightboxBtn.addEventListener("click", () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
      });
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    }

    // Form submission
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("noticeTitle").value.trim();
        const category = document.getElementById("noticeCategory").value;
        const date = document.getElementById("noticeDate").value;
        const pinned = document.getElementById("noticePinned").checked;
        const content = document.getElementById("noticeContent").value.trim();
        const author = (window.authRBAC && window.authRBAC.currentUser) 
          ? window.authRBAC.currentUser.name 
          : "Ministry Leadership";

        const newNotice = {
          id: "notice-" + Date.now(),
          title,
          category,
          date,
          pinned,
          author,
          content,
          imageUrl: this.pendingImageBase64 || ""
        };

        this.announcements.unshift(newNotice);
        this.saveAnnouncements();
        closeModal();
        this.renderList();
      });
    }
  }

  setupDropzone() {
    const dropzone = document.getElementById("noticeDropzone");
    const fileInput = document.getElementById("noticeFileInput");
    const removeBtn = document.getElementById("btnRemoveNoticeImg");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());

      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "var(--color-forest)";
        dropzone.style.background = "#EBE5DB";
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.style.borderColor = "var(--color-sand-border)";
        dropzone.style.background = "var(--color-sand-bg)";
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "var(--color-sand-border)";
        dropzone.style.background = "var(--color-sand-bg)";
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.processImageFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files[0]) {
          this.processImageFile(fileInput.files[0]);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", () => this.clearImagePreview());
    }
  }

  processImageFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.pendingImageBase64 = e.target.result;
      const previewArea = document.getElementById("noticePreviewArea");
      const previewImg = document.getElementById("noticePreviewImg");
      const dropzone = document.getElementById("noticeDropzone");
      if (previewArea && previewImg) {
        previewImg.src = this.pendingImageBase64;
        previewArea.style.display = "block";
        if (dropzone) dropzone.style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  }

  clearImagePreview() {
    this.pendingImageBase64 = null;
    const previewArea = document.getElementById("noticePreviewArea");
    const previewImg = document.getElementById("noticePreviewImg");
    const dropzone = document.getElementById("noticeDropzone");
    const fileInput = document.getElementById("noticeFileInput");
    if (previewArea) previewArea.style.display = "none";
    if (previewImg) previewImg.src = "";
    if (dropzone) dropzone.style.display = "block";
    if (fileInput) fileInput.value = "";
  }

  openLightbox(src) {
    const lightbox = document.getElementById("noticeImageLightbox");
    const lightboxImg = document.getElementById("noticeLightboxImg");
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  deleteNotice(id) {
    if (!confirm("Are you sure you want to remove this announcement bulletin?")) return;
    this.announcements = this.announcements.filter(n => n.id !== id);
    this.saveAnnouncements();
    this.renderList();
  }

  renderList() {
    const container = document.getElementById("announcementsListContainer");
    if (!container) return;

    let filtered = [...this.announcements];
    if (this.currentCategory !== "all") {
      filtered = filtered.filter(n => n.category === this.currentCategory);
    }

    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="background: #FFFFFF; border: 1px dashed var(--color-sand-border); border-radius: 12px; padding: 48px 24px; text-align: center;">
          <i class="fa-regular fa-bell-slash" style="font-size: 2rem; color: var(--color-text-muted); margin-bottom: 12px;"></i>
          <h4 style="color: var(--color-forest); font-size: 1.1rem; margin-bottom: 6px;">No Bulletins in this Category</h4>
          <p style="color: var(--color-text-muted); font-size: 0.88rem;">Select another category or view All Bulletins to see recent ministry briefings.</p>
        </div>
      `;
      return;
    }

    const isStaff = window.authRBAC && window.authRBAC.currentUser;

    const categoryNames = {
      urgent: "Urgent & Prayer",
      outreach: "Outreach Briefing",
      campus: "Campus Notice",
      fellowship: "Table Fellowship",
      general: "General Ministry"
    };

    const categoryColors = {
      urgent: "background: #FDF2E9; color: #C96623; border: 1px solid #FADBD8;",
      outreach: "background: #E8F8F5; color: #117A65; border: 1px solid #D1F2EB;",
      campus: "background: #EAF2F8; color: #2471A3; border: 1px solid #D4E6F1;",
      fellowship: "background: #FEF9E7; color: #B7950B; border: 1px solid #FCF3CF;",
      general: "background: #F4F6F6; color: #5D6D7E; border: 1px solid #EAEDED;"
    };

    container.innerHTML = filtered.map(item => {
      const catLabel = categoryNames[item.category] || "Ministry Notice";
      const catStyle = categoryColors[item.category] || categoryColors.general;
      const pinnedBadge = item.pinned
        ? `<span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(201, 102, 35, 0.12); color: var(--color-amber); padding: 3px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
             <i class="fa-solid fa-thumbtack"></i> Pinned
           </span>`
        : "";

      const deleteBtnHtml = isStaff
        ? `<button class="btn-delete-notice" data-id="${item.id}" style="background: none; border: none; color: #C0392B; font-size: 0.82rem; cursor: pointer; padding: 4px;" title="Delete Notice">
             <i class="fa-regular fa-trash-can"></i>
           </button>`
        : "";

      const imageHtml = item.imageUrl
        ? `<div style="margin-top: 14px; border-radius: 8px; overflow: hidden; max-height: 320px; cursor: pointer;" class="notice-image-trigger" data-img="${item.imageUrl}">
             <img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
           </div>`
        : "";

      return `
        <article class="notice-card ${item.pinned ? 'pinned' : ''}" style="background: #FFFFFF; border: 1px solid ${item.pinned ? 'var(--color-amber)' : 'var(--color-sand-border)'}; border-radius: 14px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 14px rgba(18, 54, 37, 0.05); position: relative;">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="${catStyle} padding: 3px 10px; border-radius: 999px; font-size: 0.74rem; font-weight: 800; text-transform: uppercase;">
                ${catLabel}
              </span>
              ${pinnedBadge}
            </div>

            <div style="display: flex; align-items: center; gap: 12px; font-size: 0.8rem; color: var(--color-text-muted);">
              <span><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i> ${item.date}</span>
              ${deleteBtnHtml}
            </div>
          </div>

          <h3 style="font-size: 1.25rem; font-weight: 850; color: var(--color-forest); margin: 0 0 8px 0; letter-spacing: -0.02em;">
            ${item.title}
          </h3>

          <div style="font-size: 0.8rem; color: var(--color-amber); font-weight: 750; margin-bottom: 12px;">
            <i class="fa-solid fa-user-shield" style="margin-right: 4px;"></i> ${item.author}
          </div>

          <p style="font-size: 0.92rem; color: var(--color-text); line-height: 1.65; margin: 0; white-space: pre-line;">
            ${item.content}
          </p>

          ${imageHtml}
        </article>
      `;
    }).join("");

    container.querySelectorAll(".btn-delete-notice").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteNotice(btn.dataset.id);
      });
    });

    container.querySelectorAll(".notice-image-trigger").forEach(wrap => {
      wrap.addEventListener("click", () => {
        this.openLightbox(wrap.dataset.img);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.announcementsEngine = new AnnouncementsEngine();
});
