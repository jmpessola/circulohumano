/* Círculo Humano — Landings JS
   YouTube facade · reels autoplay · sticky CTA · checkout link
   ------------------------------------------------------------------ */
'use strict';

/* ============================================================
   👉 LINK DE PAGO — Mercado Pago
   Reemplazá esta URL por tu "Link de pago" / suscripción real de
   Mercado Pago. Se aplica a TODOS los botones con clase .js-checkout.
   Ej: https://link.mercadopago.com.ar/circulohumano
   ============================================================ */
const CHECKOUT_URL = 'https://www.mercadopago.com.ar/'; // ← PLACEHOLDER: pegá tu link acá

(function checkout() {
  document.querySelectorAll('.js-checkout').forEach(a => {
    a.setAttribute('href', CHECKOUT_URL);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
})();

/* --- YouTube lite facade ------------------------------------ */
(function ytLite() {
  document.querySelectorAll('.yt-lite').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    // poster: probar maxres, caer a hqdefault
    const hq = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    const max = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    el.style.backgroundImage = `url(${hq})`;
    const probe = new Image();
    probe.onload = () => { if (probe.naturalWidth > 480) el.style.backgroundImage = `url(${max})`; };
    probe.src = max;

    const watchUrl = `https://www.youtube.com/watch?v=${id}`;
    const isFile = location.protocol === 'file:';

    el.addEventListener('click', () => {
      // YouTube no se puede embeber desde file:// (doble clic) -> da "Error 153".
      // En ese caso abrimos el video directamente en YouTube.
      if (isFile) { window.open(watchUrl, '_blank', 'noopener'); return; }
      if (el.dataset.loaded) return;
      el.dataset.loaded = '1';
      const origin = encodeURIComponent(location.origin);
      const iframe = document.createElement('iframe');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('title', 'Video — Círculo Humano');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=${origin}`;
      el.innerHTML = '';
      el.appendChild(iframe);
    });
  });
})();

/* --- Reels: reproducir sólo cuando están a la vista --------- */
(function reels() {
  const vids = document.querySelectorAll('.reel-vid');
  if (!vids.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) { v.play().catch(() => {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.4 });
    vids.forEach(v => io.observe(v));
  } else {
    vids.forEach(v => v.play().catch(() => {}));
  }

  // Toggle de sonido por reel
  document.querySelectorAll('.reel-mute').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.reel-card');
      const v = card && card.querySelector('.reel-vid');
      if (!v) return;
      // silenciar todos menos éste
      document.querySelectorAll('.reel-vid').forEach(o => { if (o !== v) { o.muted = true; } });
      document.querySelectorAll('.reel-mute').forEach(b => b.classList.remove('on'));
      v.muted = !v.muted;
      btn.classList.toggle('on', !v.muted);
      btn.innerHTML = v.muted ? ICON_MUTED : ICON_SOUND;
    });
  });
})();

const ICON_MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';
const ICON_SOUND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>';

/* --- Sticky CTA (mobile): aparece tras pasar el hero -------- */
(function stickyCta() {
  const bar = document.querySelector('.sticky-cta');
  if (!bar) return;
  const hero = document.querySelector('.lhero');
  const trigger = hero ? hero.offsetHeight * 0.8 : 600;
  window.addEventListener('scroll', () => {
    bar.classList.toggle('show', window.scrollY > trigger);
  }, { passive: true });
})();
