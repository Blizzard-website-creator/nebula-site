/**
 * Nebula — clean JS for interactivity
 * - Mobile menu toggle
 * - Theme toggle (light/dark via data-theme)
 * - Scroll-reveal animations
 * - Current year auto-update
 * - Contact form validation + feedback
 */

(function () {
  const root = document.documentElement;
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const themeBtn = document.getElementById('themeToggle');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Footer year auto-update =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Mobile menu toggle =====
  function toggleMenu(open) {
    if (!mobileMenu || !menuBtn) return;
    const willOpen = typeof open === 'boolean' ? open : mobileMenu.hasAttribute('hidden');
    menuBtn.setAttribute('aria-expanded', String(willOpen));
    mobileMenu.toggleAttribute('hidden', !willOpen);
  }
  menuBtn?.addEventListener('click', () => toggleMenu());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
  document.addEventListener('click', (e) => {
    if (!mobileMenu || mobileMenu.hasAttribute('hidden')) return;
    if (!mobileMenu.contains(e.target) && !menuBtn?.contains(e.target)) toggleMenu(false);
  });

  // ===== Theme toggle =====
  function getStoredTheme() {
    try { return localStorage.getItem('nebula-theme'); } catch { return null; }
  }
  function storeTheme(v) {
    try { localStorage.setItem('nebula-theme', v); } catch {}
  }
  function applyTheme(mode) {
    if (!mode) {
      root.removeAttribute('data-theme');
      themeBtn?.setAttribute('aria-pressed', 'false');
      return;
    }
    root.setAttribute('data-theme', mode);
    themeBtn?.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
  }
  const storedTheme = getStoredTheme();
  if (storedTheme) applyTheme(storedTheme);
  themeBtn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  });

  // ===== Scroll reveal animations =====
  function initReveal() {
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  initReveal();

  // ===== Contact form validation =====
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('formMsg');
    if (!form || !msg) return;

    form.addEventListener('submit', (e) => {
      const email = form.email.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        e.preventDefault();
        msg.textContent = 'Please enter a valid email.';
        msg.style.color = 'var(--warning)';
        return;
      }
      msg.textContent = 'Message sent! ✅';
      msg.style.color = 'var(--success)';
    });
  }
  initContactForm();

  // ===== Hash focus for accessibility =====
  function initHashFocus() {
    function focusTargetFromHash() {
      if (location.hash) {
        const el = document.querySelector(location.hash);
        if (el) el.setAttribute('tabindex', '-1'), el.focus({ preventScroll: true });
      }
    }
    window.addEventListener('hashchange', focusTargetFromHash);
  }
  initHashFocus();

})();
