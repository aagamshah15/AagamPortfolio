document.addEventListener('DOMContentLoaded', () => {
  console.log(
    '%cAagam Shah%c\nData & AI product builder — LangChain, Claude API, dbt, Tableau.\nPoking around the console? github.com/aagamshah15',
    'font-weight: 700; font-size: 14px;',
    'font-weight: 400;'
  );

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- theme cycle (system / light / dark) ----------
  const themeBtns = document.querySelectorAll('.theme-btn');
  const iconSun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  const iconMoon = '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>';
  const iconAuto = '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" stroke-dasharray="2 2"/>';

  let themeState = 'system';
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') themeState = saved;
  } catch (e) {}

  function applyTheme() {
    const root = document.documentElement;
    if (themeState === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', themeState);
    const icon = themeState === 'light' ? iconSun : themeState === 'dark' ? iconMoon : iconAuto;
    themeBtns.forEach(btn => {
      btn.querySelector('.theme-label').textContent = themeState;
      btn.querySelector('.theme-icon').innerHTML = icon;
    });
  }

  themeBtns.forEach(btn => btn.addEventListener('click', () => {
    themeState = themeState === 'system' ? 'light' : themeState === 'light' ? 'dark' : 'system';
    try { localStorage.setItem('theme', themeState); } catch (e) {}
    applyTheme();
  }));
  applyTheme();

  // ---------- hero typewriter reveal ----------
  const editorBody = document.getElementById('editorBody');
  if (editorBody) {
    const lines = editorBody.querySelectorAll('div');
    if (reduceMotion) {
      lines.forEach(l => { l.style.opacity = 1; });
    } else {
      lines.forEach(l => { l.style.opacity = 0; });
      lines.forEach((l, i) => {
        setTimeout(() => { l.style.transition = 'opacity 0.25s ease'; l.style.opacity = 1; }, i * 140 + 200);
      });
    }
  }

  // ---------- scroll-tied pull quote fill ----------
  const quote = document.getElementById('pullQuote');
  let quoteSpans = [];
  if (quote) {
    const words = quote.textContent.split(' ');
    quote.innerHTML = words.map(w => '<span>' + w + ' </span>').join('');
    quoteSpans = quote.querySelectorAll('span');
  }
  function updateQuote() {
    if (!quote) return;
    const rect = quote.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh * 0.75 - rect.top) / (rect.height + vh * 0.3)));
    const litCount = Math.floor(progress * quoteSpans.length);
    quoteSpans.forEach((s, i) => s.classList.toggle('lit', i < litCount));
  }

  // ---------- project carousel ----------
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const tabs = [...carousel.querySelectorAll('.c-tab')];
    const slides = [...carousel.querySelectorAll('.slide')];
    const track = carousel.querySelector('.c-track');
    const count = carousel.querySelector('.c-count');
    const tabStrip = carousel.querySelector('.c-tabs');
    let idx = 0;
    const go = i => {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-idx * 100}%)`;
      tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === idx); t.tabIndex = k === idx ? 0 : -1; });
      slides.forEach((s, k) => { s.inert = k !== idx; });
      tabStrip.scrollTo({ left: tabs[idx].offsetLeft - 20, behavior: reduceMotion ? 'auto' : 'smooth' });
      count.textContent = String(idx + 1).padStart(2, '0') + '/' + String(slides.length).padStart(2, '0');
    };
    tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    carousel.querySelector('.c-prev').addEventListener('click', () => go(idx - 1));
    carousel.querySelector('.c-next').addEventListener('click', () => go(idx + 1));
    tabStrip.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      go(idx + (e.key === 'ArrowRight' ? 1 : -1));
      tabs[idx].focus();
    });

    // touch swipe; mouse users have the tabs and arrows
    const viewport = carousel.querySelector('.c-viewport');
    let sx = null, sy = 0;
    viewport.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
    viewport.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
    });

    // per-slide screenshot switcher (e.g. dashboard / simulator)
    slides.forEach(slide => {
      const views = slide.querySelectorAll('.b-views button');
      views.forEach(b => b.addEventListener('click', () => {
        views.forEach(x => x.setAttribute('aria-pressed', x === b));
        slide.querySelectorAll('.b-shot img[data-view]').forEach(img => { img.hidden = img.dataset.view !== b.dataset.view; });
      }));
    });
  }

  // ---------- section reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // ---------- nav pill + active link + quote fill, one scroll handler ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navPill = document.getElementById('navPill');
  const primaryNav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - sectionHeight / 3) current = section.getAttribute('id');
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
    if (navPill && primaryNav) {
      const navBottom = primaryNav.offsetTop + primaryNav.offsetHeight;
      navPill.classList.toggle('visible', window.pageYOffset > navBottom);
    }
    updateQuote();
  });
  updateQuote();
});
