// Acordeón FAQ — al abrir una pregunta, cierra cualquier otra que esté abierta
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Menú mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Botón "← Volver" — usa el historial del navegador para volver
// exactamente a donde estabas (con scroll incluido) en vez de
// siempre recargar Servicios desde el principio.
document.querySelectorAll('.back-link').forEach(link => {
  link.addEventListener('click', (e) => {
    // Si hay una página anterior en el historial de esta pestaña, volvemos ahí.
    // Si no (ej: alguien entró directo a esta URL), usamos el href normal como respaldo.
    if (document.referrer && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  });
});

// Efecto de "reveal" al hacer scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));


// Contador animado — se activa cuando el elemento entra en pantalla
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1200;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toLocaleString('es-AR');
        if(progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('es-AR');
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));