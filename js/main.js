/**
 * ALOK AS - Main JavaScript
 * Elektriker Flekkefjord
 */

document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initContactForm();
  initSmoothScroll();
});

/**
 * Header scroll behavior
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 20;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (!animatedElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Contact form handling
 */
function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
      </svg>
      Sender...
    `;

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await sendContactEmail(data);

      if (response.success) {
        showNotification('Takk for din henvendelse! Vi kontakter deg snart.', 'success');
        form.reset();
      } else {
        throw new Error(response.message || 'Noe gikk galt');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('Beklager, noe gikk galt. Prøv igjen eller ring oss direkte.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * Send contact email (demo - would use Resend API in production)
 */
async function sendContactEmail(data) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Form data:', data);
      resolve({ success: true });
    }, 1500);
  });
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <svg class="notification__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success'
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
        }
      </svg>
      <span>${message}</span>
    </div>
    <button class="notification__close" aria-label="Lukk">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  // Add styles if not present
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        background: #fff;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 12px 32px rgba(27, 54, 93, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
      }
      .notification--success { border-left: 4px solid #10B981; }
      .notification--error { border-left: 4px solid #EF4444; }
      .notification__content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }
      .notification--success .notification__icon { color: #10B981; }
      .notification--error .notification__icon { color: #EF4444; }
      .notification__close {
        background: none;
        border: none;
        cursor: pointer;
        color: #9BA3B0;
        padding: 4px;
        display: flex;
        transition: color 0.15s;
      }
      .notification__close:hover { color: #2D3436; }
      @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
      }
      .notification.hiding { animation: slideOut 0.3s ease-in forwards; }
      .animate-spin { animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(styles);
  }

  document.body.appendChild(notification);

  notification.querySelector('.notification__close').addEventListener('click', () => {
    notification.classList.add('hiding');
    setTimeout(() => notification.remove(), 300);
  });

  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add('hiding');
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Form validation helpers
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\d\s+()-]{8,}$/.test(phone);
}

/**
 * Real-time form validation
 */
document.addEventListener('blur', function(e) {
  if (e.target.matches('.contact-form input, .contact-form select, .contact-form textarea')) {
    validateField(e.target);
  }
}, true);

function validateField(field) {
  const value = field.value.trim();
  const name = field.name;
  let isValid = true;
  let message = '';

  // Remove existing error
  const existingError = field.parentElement.querySelector('.form-error');
  if (existingError) existingError.remove();
  field.style.borderColor = '';

  // Required check
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    message = 'Dette feltet er påkrevd';
  }
  // Email validation
  else if (name === 'epost' && value && !validateEmail(value)) {
    isValid = false;
    message = 'Ugyldig e-postadresse';
  }
  // Phone validation
  else if (name === 'telefon' && value && !validatePhone(value)) {
    isValid = false;
    message = 'Ugyldig telefonnummer';
  }

  if (!isValid) {
    field.style.borderColor = '#EF4444';
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    error.style.cssText = 'color: #EF4444; font-size: 0.8125rem; margin-top: 4px; display: block;';
    field.parentElement.appendChild(error);
  }

  return isValid;
}

/**
 * Map dot interactions
 */
document.querySelectorAll('.area__map-dot').forEach(dot => {
  dot.addEventListener('click', function() {
    const name = this.getAttribute('data-name');
    console.log('Selected area:', name);
  });
});
