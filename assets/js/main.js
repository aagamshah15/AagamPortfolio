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
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
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
    if (themeLabel) themeLabel.textContent = themeState;
    if (themeIcon) themeIcon.innerHTML = themeState === 'light' ? iconSun : themeState === 'dark' ? iconMoon : iconAuto;
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      themeState = themeState === 'system' ? 'light' : themeState === 'light' ? 'dark' : 'system';
      try { localStorage.setItem('theme', themeState); } catch (e) {}
      applyTheme();
    });
  }
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

  // ---------- project carousel ----------
  // Native smooth scrollBy is canceled by scroll-snap-type: mandatory in Chrome,
  // so we drive the glide ourselves with rAF, pausing snap for the duration.
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const CARD_STEP = 318; // card width 300 + gap 18, keeps landings on snap points
    let carouselAnimating = false;
    function slideCarousel(direction) {
      const max = carousel.scrollWidth - carousel.clientWidth;
      const target = Math.max(0, Math.min(max, carousel.scrollLeft + direction * CARD_STEP));
      // rAF pauses in hidden tabs — jump instantly there and for reduced-motion users
      if (reduceMotion || document.visibilityState === 'hidden') { carousel.scrollLeft = target; return; }
      if (carouselAnimating) return;
      carouselAnimating = true;
      const start = carousel.scrollLeft;
      const t0 = performance.now();
      const duration = 380;
      carousel.style.scrollSnapType = 'none';
      function step(now) {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        carousel.scrollLeft = start + (target - start) * eased;
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          carousel.style.scrollSnapType = '';
          carouselAnimating = false;
        }
      }
      requestAnimationFrame(step);
    }
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => slideCarousel(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => slideCarousel(1));
  }
});
