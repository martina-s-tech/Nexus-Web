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


// Modal de detalle con carrusel de fotos
function isVideo(src){
  return /\.(mp4|webm|mov)$/i.test(src);
}

document.querySelectorAll('.option-card').forEach(card => {
  card.addEventListener('click', () => {
    const imgEl = card.querySelector('.option-card-img');
    const gallery = (imgEl.dataset.gallery || imgEl.querySelector('img').src)
      .toString().split(',').map(s => s.trim());
    const bodyHTML = card.querySelector('.option-card-body').innerHTML;
    const alt = imgEl.querySelector('img').alt;

    let current = 0;

    const overlay = document.createElement('div');
    overlay.className = 'detail-modal-overlay';
    overlay.innerHTML = `
      <div class="detail-modal">
        <button class="detail-modal-close" aria-label="Cerrar">✕</button>
        <div class="detail-modal-img">
          ${isVideo(gallery[0]) ? `<video src="${gallery[0]}" controls autoplay muted loop></video>` : `<img src="${gallery[0]}" alt="${alt}">`}
          ${gallery.length > 1 ? `
            <button class="carousel-btn carousel-prev" aria-label="Anterior">‹</button>
            <button class="carousel-btn carousel-next" aria-label="Siguiente">›</button>
            <div class="carousel-dots">
              ${gallery.map((_, i) => `<span class="carousel-dot${i===0?' active':''}" data-i="${i}"></span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="detail-modal-body">${bodyHTML}</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const dots = overlay.querySelectorAll('.carousel-dot');

    function showImage(i){
      current = (i + gallery.length) % gallery.length;
      const src = gallery[current];
      const mediaEl = isVideo(src)
        ? `<video src="${src}" controls autoplay muted loop></video>`
        : `<img src="${src}" alt="${alt}">`;
      overlay.querySelector('.detail-modal-img').firstElementChild.outerHTML = mediaEl;
      dots.forEach(d => d.classList.remove('active'));
      if(dots[current]) dots[current].classList.add('active');
    }

    overlay.querySelector('.carousel-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(current - 1);
    });
    overlay.querySelector('.carousel-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(current + 1);
    });
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(parseInt(dot.dataset.i, 10));
      });
    });

    overlay.addEventListener('click', (e) => {
      if(e.target === overlay || e.target.classList.contains('detail-modal-close')){
        overlay.remove();
      }
    });
  });
});