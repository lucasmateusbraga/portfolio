// =========================================================
// lucasbraga - shared site interactions
// Loaded on index.html and on every page under /projetos/ so
// navigation, language toggle and motion behave the same way
// everywhere (same design system, same interactions).
// =========================================================

let currentLang = localStorage.getItem('lb_lang') || 'en';
let currentSectionId = null;

const STRINGS = {
  openMenu: { en: 'Open menu', pt: 'Abrir menu' },
  closeMenu: { en: 'Close menu', pt: 'Fechar menu' }
};
function t(key){
  return (STRINGS[key] && STRINGS[key][currentLang]) || (STRINGS[key] && STRINGS[key].en) || '';
}

document.addEventListener('DOMContentLoaded', () => {
  const boot = (name, fn) => {
    try { fn(); } catch (err) { console.error(`[lucasbraga] ${name} failed:`, err); }
  };
  boot('lang toggle', initLangToggle);
  boot('nav toggle', initNavToggle);
  boot('scroll spy', initScrollSpy);
  boot('reveal', initReveal);
  boot('year', setYear);
});

/* ---------- language toggle (shared across all pages) ---------- */
function applyLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  document.querySelectorAll('[data-en]').forEach(el => {
    const value = lang === 'pt' ? (el.getAttribute('data-pt') ?? el.getAttribute('data-en')) : el.getAttribute('data-en');
    if(value != null) el.innerHTML = value;
  });

  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    const value = lang === 'pt' ? (el.getAttribute('data-pt-placeholder') ?? '') : el.getAttribute('data-en-placeholder');
    el.setAttribute('placeholder', value || '');
  });

  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.langSwitch === lang);
  });

  // refresh the ruler label for whichever section is currently active
  const rulerLabel = document.querySelector('.ruler-label');
  if(rulerLabel){
    const target = currentSectionId ? document.getElementById(currentSectionId) : document.querySelector('main section[id]');
    if(target) rulerLabel.textContent = (lang === 'pt' ? target.dataset.rulerPt : target.dataset.rulerEn) || target.id;
  }

  const toggle = document.querySelector('.nav-toggle');
  if(toggle) toggle.setAttribute('aria-label', t(toggle.classList.contains('open') ? 'closeMenu' : 'openMenu'));
}

function initLangToggle(){
  applyLang(currentLang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('lb_lang', btn.dataset.langSwitch);
      applyLang(btn.dataset.langSwitch);
    });
  });
}

/* ---------- mobile nav ---------- */
function initNavToggle(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', t(isOpen ? 'closeMenu' : 'openMenu'));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

/* ---------- scrollspy: nav links + ruler label ---------- */
function initScrollSpy(){
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const rulerLabel = document.querySelector('.ruler-label');
  const rulerProgress = document.querySelector('.ruler-progress');

  if(sections.length === 0) return;

  const setActive = (id) => {
    currentSectionId = id;
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
    });
    if(rulerLabel){
      const target = document.getElementById(id);
      const label = (currentLang === 'pt' ? target?.dataset.rulerPt : target?.dataset.rulerEn) || id;
      rulerLabel.textContent = label;
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        setActive(entry.target.id);
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));

  if(rulerProgress){
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
      rulerProgress.style.height = pct + '%';
    }, { passive: true });
  }
}

/* ---------- reveal-on-scroll ---------- */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(items.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    items.forEach(i => i.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(i => observer.observe(i));
}

/* ---------- contact form (Formspree), index.html only ---------- */
/* ---------- contact form removed: email + WhatsApp cards used instead ---------- */

function setYear(){
  const el = document.querySelector('[data-year]');
  if(el) el.textContent = new Date().getFullYear();
}
