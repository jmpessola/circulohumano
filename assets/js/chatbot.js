/* Matías Rebozov — Chatbot */
'use strict';

(function() {

  /* --- Knowledge base ---------------------------------- */
  const KB = [
    {
      keys: ['hola','hello','hey','buenas','buen','tarde','noche','mañana'],
      reply: '¡Hola! Soy el asistente de Matías. ¿En qué puedo ayudarte? Podés preguntarme sobre sus programas, retiros, charlas o cómo contactarlo. 😊'
    },
    {
      keys: ['coaching','qué hacés','que haces','hacés','haces','trabajo','servicios','ofrece','ofrecés'],
      reply: 'Matías ofrece tres modalidades:<br>• <b>Coaching individual</b> (1:1 personalizado)<br>• <b>Círculo Humano Academia</b> (programa grupal)<br>• <b>Retiros en la naturaleza</b> (experiencias inmersivas)<br><br>¿Querés saber más de alguna?'
    },
    {
      keys: ['individual','sesión','sesion','1:1','proceso personal','uno a uno'],
      reply: 'El <b>coaching individual</b> es un proceso 1:1 diseñado a medida. Trabajás directamente con Matías en lo que más importa transformar. Para consultar disponibilidad escribile a <a href="https://www.instagram.com/matirebozov" target="_blank">@matirebozov</a> 💬'
    },
    {
      keys: ['academia','circulo','círculo','grupal','grupo','comunidad'],
      reply: '<b>Círculo Humano Academia</b> es el programa grupal de desarrollo personal. Herramientas concretas, comunidad genuina y práctica sostenida. Un espacio para crecer rodeado de personas que también eligen crecer. 🐍'
    },
    {
      keys: ['retiro','retiros','naturaleza','inmersivo','inmersiva','viaje'],
      reply: 'Los <b>retiros</b> son experiencias inmersivas en la naturaleza que incluyen:<br>✦ Dinámicas de autoconocimiento<br>✦ Meditación y respiración consciente<br>✦ Integración grupal y cierre<br>✦ Desconexión digital total<br><br>Para fechas y disponibilidad contactá a Matías directamente.'
    },
    {
      keys: ['charla','conferencia','speaker','habla','universid','empresa'],
      reply: 'Matías es <b>speaker</b> invitado en universidades, empresas y eventos. Sus charlas combinan experiencia real con herramientas prácticas que conectan. Para invitarlo, escribile a <a href="https://www.instagram.com/matirebozov" target="_blank">@matirebozov</a>.'
    },
    {
      keys: ['precio','costo','cuánto','cuanto','vale','tarifa','dinero','inversión'],
      reply: 'Para información de precios y disponibilidad te recomiendo escribirle directamente a Matías:<br>📸 <a href="https://www.instagram.com/matirebozov" target="_blank">@matirebozov</a><br>📧 <a href="mailto:matiasrebozov@gmail.com">matiasrebozov@gmail.com</a>'
    },
    {
      keys: ['contacto','hablar','escribir','empezar','empezá','empezar','cómo arranco','arranco'],
      reply: 'Podés contactar a Matías por:<br>📸 Instagram: <a href="https://www.instagram.com/matirebozov" target="_blank">@matirebozov</a><br>📧 Email: <a href="mailto:matiasrebozov@gmail.com">matiasrebozov@gmail.com</a><br><br>O ir directo a la sección <a href="#contacto">Contacto</a> de la web. 👇'
    },
    {
      keys: ['instagram','insta','redes','red social','social'],
      reply: 'Seguí a Matías en Instagram: <a href="https://www.instagram.com/matirebozov" target="_blank">@matirebozov</a><br>Y a Círculo Humano: <a href="https://www.instagram.com/circulohumano_academia" target="_blank">@circulohumano_academia</a> 🌿'
    },
    {
      keys: ['ouroboros','simbolo','símbolo','serpiente','logo','marca'],
      reply: 'El <b>ouroboros</b> — la serpiente que se muerde la cola — es el símbolo de Círculo Humano. Representa el ciclo eterno de transformación: el proceso sin fin de convertirse en una versión más consciente de uno mismo. 🐍✨'
    },
    {
      keys: ['gracias','genial','excelente','perfecto','buenísimo','buenisimo','ok','dale'],
      reply: '¡De nada! Si tenés más preguntas, acá estoy. También podés contactar directamente a Matías en Instagram: <a href="https://www.instagram.com/matirebozov" target="_blank">@matirebozov</a> 🙌'
    }
  ];

  const DEFAULT = 'No entendí bien tu pregunta, ¡disculpame! Podés escribirle directamente a Matías en Instagram: <a href="https://www.instagram.com/matirebozov" target="_blank">@matirebozov</a> 😊';

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
    if (autoOpened) return;
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
