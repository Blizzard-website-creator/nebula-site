/**
 * Nebula — minimal, readable JS:
 * - Mobile menu toggle
 * - Theme toggle (light/dark via data-theme)
 * - Scroll-reveal animations
 * - Current year auto-update
 * - Simple CTA form validation (if you have a small newsletter form)
 */

(function () {
  const root = document.documentElement;
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const themeBtns = [document.getElementById('themeToggle'), document.getElementById('themeToggleSm')].filter(Boolean);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Update footer year automatically
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
      themeBtns.forEach(b => b?.setAttribute('aria-pressed', 'false'));
      return;
    }
    root.setAttribute('data-theme', mode);
    themeBtns.forEach(b => b?.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false'));
  }

  const storedTheme = getStoredTheme();
  if (storedTheme) applyTheme(storedTheme);

  themeBtns.forEach(btn => btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }));

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

  // ===== Optional CTA form validation =====
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
  initCTAForm();

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
