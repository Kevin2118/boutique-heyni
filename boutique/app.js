/* ═══════════════════════════════════════════════════════════════
   BOUTIQUE HEYNI — app.js  (Diseño Romántico Floral)
═══════════════════════════════════════════════════════════════ */

/* ── DARK MODE ── */
const html = document.documentElement;
const darkBtn  = document.getElementById('darkToggle');
const darkIcon = document.getElementById('darkIcon');

const saved = localStorage.getItem('heyni-theme') || 'light';
html.setAttribute('data-theme', saved);
setDarkIcon(saved);

darkBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('heyni-theme', next);
  setDarkIcon(next);
});

function setDarkIcon(t) {
  darkIcon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ── NAVBAR SCROLL ── */
const nav = document.getElementById('nav');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  backTop.classList.toggle('show', window.scrollY > 400);

  // Active nav link by section
  const links = document.querySelectorAll('.nm-link');
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < 160 && top > -sec.offsetHeight + 100) {
      links.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nm-link[href="#${sec.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { passive: true });

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('.nm-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
  });
});

/* ── BACK TO TOP ── */
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── FADE-UP REVEAL ── */
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 75);
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

/* ── HERO reveal on load ── */
window.addEventListener('load', () => {
  document.querySelector('.hero-copy')?.classList.add('in');
  document.querySelector('.hero-visual')?.classList.add('in');
});

/* ── FILTER TABS ── */
const tabs = document.querySelectorAll('.tab');
const prds  = document.querySelectorAll('.prd');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.f;
    prds.forEach(p => {
      const match = f === 'all' || p.dataset.cat === f;
      p.style.display = match ? '' : 'none';
      if (match) animateIn(p);
    });
  });
});

function animateIn(el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity .4s ease, transform .4s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }));
}

/* ── CART & TOAST ── */
let cartCount = 0;
const cartPill = document.getElementById('cartPill');
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer;

document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    cartCount++;
    cartPill.textContent = cartCount;
    cartPill.classList.remove('pop');
    void cartPill.offsetWidth;
    cartPill.classList.add('pop');

    const name = btn.dataset.name || 'Producto';
    toastMsg.textContent = `"${name}" añadido ✿`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  });
});

/* ── WISHLIST TOGGLE ── */
document.querySelectorAll('.wish-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const icon = btn.querySelector('i');
    const on = icon.classList.contains('fa-solid');
    icon.className = on ? 'fa-regular fa-heart' : 'fa-solid fa-heart';
    btn.style.background = on ? '' : 'var(--rose)';
    btn.style.color = on ? '' : '#fff';
  });
});

/* ── COUNTDOWN ── */
function getTarget() {
  const stored = localStorage.getItem('heyni-cd');
  if (stored) {
    const t = parseInt(stored, 10);
    if (t > Date.now()) return t;
  }
  const t = Date.now() + (23 * 3600 + 59 * 60 + 59) * 1000;
  localStorage.setItem('heyni-cd', t.toString());
  return t;
}

const target = getTarget();
const elH = document.getElementById('cdH');
const elM = document.getElementById('cdM');
const elS = document.getElementById('cdS');

function tick() {
  const diff = Math.max(0, target - Date.now());
  elH.textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
  elM.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  elS.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
tick();
setInterval(tick, 1000);

/* ── CONTACT FORM ── */
const form = document.getElementById('contactForm');
const fSuccess = document.getElementById('fSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;

  clearF('fNombre', 'eNombre');
  clearF('fEmail',  'eEmail');
  clearF('fMsg',    'eMsg');

  const nombre = document.getElementById('fNombre').value.trim();
  const email  = document.getElementById('fEmail').value.trim();
  const msg    = document.getElementById('fMsg').value.trim();

  if (nombre.length < 2)                          { setF('fNombre','eNombre','Ingresa tu nombre completo.'); ok=false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setF('fEmail','eEmail','Correo inválido.'); ok=false; }
  if (msg.length < 10)                             { setF('fMsg','eMsg','El mensaje debe tener al menos 10 caracteres.'); ok=false; }

  if (!ok) return;

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';
    fSuccess.classList.add('show');
    setTimeout(() => fSuccess.classList.remove('show'), 5000);
  }, 1800);
});

function setF(inputId, errId, msg) {
  document.getElementById(inputId).classList.add('err');
  document.getElementById(errId).textContent = msg;
}
function clearF(inputId, errId) {
  document.getElementById(inputId).classList.remove('err');
  document.getElementById(errId).textContent = '';
}
['fNombre','fEmail','fMsg'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('err');
  });
});