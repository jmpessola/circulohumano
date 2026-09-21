/* Círculo Humano — Landing JS
   Config · WhatsApp · YouTube facade · reels · galería · sticky CTA
   ------------------------------------------------------------------ */
'use strict';

/* ==================================================================
   ⚙️  CONFIGURACIÓN — todo lo que falta completar se cambia ACÁ.
   No hace falta tocar el HTML.
   ================================================================== */

/* 1) WHATSAPP BUSINESS — destino de TODOS los botones de "sumarse".
      Formato: código de país + número, sin +, sin 0, sin 15, sin espacios.
      Argentina: 54 + 9 + característica sin 0 + número sin 15.
      Ej: (11) 5555-4444  →  '5491155554444'
      Mientras esté vacío, los botones bajan a la sección Contacto.      */
const WHATSAPP_NUM = '5491141906036';   // +54 9 11 4190-6036

/* 2) Mensaje prearmado que le llega a Matías al abrir el chat.          */
const WHATSAPP_MSG = 'Estoy listo para el acompañamiento grupal del Círculo Humano.';

/* 3) VIDEO de YouTube de "¿De qué se trata?".
      Es el ID, no la URL entera: youtube.com/watch?v=ESTO_ES_EL_ID
      También sirve pegar la URL completa: la función lo extrae sola.    */
const VIDEO_ID = 'z8m3bAemaPc';   // ← ✏️ REEMPLAZAR POR EL VIDEO NUEVO

/* 4) REDES.                                                            */
const IG_CIRCULO = 'https://www.instagram.com/circulohumano_academia';  // ← ✏️ confirmar
const YT_MATIAS  = 'https://www.youtube.com/@matirebozov';              // ← ✏️ confirmar

/* ================================================================== */


/* --- WhatsApp: reescribe todos los .js-wa -------------------------- */
(function whatsapp() {
  const btns = document.querySelectorAll('.js-wa');
  if (!btns.length) return;

  const num = String(WHATSAPP_NUM).replace(/\D/g, '');
  if (!num) {
    console.warn('[Círculo Humano] Falta cargar WHATSAPP_NUM en assets/js/landing.js — ' +
                 'los botones de "sumarse" quedan apuntando a #contacto.');
    return;                       // deja el href="#contacto" del HTML
  }

  const url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(WHATSAPP_MSG);
  btns.forEach(a => {
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
})();

/* --- Redes: permite cambiar los links desde la config -------------- */
(function redes() {
  const setLink = (sel, url) => {
    if (!url) return;
    document.querySelectorAll(sel).forEach(a => a.setAttribute('href', url));
  };
  setLink('.js-ig-circulo', IG_CIRCULO);
  setLink('.js-yt', YT_MATIAS);

  // el @ que se muestra en la tarjeta sigue al link
  const handle = (IG_CIRCULO.match(/instagram\.com\/([^/?#]+)/) || [])[1];
  if (handle) {
    document.querySelectorAll('.js-ig-circulo-handle').forEach(el => { el.textContent = '@' + handle; });
  }
})();

/* --- YouTube lite facade ------------------------------------------- */
(function ytLite() {
  // acepta ID pelado o URL completa (watch?v= / youtu.be / embed)
  function toId(v) {
    if (!v) return '';
    const m = String(v).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : String(v).trim();
  }

  document.querySelectorAll('.yt-lite').forEach(el => {
    const id = toId(VIDEO_ID) || el.dataset.id;
    if (!id) return;
    el.dataset.id = id;

    // poster: probar maxres, caer a hqdefault
    const hq  = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    const max = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    el.style.backgroundImage = `url(${hq})`;
    const probe = new Image();
    probe.onload = () => { if (probe.naturalWidth > 480) el.style.backgroundImage = `url(${max})`; };
    probe.src = max;

    const watchUrl = `https://www.youtube.com/watch?v=${id}`;
    const isFile = location.protocol === 'file:';

    function play() {
      // YouTube no se puede embeber desde file:// (doble clic) -> "Error 153".
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
    }

    el.addEventListener('click', play);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  });
})();

/* --- Reels: reproducir sólo cuando están a la vista ---------------- */
const ICON_MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';
const ICON_SOUND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>';

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
      document.querySelectorAll('.reel-mute').forEach(b => {
        b.classList.remove('on');
        b.innerHTML = ICON_MUTED;
      });
      v.muted = !v.muted;
      btn.classList.toggle('on', !v.muted);
      btn.innerHTML = v.muted ? ICON_MUTED : ICON_SOUND;
    });
  });
})();

/* --- Sticky CTA (mobile): aparece tras pasar el hero --------------- */
(function stickyCta() {
  const bar = document.querySelector('.sticky-cta');
  if (!bar) return;
  const hero = document.querySelector('.lhero');
  const trigger = hero ? hero.offsetHeight * 0.8 : 600;
  window.addEventListener('scroll', () => {
    bar.classList.toggle('show', window.scrollY > trigger);
  }, { passive: true });
})();
