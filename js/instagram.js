/**
 * Tree of Life Global Missions — Pure Photo Gallery & Supabase RBAC Protected Uploader
 */

const DEFAULT_PHOTOS = [
  {
    id: "tol-1",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/b72ba8aa-e21f-4b70-9bba-db66be2e04ac/IMG_9240.jpeg",
    caption: "Sharing the Word of God with international students on campus! Connecting in their native heart languages.",
    tag: "campus",
    location: "Texas A&M Campus, College Station",
    author: "Director Mike",
    date: "Aug 2026"
  },
  {
    id: "tol-2",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/1fbfe444-0229-4db3-bc09-8de1b3e67f15/IMG_9241.jpeg",
    caption: "Handing out multi-language Bibles at downtown First Friday! An evening of warm conversations and prayer.",
    tag: "outreach",
    location: "Downtown Bryan, TX",
    author: "Fayez Farag",
    date: "Aug 2026"
  },
  {
    id: "tol-3",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/e8629fff-f094-4a24-afe8-d44e11656140/IMG_9247.jpeg",
    caption: "Deep conversations with international scholars exploring scripture. God's truth knows no language barrier.",
    tag: "bibles",
    location: "Bryan, Texas",
    author: "Isis Hanna",
    date: "Aug 2026"
  },
  {
    id: "tol-4",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/8ed49f91-1790-4465-9d87-284103ab818e/IMG_9268.jpeg",
    caption: "Freshly arrived Bibles in Mandarin, Spanish, Arabic, Hindi, and Portuguese ready for distribution.",
    tag: "bibles",
    location: "Tree of Life Mission Center",
    author: "Director Mike",
    date: "Jul 2026"
  },
  {
    id: "tol-5",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/42d8509c-261a-419b-be56-d416dcc4ce29/IMG_9272.jpeg",
    caption: "Warm smiles and welcome packs for arriving international freshmen.",
    tag: "community",
    location: "College Station, TX",
    author: "Staff Team",
    date: "Jul 2026"
  },
  {
    id: "tol-6",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/70e5663f-0b31-4177-b61c-b986a20057fc/IMG_9274.jpeg",
    caption: "Praising God together across nations and languages. Unity in Christ.",
    tag: "worship",
    location: "Tree of Life Gathering",
    author: "Fayez Farag",
    date: "Jul 2026"
  },
  {
    id: "tol-7",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/378f9b4c-8e8f-4df9-b690-80e0c56896c8/IMG_9279.jpeg",
    caption: "A student holding scripture in their own heart language for the very first time.",
    tag: "bibles",
    location: "Bryan, Texas",
    author: "Isis Hanna",
    date: "Jun 2026"
  },
  {
    id: "tol-8",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/9f6bcb38-e44f-4908-b3d6-82e2f79efee3/IMG_9280.jpeg",
    caption: "Community dinner and table fellowship with students from 8 different countries.",
    tag: "community",
    location: "Bryan, TX",
    author: "Staff Team",
    date: "Jun 2026"
  },
  {
    id: "tol-9",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/8e8756ed-fc4e-471f-9232-007f7b716c53/IMG_9290.jpeg",
    caption: "Campus prayer walk before the start of the semester.",
    tag: "campus",
    location: "Campus Grounds",
    author: "Director Mike",
    date: "May 2026"
  },
  {
    id: "tol-10",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/5bbbf516-9342-432e-a8bb-cb5950237740/IMG_9293.jpeg",
    caption: "Equipping volunteer leaders with cross-cultural hospitality principles.",
    tag: "community",
    location: "Mission Office, Bryan TX",
    author: "Jim (Board)",
    date: "May 2026"
  },
  {
    id: "tol-11",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/6043dfc6-ef2e-4d0e-bb61-f1ebce82848c/IMG_9297.jpeg",
    caption: "Bible welcome table at the international student festival.",
    tag: "outreach",
    location: "Memorial Student Center",
    author: "Media Staff",
    date: "Apr 2026"
  },
  {
    id: "tol-12",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6712896c9007d056a83565af/9218b893-eafe-4574-af95-97520e39a4cc/IMG_9303.jpeg",
    caption: "Spreading the powerful message of Jesus, one Bible at a time.",
    tag: "bibles",
    location: "Bryan, Texas",
    author: "Fayez Farag",
    date: "Apr 2026"
  }
];

