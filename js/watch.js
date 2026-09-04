/**
 * Tree of Life Global Missions — Watch Online & Worship Companion Engine
 * Handles Connection Card Modal, Action Plan Study Guide, and Interactive Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  initWatchCompanion();
});

function initWatchCompanion() {
  // 1. Connection Card Modal Triggers
  const cardConnTrigger = document.getElementById('cardConnectionTrigger');
  const btnOpenConn = document.getElementById('btnOpenConnectionCard');
  const connModal = document.getElementById('connectionCardModal');
  const closeConnBtn = document.getElementById('closeConnectionCardBtn');
  const connForm = document.getElementById('connectionCardForm');

  const openConnModal = () => {
    if (connModal) {
      connModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const nameInput = document.getElementById('connName');
      if (nameInput) setTimeout(() => nameInput.focus(), 150);
    }
  };

  const closeConnModal = () => {
    if (connModal) {
      connModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (cardConnTrigger) cardConnTrigger.addEventListener('click', openConnModal);
  if (btnOpenConn) btnOpenConn.addEventListener('click', openConnModal);
  if (closeConnBtn) closeConnBtn.addEventListener('click', closeConnModal);

  // 2. Action Plan Modal Triggers
  const cardActionTrigger = document.getElementById('cardActionPlanTrigger');
  const actionModal = document.getElementById('actionPlanModal');
  const closeActionBtn = document.getElementById('closeActionPlanBtn');

  const openActionModal = () => {
    if (actionModal) {
      actionModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeActionModal = () => {
    if (actionModal) {
      actionModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (cardActionTrigger) cardActionTrigger.addEventListener('click', openActionModal);
  if (closeActionBtn) closeActionBtn.addEventListener('click', closeActionModal);

  // Click backdrop to close
  [connModal, actionModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // 3. Handle Connection Card Submission
  if (connForm) {
    connForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = connForm.querySelector('button[type="submit"]');
      const nameInput = document.getElementById('connName');
      const emailInput = document.getElementById('connEmail');
      const phoneInput = document.getElementById('connPhone');
      const statusInput = document.getElementById('connStatus');
      const prayerInput = document.getElementById('connPrayer');

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit Connection Card';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Card...';
      }

      const name = nameInput ? nameInput.value.trim() : 'Friend';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : 'N/A';
      const statusText = statusInput && statusInput.selectedOptions.length ? statusInput.selectedOptions[0].text : 'First-time';
      const prayer = prayerInput ? prayerInput.value.trim() : 'None';

      const accessKey = (window.adminSettings && window.adminSettings.inbound && window.adminSettings.inbound.accessKey)
        || '297926ea-8ef6-4df1-86fc-7788fa76ceea';

      const payload = {
        access_key: accessKey,
        subject: '[Tree of Life Connection Card] From ' + name,
        from_name: name,
        email: email,
        message: `Connection Card Submission:\n• Name: ${name}\n• Email: ${email}\n• Phone: ${phone}\n• Next Step: ${statusText}\n• Confidential Prayer Request: ${prayer}`,
      };

      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Network dispatch note:', err);
      }

      // Store in localStorage for ministry follow-up
      try {
        const storedCards = JSON.parse(localStorage.getItem('tol_connection_cards') || '[]');
        storedCards.unshift({
          id: 'card-' + Date.now(),
          name, email, phone, status: statusText, prayer,
          date: new Date().toLocaleDateString()
        });
        localStorage.setItem('tol_connection_cards', JSON.stringify(storedCards));
      } catch (storageErr) {
        console.warn('Storage note:', storageErr);
      }

      // Success Feedback
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Received!';
      }

      setTimeout(() => {
        closeConnModal();
        connForm.reset();
        if (submitBtn) submitBtn.innerHTML = originalBtnHtml;
        alert('Thank you, ' + name + '! Your connection card has been received. Our leadership and pastoral team are praying for you and will be in touch.');
      }, 600);
    });
  }
}
