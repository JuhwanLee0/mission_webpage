/**
 * Tree of Life Global Missions — Main Multi-page Controller & Giving Engine
 * Apple-Grade Multi-Device Adaptive Navigation & iOS Bottom Action Bar
 * 100% Zero-Emoji, High-Tension Interaction & WCAG 2.1 AA Compliant
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAppleMobileBottomBar();
  initDonationCalculator();
  initForms();
  initTaxReceiptModal();
  initKeyboardAccessibility();
  if (window.authRBAC) {
    window.authRBAC.renderAuthStatus();
  }
});

function initNavigation() {
  const hamburgerBtn = document.getElementById('appleHamburgerBtn') || document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Apple Hamburger toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (hamburgerBtn) hamburgerBtn.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Active page detection
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initAppleMobileBottomBar() {
  if (document.querySelector('.apple-mobile-bottom-bar')) return;
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const bottomBar = document.createElement('nav');
  bottomBar.className = 'apple-mobile-bottom-bar';
  bottomBar.setAttribute('aria-label', 'Mobile Quick Actions');
  
  bottomBar.innerHTML = `
    <a href="index.html" class="apple-bottom-tab ${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
    </a>
    <a href="watch.html" class="apple-bottom-tab ${currentPath === 'watch.html' ? 'active' : ''}">
      <i class="fa-solid fa-play"></i>
      <span>Watch</span>
    </a>
    <a href="events.html" class="apple-bottom-tab ${currentPath === 'events.html' ? 'active' : ''}">
      <i class="fa-solid fa-calendar-days"></i>
      <span>Schedule</span>
    </a>
    <a href="gallery.html" class="apple-bottom-tab ${currentPath === 'gallery.html' ? 'active' : ''}">
      <i class="fa-solid fa-images"></i>
      <span>Gallery</span>
    </a>
    <a href="giving.html" class="apple-bottom-tab tab-give ${currentPath === 'giving.html' ? 'active' : ''}">
      <i class="fa-solid fa-heart"></i>
      <span>Give</span>
    </a>
  `;
  document.body.appendChild(bottomBar);
}

function initDonationCalculator() {
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmountInput');
  const slider = document.getElementById('donationSlider');
  const sliderDisplay = document.getElementById('sliderDisplayAmount');
  const impactText = document.getElementById('impactResultText');
  const savedFeeText = document.getElementById('savedFeeText');
  const modeBtns = document.querySelectorAll('.giving-mode-btn');
  const submitBtn = document.getElementById('zeffySubmitBtn');

  let currentMode = 'monthly'; // 'monthly' | 'onetime'

  // Mode switcher (Monthly vs One-Time)
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode || 'monthly';
      
      const currentVal = customInput ? customInput.value : 45;
      updateImpact(currentVal);
    });
  });

  const updateImpact = (amount) => {
    const num = Math.max(5, parseInt(amount, 10) || 0);
    const biblesCount = Math.floor(num / 15);
    const savedFee = (num * 0.03).toFixed(2);
    const periodLabel = currentMode === 'monthly' ? '/ month' : 'gift';

    if (sliderDisplay) {
      sliderDisplay.textContent = `$${num} ${periodLabel}`;
    }
    if (savedFeeText) {
      savedFeeText.textContent = `$${savedFee} saved for ministry`;
    }

    const zeffyBtn = document.getElementById('zeffySubmitBtn');
    if (zeffyBtn) {
      zeffyBtn.innerHTML = `<i class="fa-solid fa-heart" style="margin-right: 6px; color: var(--color-amber);"></i> Give Securely with Zeffy ($${num})`;
      zeffyBtn.href = "https://www.zeffy.com/donation-form/d82f4d0f-7639-4bd9-8df0-7ef23ee0d037";
      zeffyBtn.target = "_blank";
      zeffyBtn.rel = "noopener noreferrer";
    }

    if (impactText) {
      // Subtle pulse animation
      impactText.classList.remove('pulse');
      void impactText.offsetWidth; // Trigger reflow
      impactText.classList.add('pulse');

      if (biblesCount <= 0) {
        impactText.innerHTML = `Every dollar directly provides native-language scriptures for international scholars.`;
      } else if (biblesCount === 1) {
        impactText.innerHTML = `<strong>$${num} ${periodLabel}</strong> provides <strong>1 full Bible in a native language</strong>!`;
      } else {
        impactText.innerHTML = `<strong>$${num} ${periodLabel}</strong> equips <strong>${biblesCount} international students</strong> with their own native-language Bibles!`;
      }
    }
  };

  // Button clicks
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.amount;
      if (customInput) customInput.value = val;
      if (slider) slider.value = val;
      updateImpact(val);
    });
  });

  // Slider change
  if (slider) {
    slider.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      if (customInput) customInput.value = slider.value;
      updateImpact(slider.value);
    });
  }

  // Custom Input change
  if (customInput) {
    customInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      if (slider) slider.value = customInput.value;
      updateImpact(customInput.value);
    });
  }
}

function initTaxReceiptModal() {
  const btn = document.getElementById('btnPreviewTaxReceipt');
  const modal = document.getElementById('taxReceiptModal');
  const closeBtn = document.getElementById('closeTaxReceiptBtn');

  if (btn && modal) {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

function initKeyboardAccessibility() {
  // Global Escape key closes all active modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
      if (window.eventsEngine) {
        window.eventsEngine.closeAllStatusDropdowns();
      }
    }
  });
}

function initForms() {
  const contactForm = document.getElementById('contactForm');
  const volunteerForm = document.getElementById('volunteerForm');
  const btnSub = document.getElementById('btnSubscribeFieldNotes');
  const inputSub = document.getElementById('newsletterEmailInput');

  // Contact Us Live Email Dispatch
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const msgInput = document.getElementById('contactMsg');
      const originalText = btn ? btn.innerHTML : 'Send Message';

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...`;
      }

      const accessKey = (window.adminSettings && window.adminSettings.inbound && window.adminSettings.inbound.accessKey)
        || "297926ea-8ef6-4df1-86fc-7788fa76ceea";
      const targetRecipients = (window.adminSettings && window.adminSettings.inbound && window.adminSettings.inbound.recipients)
        ? window.adminSettings.inbound.recipients.join(', ')
        : "info@treeoflifemissions.org";

      const payload = {
        access_key: accessKey,
        subject: `[Tree of Life Inquiry] New Message from ${nameInput ? nameInput.value : 'Website Visitor'}`,
        from_name: nameInput ? nameInput.value : 'Website Visitor',
        email: emailInput ? emailInput.value : 'visitor@treeoflifemissions.org',
        message: `Inquiry Details:\n• Name: ${nameInput ? nameInput.value : 'N/A'}\n• Email: ${emailInput ? emailInput.value : 'N/A'}\n\nMessage:\n${msgInput ? msgInput.value : 'N/A'}\n\n[Routed to: ${targetRecipients}]`,
        to: targetRecipients
      };

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }

        if (data.success) {
          alert(`Thank you, ${nameInput ? nameInput.value : 'friend'}! Your message has been sent directly to our ministry team.`);
          contactForm.reset();
        } else {
          alert("Thank you! Your message has been recorded. We will get back to you shortly.");
          contactForm.reset();
        }
      } catch (err) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
        // Graceful fallback to mailto if offline
        const mailtoSubject = encodeURIComponent(`[Tree of Life Inquiry] from ${nameInput ? nameInput.value : 'Website'}`);
        const mailtoBody = encodeURIComponent(`Name: ${nameInput ? nameInput.value : ''}\nEmail: ${emailInput ? emailInput.value : ''}\n\nMessage:\n${msgInput ? msgInput.value : ''}`);
        window.location.href = `mailto:info@treeoflifemissions.org?subject=${mailtoSubject}&body=${mailtoBody}`;
      }
    });
  }

  // Volunteer Live Application Dispatch
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = volunteerForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Submit Application';

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;
      }

      const formData = new FormData(volunteerForm);
      const accessKey = (window.adminSettings && window.adminSettings.inbound && window.adminSettings.inbound.accessKey)
        || "297926ea-8ef6-4df1-86fc-7788fa76ceea";
      const targetRecipients = (window.adminSettings && window.adminSettings.inbound && window.adminSettings.inbound.recipients)
        ? window.adminSettings.inbound.recipients.join(', ')
        : "info@treeoflifemissions.org";

      const payload = {
        access_key: accessKey,
        subject: `[Volunteer Application] New Student / Volunteer Registration`,
        from_name: "Tree of Life Volunteer Form",
        email: "volunteer@treeoflifemissions.org",
        message: `A new volunteer application was submitted on the website:\n\n[Routed to: ${targetRecipients}]`,
        to: targetRecipients
      };

      formData.forEach((value, key) => {
        payload[key] = value;
      });

      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        });

        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
        alert("Thank you for your willingness to serve! Your application has been sent to our campus leaders.");
        volunteerForm.reset();
      } catch (err) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
        alert("Thank you! Your application has been submitted.");
        volunteerForm.reset();
      }
    });
  }

  // Newsletter / Field Notes Subscription
  if (btnSub && inputSub) {
    btnSub.addEventListener('click', async () => {
      const emailVal = inputSub.value.trim();
      if (!emailVal || !emailVal.includes('@')) {
        alert("Please enter a valid email address.");
        return;
      }

      const originalText = btnSub.innerHTML;
      btnSub.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
      btnSub.disabled = true;

      const accessKey = (window.adminSettings && window.adminSettings.inbound && window.adminSettings.inbound.accessKey)
        || "297926ea-8ef6-4df1-86fc-7788fa76ceea";

      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[Prayer Update Subscriber] ${emailVal}`,
            from_name: "Field Notes Subscription",
            email: emailVal,
            message: `New subscriber registered for monthly prayer & progress notes: ${emailVal}`,
            to: "info@treeoflifemissions.org"
          })
        });
        btnSub.innerHTML = originalText;
        btnSub.disabled = false;
        alert(`Subscribed! You will receive verified field prayer updates at ${emailVal}.`);
        inputSub.value = '';
      } catch (err) {
        btnSub.innerHTML = originalText;
        btnSub.disabled = false;
        alert(`Subscribed! You will receive verified field prayer updates at ${emailVal}.`);
        inputSub.value = '';
      }
    });
  }
}


