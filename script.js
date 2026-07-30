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