class PhotoGalleryEngine {
  constructor() {
    this.storageKey = 'tol_pure_photos_v3';
    this.photos = this.loadPhotos();
    this.currentTag = 'all';
    this.selectedUploadImage = null;
    this.selectedUploadFile = null;
    this.selectedUploadFilter = 'filter-normal';

    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadPhotos() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error reading saved photos", e);
      }
    }
    this.savePhotos(DEFAULT_PHOTOS);
    return DEFAULT_PHOTOS;
  }

  savePhotos(photos) {
    localStorage.setItem(this.storageKey, JSON.stringify(photos));
  }

  initElements() {
    this.grid = document.getElementById('purePhotoGrid');
    this.countEl = document.getElementById('photoTotalCount');
    this.tagButtons = document.querySelectorAll('.gallery-tag-btn, .gallery-tab-btn');
    
    // Lightbox
    this.lightbox = document.getElementById('photoLightboxModal');
    this.lightboxImg = document.getElementById('lightboxImg');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.lightboxMeta = document.getElementById('lightboxMeta');
    this.closeLightboxBtn = document.getElementById('closeLightboxBtn');

    // Upload Modal
    this.uploadModal = document.getElementById('photoUploadModal');
    this.openUploadBtns = document.querySelectorAll('.btn-open-upload');
    this.closeUploadBtn = document.getElementById('closeUploadBtn');
    this.dropzone = document.getElementById('galleryDropzone');
    this.fileInput = document.getElementById('galleryFileInput');
    this.previewArea = document.getElementById('galleryPreviewArea');
    this.previewImg = document.getElementById('galleryPreviewImg');
    this.resetUploadBtn = document.getElementById('resetUploadBtn');
    this.filterButtons = document.querySelectorAll('.filter-thumb-btn');
    this.uploadCaption = document.getElementById('galleryCaption');
    this.uploadTag = document.getElementById('galleryTag');
    this.uploadDate = document.getElementById('galleryDate');
    this.uploadLocation = document.getElementById('galleryLocation');
    this.submitBtn = document.getElementById('submitGalleryBtn');
  }

  bindEvents() {
    // Tag Filters
    this.tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTag = btn.dataset.tag || 'all';
        this.render();
      });
    });

    // Lightbox Close
    if (this.closeLightboxBtn) {
      this.closeLightboxBtn.addEventListener('click', () => this.closeLightbox());
    }
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
    }

    // Upload Modal with RBAC Gate
    this.openUploadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
          alert("Staff Login Required: Only authorized media staff can upload mission photos.");
          window.authRBAC.openLoginModal();
          return;
        }
        this.openUploadModal();
      });
    });

    if (this.closeUploadBtn) {
      this.closeUploadBtn.addEventListener('click', () => this.closeUploadModal());
    }
    if (this.uploadModal) {
      this.uploadModal.addEventListener('click', (e) => {
        if (e.target === this.uploadModal) this.closeUploadModal();
      });
    }

    // File selection
    if (this.dropzone) {
    const browseBtn = document.getElementById('btnBrowseGalleryFile');
    if (browseBtn && this.fileInput) {
      browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.fileInput.click();
      });
    }

      this.dropzone.addEventListener('click', () => this.fileInput.click());
      this.dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropzone.classList.add('dragover');
      });
      this.dropzone.addEventListener('dragleave', () => this.dropzone.classList.remove('dragover'));
      this.dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleFileSelected(e.dataTransfer.files[0]);
        }
      });
    }

    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleFileSelected(e.target.files[0]);
        }
      });
    }

    if (this.resetUploadBtn) {
      this.resetUploadBtn.addEventListener('click', () => this.resetUpload());
    }

    // Filter selector
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedUploadFilter = btn.dataset.filter;
        if (this.previewImg) this.previewImg.className = this.selectedUploadFilter;
      });
    });

    // Submit
    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => this.handleSubmit());
    }
  }

  getFiltered() {
    if (this.currentTag === 'all') return this.photos;
    return this.photos.filter(p => p.tag === this.currentTag);
  }

  getThumbnailUrl(url) {
    if (!url) return '';
    // If it's Squarespace CDN, optimize thumbnail size to 500w (reduces ~500KB to ~44KB)
    if (url.includes('squarespace-cdn.com') && !url.includes('format=')) {
      return url + (url.includes('?') ? '&format=500w' : '?format=500w');
    }
    // If it's Unsplash, use w=600&q=80
    if (url.includes('unsplash.com') && !url.includes('w=')) {
      return url + (url.includes('?') ? '&w=600&q=80&auto=format' : '?w=600&q=80&auto=format');
    }
    return url;
  }

  render() {
    if (!this.grid) return;
    const filtered = this.getFiltered();
    
    if (this.countEl) {
      this.countEl.textContent = this.photos.length;
    }

    if (filtered.length === 0) {
      this.grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--color-text-muted);">
          <p>No photos found in this category.</p>
        </div>
      `;
      return;
    }

    const isStaff = window.authRBAC && window.authRBAC.hasUploadPermission();

    this.grid.innerHTML = filtered.map((item, idx) => {
      const isPriority = idx < 6;
      const thumbUrl = this.getThumbnailUrl(item.imageUrl);
      return `
        <div class="gallery-card" data-id="${item.id}">
          <div class="gallery-card-img-wrap">
            <img src="${thumbUrl}" 
                 alt="${item.caption || 'Tree of Life Mission Photo'}" 
                 class="${item.filter || 'filter-normal'}" 
                 ${isPriority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} 
                 decoding="async"
                 onload="this.classList.add('is-loaded')" />
            <span class="gallery-card-tag">#${item.tag.toUpperCase()}</span>
            ${isStaff ? `
              <button type="button" class="gallery-card-delete-btn" data-id="${item.id}" title="Delete Photo" aria-label="Delete Photo">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            ` : ''}
          </div>
          <div class="gallery-card-body">
            <p class="gallery-card-caption">${item.caption}</p>
            <div class="gallery-card-meta">
              <span class="gallery-location"><i class="fa-solid fa-location-dot"></i> ${item.location || 'Bryan, TX'}</span>
              <span class="gallery-date"><i class="fa-regular fa-calendar"></i> ${this.formatDateDisplay(item.date)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Handle any images already completed or cached
    this.grid.querySelectorAll('.gallery-card-img-wrap img').forEach(img => {
      if (img.complete) {
        img.classList.add('is-loaded');
      }
    });

    // Bind card click to lightbox
    this.grid.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking delete button, don't open lightbox
        if (e.target.closest('.gallery-card-delete-btn')) return;
        const id = card.dataset.id;
        const photo = this.photos.find(p => p.id === id);
        if (photo) this.openLightbox(photo);
      });
    });

    // Bind delete buttons on cards
    this.grid.querySelectorAll('.gallery-card-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        this.deletePhoto(id);
      });
    });

    if (window.authRBAC) {
      window.authRBAC.updateProtectedElements();
    }
  }

  openLightbox(photo) {
    if (!this.lightbox) return;
    this.currentLightboxPhoto = photo;
    this.lightboxImg.src = photo.imageUrl;
    this.lightboxImg.className = photo.filter || 'filter-normal';
    this.lightboxCaption.textContent = photo.caption;
    this.lightboxMeta.textContent = `${photo.location || 'Bryan, TX'} • Uploaded by ${photo.author || 'Staff'} • ${photo.date || 'Recent'}`;

    const isStaff = window.authRBAC && window.authRBAC.hasUploadPermission();
    const lightboxDeleteBtn = document.getElementById('lightboxDeleteBtn');
    if (lightboxDeleteBtn) {
      lightboxDeleteBtn.style.display = isStaff ? 'inline-flex' : 'none';
      lightboxDeleteBtn.onclick = () => {
        if (this.currentLightboxPhoto) {
          this.deletePhoto(this.currentLightboxPhoto.id);
        }
      };
    }

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  async deletePhoto(photoId) {
    if (!window.authRBAC || !window.authRBAC.hasUploadPermission()) {
      alert("Permission Denied: Only authorized staff and administrators can delete photos.");
      return;
    }

    const photo = this.photos.find(p => p.id === photoId);
    const captionPreview = photo && photo.caption ? `"${photo.caption.slice(0, 35)}..."` : "this photo";

    if (!confirm(`Are you sure you want to delete ${captionPreview}?\n\nThis will remove it from the photo gallery and cloud database.`)) {
      return;
    }

    try {
      if (window.supabaseClient) {
        await window.supabaseClient.deletePhoto(photoId);
      }

      this.photos = this.photos.filter(p => p.id !== photoId);
      this.savePhotos(this.photos);
      this.closeLightbox();
      this.render();
      alert("Photo successfully deleted.");
    } catch (err) {
      console.error("Delete photo error:", err);
      alert("Failed to delete photo: " + err.message);
    }
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openUploadModal() {
    if (this.uploadModal) {
      this.resetUpload();
      if (this.uploadDate && !this.uploadDate.value) {
        this.uploadDate.value = new Date().toISOString().split('T')[0];
      }
      this.uploadModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeUploadModal() {
    if (this.uploadModal) {
      this.uploadModal.classList.remove('active');
      document.body.style.overflow = '';
      this.resetUpload();
    }
  }

  handleFileSelected(file) {
    this.selectedUploadFile = file;
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedUploadImage = e.target.result;
      if (this.dropzone) this.dropzone.style.display = 'none';
      if (this.previewArea) {
        this.previewArea.classList.add('active');
        this.previewArea.style.display = 'flex';
      }
      if (this.previewImg) {
        this.previewImg.src = this.selectedUploadImage;
        this.previewImg.className = 'filter-normal';
      }
      this.selectedUploadFilter = 'filter-normal';

      this.filterButtons.forEach(btn => {
        const thumb = btn.querySelector('img');
        if (thumb) thumb.src = this.selectedUploadImage;
      });
    };
    reader.readAsDataURL(file);
  }

  resetUpload() {
    this.selectedUploadImage = null;
    this.selectedUploadFile = null;
    this.selectedUploadFilter = 'filter-normal';
    if (this.fileInput) this.fileInput.value = '';
    if (this.dropzone) this.dropzone.style.display = 'flex';
    if (this.previewArea) {
      this.previewArea.classList.remove('active');
      this.previewArea.style.display = 'none';
    }
    if (this.uploadCaption) this.uploadCaption.value = '';
    if (this.uploadDate) this.uploadDate.value = new Date().toISOString().split('T')[0];
  }

  formatDateDisplay(dateStr) {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr + "T00:00:00");
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  async handleSubmit() {
    if (!this.selectedUploadImage) {
      alert("Please choose a photo first!");
      return;
    }

    const submitBtn = document.getElementById('submitGalleryBtn');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Publish Photo';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading to Storage...';
    }

    const currentAuthor = window.authRBAC?.currentUser?.name || "Authorized Staff";
    const rawDate = this.uploadDate && this.uploadDate.value ? this.uploadDate.value : new Date().toISOString().split('T')[0];
    const formattedDate = this.formatDateDisplay(rawDate);
    const caption = this.uploadCaption && this.uploadCaption.value.trim() ? this.uploadCaption.value.trim() : "Tree of Life Global Missions moment.";
    const tag = this.uploadTag ? this.uploadTag.value : "community";
    const location = this.uploadLocation && this.uploadLocation.value.trim() ? this.uploadLocation.value.trim() : "Bryan, Texas";

    try {
      if (window.supabaseClient) {
        const uploadResult = await window.supabaseClient.uploadPhoto(
          this.selectedUploadFile || { name: 'photo.jpg', type: 'image/jpeg' },
          { caption, tag, date: rawDate, location }
        );

        const newPhoto = {
          id: uploadResult.photo.id,
          imageUrl: uploadResult.photo.imageUrl,
          caption: uploadResult.photo.caption,
          tag: uploadResult.photo.tag,
          location: uploadResult.photo.location,
          filter: this.selectedUploadFilter || 'filter-normal',
          author: currentAuthor,
          date: formattedDate
        };

        this.photos.unshift(newPhoto);
        this.savePhotos(this.photos);
      } else {
        const newPhoto = {
          id: "tol-user-" + Date.now(),
          imageUrl: this.selectedUploadImage,
          caption, tag, location,
          filter: this.selectedUploadFilter,
          author: currentAuthor,
          date: formattedDate
        };
        this.photos.unshift(newPhoto);
        this.savePhotos(this.photos);
      }

      this.closeUploadModal();
      this.render();
      const storageMode = (window.supabaseClient && window.supabaseClient.isLive()) ? 'Supabase Cloud DB & Storage' : 'Local Hybrid DB';
      alert(`Photo published successfully to ${storageMode}!`);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error: " + err.message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.galleryEngine = new PhotoGalleryEngine();
});

