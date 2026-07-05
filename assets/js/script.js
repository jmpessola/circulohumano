/* Matías Rebozov — Main JS */
'use strict';

/* --- AOS -------------------------------------------- */
AOS.init({
  duration: 900,
  once: true,
  offset: 60,
  easing: 'ease-out-cubic'
});

/* --- Custom cursor (desktop) ------------------------- */
(function() {
  const isFine = window.matchMedia('(pointer: fine)').matches;
  if (!isFine) return;

  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('cursor--hover');
      ring.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('cursor--hover');
      ring.classList.remove('cursor--hover');
    });
  });
})();

/* --- Navigation --------------------------------------- */
(function() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('nav-links--open');
      toggle.classList.toggle('nav-toggle--open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('nav-links--open');
        toggle.classList.remove('nav-toggle--open');
      });
    });
  }
})();

/* --- Hero parallax ------------------------------------ */
(function() {
  const img = document.getElementById('hero-img');
  if (!img) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        img.style.transform = `translateY(${y * 0.28}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
})();

/* --- Stats counter ------------------------------------ */
(function() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  function animCount(el, target, dur) {
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target, parseInt(e.target.dataset.target), 1600);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => obs.observe(c));
})();

/* --- Gallery: lightbox -------------------------------- */
(function() {
  const items = document.querySelectorAll('.gallery-item img');
  if (!items.length) return;

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <button class="lb-prev" aria-label="Anterior">&#8592;</button>
    <div class="lb-img-wrap"><img class="lb-img" src="" alt=""></div>
    <button class="lb-next" aria-label="Siguiente">&#8594;</button>
    <button class="lb-close" aria-label="Cerrar">&times;</button>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #lightbox{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s}
    #lightbox.lb-open{opacity:1;pointer-events:all}
    .lb-backdrop{position:absolute;inset:0;background:rgba(11,9,7,.94);cursor:zoom-out}
    .lb-img-wrap{position:relative;z-index:1;max-width:90vw;max-height:90vh}
    .lb-img{display:block;max-width:90vw;max-height:90vh;object-fit:contain;transition:opacity .25s}
    .lb-close{position:absolute;top:1.5rem;right:1.5rem;z-index:2;font-size:2rem;color:rgba(242,232,213,.7);background:none;border:none;cursor:pointer;transition:color .2s;line-height:1}
    .lb-close:hover{color:#C9A264}
    .lb-prev,.lb-next{position:absolute;top:50%;transform:translateY(-50%);z-index:2;font-size:2rem;color:rgba(242,232,213,.5);background:none;border:none;cursor:pointer;padding:1rem;transition:color .2s}
    .lb-prev{left:1rem}.lb-next{right:1rem}
    .lb-prev:hover,.lb-next:hover{color:#C9A264}
  `;
  document.head.appendChild(style);
  document.body.appendChild(lb);

  const lbImg  = lb.querySelector('.lb-img');
  let current  = 0;
  const srcs   = Array.from(items).map(i => i.src);

  function show(i) {
    current = (i + srcs.length) % srcs.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = srcs[current];
      lbImg.style.opacity = '1';
    }, 200);
    lb.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('lb-open');
    document.body.style.overflow = '';
  }

  items.forEach((img, i) => {
    img.parentElement.style.cursor = 'zoom-in';
    img.parentElement.addEventListener('click', () => show(i));
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-backdrop').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('lb-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

/* --- Smooth scroll for all anchor links --------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
