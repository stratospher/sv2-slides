const SLIDES = [
  { file: "slides/title-slide.html",              label: "Title Slide" },
  { file: "slides/contents-index.html",           label: "Index" },
  { file: "slides/1-how-pooled-mining.html",      label: "how-pooled-mining" },
  { file: "slides/pooled-mining-and-shares.html", label: "Pooled Mining & Shares" },
  { file: "slides/miner-block-assembly.html",      label: "Miner block assembly" },
  { file: "slides/what-is-a-share.html",           label: "Shares" },
  { file: "slides/2-how-stratum-v1.html",           label: "how-stratum-v1" },
  { file: "slides/sv1-architecture.html",          label: "SV1 Architecture" },
  { file: "slides/sv1-intro.html",          label: "Connection Setup" },
  { file: "slides/sv1-step1-tcp.html",          label: "tcp setup" },
  { file: "slides/mining-subscribe.html",          label: "mining.subscribe" },
  { file: "slides/mining-authorize.html",          label: "mining.authorize" },
  { file: "slides/difficulty-and-shares.html",     label: "Difficulty & Shares" },
  { file: "slides/mining-notify.html",             label: "mining.notify" },
  { file: "slides/miner-knows-from-pool.html",     label: "miner-knows-from-pool" },
  { file: "slides/mining-submit.html",             label: "mining.submit" },
  { file: "slides/3-exploits.html",           label: "exploits" },
  { file: "slides/sv1-plaintext-weakness.html",    label: "SV1 Plaintext Weakness" },
  { file: "slides/mitm-revenue-impact.html",        label: "MITM: Revenue Impact" },
  { file: "slides/blackhat-mitm-preconditions.html", label: "BlackHat MITM Preconditions" },
  { file: "slides/job-injection-diagram.html",     label: "Job Injection: Diagram" },
  { file: "slides/time-segment-timeline.html",     label: "Time-Segment Timeline" },
  { file: "slides/sv1-broader-threat.html",        label: "SV1: Broader Threat" },
  { file: "slides/4-intro-sv2.html",     label: "intro-sv2" },
  { file: "slides/sv2-security-by-design.html",    label: "SV2 Security by Design" },
  { file: "slides/5-how-sv2-prevents-exploits.html",     label: "sv2-prevents-exploits" },
  { file: "slides/noise-protocol.html",            label: "Noise Protocol" },
  { file: "slides/encrypting-not-enough.html",     label: "Encrypting Isn't Enough" },
  { file: "slides/diffie-hellman-insight.html",    label: "Diffie-Hellman Insight" },
  { file: "slides/diffie-hellman-visual.html",     label: "Diffie-Hellman Visual" },
  { file: "slides/secrecy-to-integrity.html",      label: "Secrecy to Integrity: AEAD" },
  { file: "slides/key-authenticity.html",          label: "Key Authenticity" },
  { file: "slides/6-more-revenue-sv2.html",     label: "more-revenue-sv2" },
  { file: "slides/sv2-miner-profitability.html",   label: "SV2: Miner Profitability" },
  { file: "slides/conclusion-and-roadmap.html",    label: "Conclusion & Roadmap" },
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
  slideFrame.src = SLIDES[currentIndex].file;
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
  const scale = Math.min(availW / SLIDE_W, availH / SLIDE_H, Infinity);

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
  // Defer rescale until after the browser has finished the fullscreen layout.
  // A single rAF isn't enough — double rAF ensures we're past both style recalc
  // and layout, so getBoundingClientRect() returns the correct final dimensions.
  requestAnimationFrame(() => requestAnimationFrame(rescale));
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
    iframe.src = slide.file;
    iframe.loading = 'lazy';
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.tabIndex = -1;

    const label = document.createElement('div');
    label.className = 'drawer-thumb-label';
    label.textContent = slide.label;

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
    slideFrame.src = SLIDES[currentIndex].file;
  }
  updateUI();
  rescale();
}

init();
