const SLIDES = [
  "slides/slide0.html","slides/slide1.html","slides/slide1.1.html","slides/slide2.html",
  "slides/slide2.2.html","slides/slide2.3.html","slides/slide2.4.html","slides/slide2.5.html",
  "slides/slide2.6.html","slides/slide3.html","slides/slide3.1.html","slides/slide4.html",
  "slides/slide5.html","slides/slide5.1.html","slides/slide6.html","slides/slide7.html",
  "slides/slide8.html","slides/slide9.html","slides/slide10.html","slides/slide11.html",
  "slides/slide12.html","slides/slide13.html","slides/slide14.html","slides/slide15.html",
  "slides/slide16.html","slides/slide17.html","slides/slide18.html","slides/slide19.html",
  "slides/slide20.html","slides/slide21.html","slides/slide22.html","slides/slide23.html",
  "slides/slide24.html","slides/slide25.html","slides/slide26.html","slides/slide27.html",
  "slides/slide28.html","slides/slide29.html","slides/slide30.html","slides/slide31.html",
  "slides/slide32.html"
];

let currentIndex = 0;

// DOM refs
const slideFrame    = document.getElementById('slideFrame');
const frameWrapper  = document.getElementById('frameWrapper');
const stage         = document.getElementById('stage');
const slideNum      = document.getElementById('slideNum');
const slideTotal    = document.getElementById('slideTotal');
const progressFill  = document.getElementById('progressFill');
const btnFullscreen = document.getElementById('btnFullscreen');
const btnGrid       = document.getElementById('btnGrid');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const drawer        = document.getElementById('drawer');
const drawerGrid    = document.getElementById('drawerGrid');
const navPrev       = document.getElementById('navPrev');
const navNext       = document.getElementById('navNext');

slideTotal.textContent = SLIDES.length;

// ── Navigate ──────────────────────────
function goTo(index) {
  if (index < 0 || index >= SLIDES.length) return;
  currentIndex = index;
  slideFrame.classList.remove('slide-enter');
  void slideFrame.offsetWidth; // reflow
  slideFrame.classList.add('slide-enter');
  slideFrame.src = SLIDES[currentIndex];
  updateUI();
  closeDrawer();
  updateHash();
}

function updateUI() {
  slideNum.textContent = currentIndex + 1;
  const pct = ((currentIndex + 1) / SLIDES.length) * 100;
  progressFill.style.width = pct + '%';
  // Update nav zone visibility
  navPrev.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
  navNext.style.visibility = currentIndex === SLIDES.length - 1 ? 'hidden' : 'visible';
}

function updateHash() {
  history.replaceState(null, '', '#' + currentIndex);
}

// ── Scaling ───────────────────────────
const SLIDE_W = 1280;
const SLIDE_H = 720;

function rescale() {
  const isFS = document.fullscreenElement != null;
  const stageRect = stage.getBoundingClientRect();
  const padX = isFS ? 0 : 48;
  const padY = isFS ? 0 : 48;
  const availW = stageRect.width - padX;
  const availH = stageRect.height - padY;
  const scale = Math.min(availW / SLIDE_W, availH / SLIDE_H, 1.0);

  slideFrame.style.transform = `scale(${scale})`;
  frameWrapper.style.width  = (SLIDE_W * scale) + 'px';
  frameWrapper.style.height = (SLIDE_H * scale) + 'px';
}

window.addEventListener('resize', rescale);
new ResizeObserver(rescale).observe(stage);

// ── Fullscreen ────────────────────────
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener('fullscreenchange', () => {
  const isFS = !!document.fullscreenElement;
  document.body.classList.toggle('is-fullscreen', isFS);
  stage.classList.toggle('fullscreen-stage', isFS);
  btnFullscreen.classList.toggle('active', isFS);
  rescale();
});

btnFullscreen.addEventListener('click', toggleFullscreen);

// ── Drawer ────────────────────────────
let drawerOpen = false;
let drawerBuilt = false;

function buildDrawer() {
  if (drawerBuilt) return;
  drawerBuilt = true;
  SLIDES.forEach((slide, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'drawer-thumb' + (i === currentIndex ? ' active' : '');
    thumb.dataset.index = i;

    const iframe = document.createElement('iframe');
    iframe.src = slide;
    iframe.loading = 'lazy';
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.tabIndex = -1;

    const label = document.createElement('div');
    label.className = 'drawer-thumb-label';
    label.textContent = (i + 1) + ' / ' + SLIDES.length;

    thumb.appendChild(iframe);
    thumb.appendChild(label);
    thumb.addEventListener('click', () => goTo(i));
    drawerGrid.appendChild(thumb);
  });
}

function openDrawer() {
  buildDrawer();
  drawerOpen = true;
  drawerBackdrop.classList.add('open');
  drawer.classList.add('open');
  // Scroll active into view
  const active = drawerGrid.querySelector('.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function closeDrawer() {
  drawerOpen = false;
  drawerBackdrop.classList.remove('open');
  drawer.classList.remove('open');
}

function toggleDrawer() {
  drawerOpen ? closeDrawer() : openDrawer();
}

function refreshDrawerActive() {
  if (!drawerBuilt) return;
  drawerGrid.querySelectorAll('.drawer-thumb').forEach((el, i) => {
    el.classList.toggle('active', i === currentIndex);
  });
}

btnGrid.addEventListener('click', toggleDrawer);
drawerBackdrop.addEventListener('click', closeDrawer);

// ── Keyboard ──────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    goTo(currentIndex + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goTo(currentIndex - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goTo(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goTo(SLIDES.length - 1);
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  } else if (e.key === 'g' || e.key === 'G') {
    toggleDrawer();
  } else if (e.key === 'Escape') {
    if (drawerOpen) closeDrawer();
  }
});

// ── Click navigation ──────────────────
navPrev.addEventListener('click', () => goTo(currentIndex - 1));
navNext.addEventListener('click', () => goTo(currentIndex + 1));

// ── Init ──────────────────────────────
function init() {
  // Restore from hash
  const hash = location.hash.replace('#', '');
  const idx = parseInt(hash, 10);
  if (!isNaN(idx) && idx >= 0 && idx < SLIDES.length) {
    currentIndex = idx;
    slideFrame.src = SLIDES[currentIndex];
  }
  updateUI();
  rescale();
}

init();
