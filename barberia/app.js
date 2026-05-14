/* ═══════════════════════════════════════════════════
   BARBER X — app.js
═══════════════════════════════════════════════════ */

/* ── NAVBAR SCROLL ── */
const nav      = document.getElementById('nav');
const backTop  = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  backTop.classList.toggle('show', window.scrollY > 400);

  // Active link highlight
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < 160 && top > -sec.offsetHeight + 100) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { passive: true });

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  });
});

/* ── BACK TO TOP ── */
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── REVEAL ON SCROLL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── COUNTER ANIMATION ── */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObs.disconnect();
    }
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.nos-stats');
if (statsSection) counterObs.observe(statsSection);

function animateCounters() {
  document.querySelectorAll('.ns-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  });
}

/* ── SET MIN DATE ON DATE INPUT ── */
const fechaInput = document.getElementById('rFecha');
if (fechaInput) {
  const today = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute('min', today);
}

/* ── RESERVATION FORM ── */
const form     = document.getElementById('reservaForm');
const rSuccess = document.getElementById('rSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;

  clearF('rNombre','eRNombre');
  clearF('rTel','eRTel');
  clearF('rSrv','eRSrv');
  clearF('rFecha','eRFecha');

  if (document.getElementById('rNombre').value.trim().length < 2)
    { setF('rNombre','eRNombre','Ingresa tu nombre.'); ok = false; }

  if (document.getElementById('rTel').value.trim().length < 7)
    { setF('rTel','eRTel','Ingresa un teléfono válido.'); ok = false; }

  if (!document.getElementById('rSrv').value)
    { setF('rSrv','eRSrv','Selecciona un servicio.'); ok = false; }

  if (!document.getElementById('rFecha').value)
    { setF('rFecha','eRFecha','Selecciona una fecha.'); ok = false; }

  if (!ok) return;

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando…';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Reservar ahora';
    rSuccess.classList.add('show');
    setTimeout(() => rSuccess.classList.remove('show'), 5000);
  }, 1600);
});

function setF(id, errId, msg) {
  document.getElementById(id).classList.add('err');
  document.getElementById(errId).textContent = msg;
}
function clearF(id, errId) {
  document.getElementById(id).classList.remove('err');
  document.getElementById(errId).textContent = '';
}
['rNombre','rTel','rSrv','rFecha'].forEach(id => {
  document.getElementById(id).addEventListener('input', () =>
    document.getElementById(id).classList.remove('err')
  );
});