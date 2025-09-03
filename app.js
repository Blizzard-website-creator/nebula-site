/**
 * Nebula — minimal, readable JS:
 * - Mobile menu toggle
 * - Theme toggle (light/dark via data-theme)
 * - Scroll-reveal animations
 * - Simple CTA form validation
 * - Optional hover effect for showcase images (CSS handles zoom)
 * (Contact form is handled by Formspree — no custom JS needed!)
 */

(function () {
  const root = document.documentElement;
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('menuBtn');
  const themeBtns = [document.getElementById('themeToggle'), document.getElementById('themeToggleSm')].filter(Boolean);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Set the current year in footer
  function setYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // Toggle mobile menu open/closed
  function toggleMenu(open) {
    if (!mobileMenu || !menuBtn) return;
    const willOpen = typeof open === 'boolean' ? open : mobileMenu.hasAttribute('hidden');
    menuBtn.setAttribute('aria-expanded', String(willOpen));
    mobileMenu.toggleAttribute('hidden', !willOpen);
  }

  // Theme handling
  function getStoredTheme() {
    try { return localStorage.getItem('nebula-theme'); } catch { return null; }
  }
  function storeTheme(v) {
    try { localStorage.setItem('nebula-theme', v); } catch {}
  }
  function applyTheme(mode) {
    if (!mode) {
      root.removeAttribute('data-theme');
      themeBtns.forEach(b => b?.setAttribute('aria-pressed', 'false'));
      return;
    }
    root.setAttribute('data-theme', mode);
    themeBtns.forEach(b => b?.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false'));
  }

  const stored = getStoredTheme();
  if (stored) applyTheme(stored);

  themeBtns.forEach(btn => btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }));

  // Mobile menu events
  menuBtn?.addEventListener('click', () => toggleMenu());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
  document.addEventListener('click', (e) => {
    if (!mobileMenu || mobileMenu.hasAttribute('hidden')) return;
    const clickInside = mobileMenu.contains(e.target) || menuBtn?.contains(e.target);
    if (!clickInside) toggleMenu(false);
  });

  // Scroll reveal animations
  function initReveal() {
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // CTA form validation (if using local form, Formspree handles backend)
  function initCTAForm() {
    const form = document.getElementById('ctaForm');
    const msg = document.getElementById('ctaMsg');
    if (!form || !msg) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        msg.textContent = 'Please enter a valid email.';
        msg.style.color = 'var(--warning)';
        return;
      }
      msg.textContent = 'Thanks! You’re on the list 🎉';
      msg.style.color = 'var(--success)';
      form.reset();
    });
  }

  // Focus on elements if hash is in URL
  function initHashFocus() {
    function focusTargetFromHash() {
      if (location.hash) {
        const el = document.querySelector(location.hash);
        if (el) el.setAttribute('tabindex', '-1'), el.focus({ preventScroll: true });
      }
    }
    window.addEventListener('hashchange', focusTargetFromHash);
  }

  // Initialize everything
  setYear();
  initReveal();
  initCTAForm();
  initHashFocus();
})();
