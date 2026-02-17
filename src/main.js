const SLIDES = [
  { file: "slides/title-slide.html",              label: "Title Slide" },
  { file: "slides/sv1-architecture.html",          label: "SV1 Architecture" },
  { file: "slides/sv1-message-flow.html",          label: "SV1 Message Flow" },
  { file: "slides/connection-setup.html",          label: "Connection Setup" },
  { file: "slides/mining-subscribe.html",          label: "mining.subscribe" },
  { file: "slides/mining-authorize.html",          label: "mining.authorize" },
  { file: "slides/mining-notify.html",             label: "mining.notify" },
  { file: "slides/difficulty-and-shares.html",     label: "Difficulty & Shares" },
  { file: "slides/coinbase-construction.html",     label: "Coinbase Construction" },
  { file: "slides/building-coinbase-tx.html",      label: "Building Coinbase Tx" },
  { file: "slides/block-header-assembly.html",     label: "Block Header Assembly" },
  { file: "slides/sv1-plaintext-weakness.html",    label: "SV1 Plaintext Weakness" },
  { file: "slides/protocol-vulnerabilities.html",  label: "Protocol Vulnerabilities" },
  { file: "slides/blackhat-mitm-preconditions.html", label: "BlackHat MITM Preconditions" },
  { file: "slides/hashrate-stealing-intro.html",   label: "Hashrate Stealing Intro" },
  { file: "slides/attack-preconditions.html",      label: "Attack Preconditions" },
  { file: "slides/job-injection-extranonce.html",  label: "Job Injection: Extranonce" },
  { file: "slides/job-injection-exploit.html",     label: "Job Injection: Exploit" },
  { file: "slides/job-injection-diagram.html",     label: "Job Injection: Diagram" },
  { file: "slides/time-segment-overview.html",     label: "Time-Segment Overview" },
  { file: "slides/time-segment-injection.html",    label: "Time-Segment Injection" },
  { file: "slides/time-segment-timeline.html",     label: "Time-Segment Timeline" },
  { file: "slides/why-attacks-work.html",          label: "Why Attacks Work" },
  { file: "slides/speaking-privately.html",        label: "Speaking Privately" },
  { file: "slides/encrypting-not-enough.html",     label: "Encrypting Isn't Enough" },
  { file: "slides/diffie-hellman-insight.html",    label: "Diffie-Hellman Insight" },
  { file: "slides/diffie-hellman-visual.html",     label: "Diffie-Hellman Visual" },
  { file: "slides/secrecy-to-integrity.html",      label: "Secrecy to Integrity: AEAD" },
  { file: "slides/key-authenticity.html",          label: "Key Authenticity" },
  { file: "slides/noise-protocol.html",            label: "Noise Protocol" },
  { file: "slides/sv2-security-by-design.html",    label: "SV2 Security by Design" },
  { file: "slides/sv2-three-layer-security.html",  label: "SV2 Three-Layer Security" },
  { file: "slides/sv2-server-auth.html",           label: "SV2 Server Auth" },
  { file: "slides/why-mitm-fails-sv2.html",       label: "Why MITM Fails in SV2" },
  { file: "slides/job-negotiation.html",           label: "Job Negotiation" },
  { file: "slides/sri-details.html",              label: "SRI Details" },
  { file: "slides/sv1-vs-sv2-comparison.html",     label: "SV1 vs SV2 Comparison" },
  { file: "slides/how-v2-blocks-attacks.html",     label: "How V2 Blocks Attacks" },
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
