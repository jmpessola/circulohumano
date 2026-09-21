/* Matías Rebozov — Chatbot */
'use strict';

(function() {

  /* --- Knowledge base ---------------------------------- */
  const KB = [
    {
      keys: ['hola','hello','hey','buenas','buen','tarde','noche','mañana'],
      reply: '¡Hola! Soy el asistente del Círculo Humano. Puedo contarte qué incluye el acompañamiento, cuándo son los encuentros, cómo sumarte y más. ¿Qué querés saber? 🌿'
    },
    {
      keys: ['incluye','acompanamiento','acompañamiento','membresia','membresía','que es','qué es','beneficio','beneficios','recibo','tiene'],
      reply: 'El <b>acompañamiento del Círculo Humano</b> incluye:<br>• Sesión de bienvenida personalizada con Matías<br>• Encuentros en vivo todos los sábados, presenciales y online<br>• Acceso a todas las grabaciones<br>• Acceso a los cursos esenciales<br>• Comunidad<br>• Acompañamiento 24/7<br><br>Podés verlo completo en <a href="#acompanamiento">Acompañamiento</a>. 🐍'
    },
    {
      keys: ['encuentro','encuentros','cuando','cuándo','horario','sabado','sábado','vivo','online','presencial','hora'],
      reply: 'Los <b>encuentros en vivo</b> son todos los <b>sábados</b>, presenciales y online. Y si no llegás en vivo, todas las grabaciones quedan disponibles. 🎥'
    },
    {
      keys: ['sumar','sumarme','pago','pagar','precio','costo','cuanto','cuánto','tarjeta','mercado','unirme','entrar','arranco','formar parte'],
      reply: 'Para sumarte, tocá <a href="#acompanamiento">"Quiero sumarme al acompañamiento grupal"</a>: se abre un chat de WhatsApp con Matías. Ahí te responde las dudas y, si estás listo, te pasa el link de pago que corresponde a tu país. 💬'
    },
    {
      keys: ['academia','curso','cursos','clave','claves','ley','leyes','formacion','formación'],
      reply: 'El acceso completo a los <b>cursos esenciales</b> está incluido en el acompañamiento: la práctica llevada más lejos, a tu ritmo. Mirá todo lo que incluye en <a href="#incluye">Qué vas a encontrar</a>. 📚'
    },
    {
      keys: ['para quien','para quién','me sirve','es para mi','es para mí','preparar','prepararme','requisito','requisitos'],
      reply: 'Es para personas que sienten frustración con su vida actual y están en una búsqueda mental constante. <b>No hace falta prepararte</b>: ni saber meditar, ni haber hecho terapia, ni tener mucho tiempo, energía o todo claro. Solo se necesita dar un paso. ✨'
    },
    {
      keys: ['terapia','psico','terapeuta'],
      reply: 'No es <b>terapia tradicional</b>, solitaria ni eterna. Es un espacio de práctica y comunidad para compartir el camino de manera amorosa, cuidada y divertida. 🐍'
    },
    {
      keys: ['matias','matías','rebozov','quien','quién','equipo','coach'],
      reply: '<b>Matías Rebozov</b> se dedicó a la economía hasta los 32 años, cuando decidió soltarlo todo. De esa autoindagación nació el coaching y este espacio, que ya acompañó a cientos de personas. Acompaña junto a su equipo. Leelo en <a href="#matias">Quién acompaña</a>.'
    },
    {
      keys: ['contacto','hablar','escribir','instagram','insta','mail','email','duda','dudas','redes','youtube','video'],
      reply: 'Encontranos en:<br>📸 <a href="https://www.instagram.com/matirebozov" target="_blank">Instagram de Matías</a><br>📸 <a href="https://www.instagram.com/circulohumano_academia" target="_blank">Instagram de Círculo Humano</a><br>▶️ <a href="https://www.youtube.com/@matirebozov" target="_blank">YouTube de Matías</a><br><br>O bajá hasta <a href="#contacto">Contacto</a>. 🌿'
    },
    {
      keys: ['gracias','genial','excelente','perfecto','buenísimo','buenisimo','ok','dale'],
      reply: '¡De nada! Si te quedan dudas, acá estoy. Y cuando quieras, te esperamos en el <a href="#acompanamiento">Círculo</a>. 🙌'
    }
  ];

  const DEFAULT = 'No entendí bien tu pregunta, ¡disculpame! Escribinos a <a href="https://www.instagram.com/circulohumano_academia" target="_blank">el Instagram de Círculo Humano</a> y te ayudamos. 🌿';

  function getReply(msg) {
    const q = msg.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    for (const item of KB) {
      if (item.keys.some(k => q.includes(k.normalize('NFD').replace(/[̀-ͯ]/g, '')))) {
        return item.reply;
      }
    }
    return DEFAULT;
  }

  /* --- DOM references ---------------------------------- */
  const root   = document.getElementById('chatbot-root');
  const toggle = document.getElementById('chatbot-toggle');
  const panel  = document.getElementById('chatbot-panel');
  const msgs   = document.getElementById('chatbot-messages');
  const input  = document.getElementById('chatbot-input');
  const sendBtn= document.getElementById('chatbot-send');
  const quick  = document.getElementById('cb-quick');

  if (!toggle || !panel || !msgs || !input) return;

  /* --- Punto 16: el chat existe SOLO en desktop -------- */
  const soloDesktop = () => !window.matchMedia('(max-width: 860px), (pointer: coarse) and (max-width: 1024px)').matches;
  if (!soloDesktop() && root) { root.setAttribute('aria-hidden', 'true'); }

  /* --- Toggle ------------------------------------------ */
  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('cb-panel-open');
    toggle.classList.toggle('cb-open', isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) { input.focus(); }
  });

  /* --- Message rendering ------------------------------- */
  function addMsg(html, isBot) {
    const wrap = document.createElement('div');
    wrap.className = 'cb-msg ' + (isBot ? 'cb-msg--bot' : 'cb-msg--user');
    const p = document.createElement('p');
    if (isBot) p.innerHTML = html;
    else p.textContent = html;
    wrap.appendChild(p);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
    if (quick && !isBot) { quick.remove(); }
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'cb-typing';
    el.id = 'cb-typing-el';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function sendMessage(text) {
    text = text.trim();
    if (!text) return;
    addMsg(text, false);
    input.value = '';

    const typing = showTyping();
    const delay  = 700 + text.length * 8;
    setTimeout(() => {
      typing.remove();
      addMsg(getReply(text), true);
    }, Math.min(delay, 1600));
  }

  /* --- Quick replies ----------------------------------- */
  if (quick) {
    quick.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => sendMessage(btn.dataset.msg));
    });
  }

  /* --- Input ------------------------------------------- */
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage(input.value);
  });
  if (sendBtn) {
    sendBtn.addEventListener('click', () => sendMessage(input.value));
  }

  /* --- Auto-open greeting on scroll -------------------- */
  let autoOpened = false;
  window.addEventListener('scroll', () => {
    if (autoOpened || !soloDesktop()) return;
    if (window.scrollY > window.innerHeight * 0.7) {
      autoOpened = true;
      setTimeout(() => {
        if (!panel.classList.contains('cb-panel-open')) {
          panel.classList.add('cb-panel-open');
          toggle.classList.add('cb-open');
          panel.setAttribute('aria-hidden', 'false');
        }
      }, 800);
    }
  }, { passive: true });

})();
