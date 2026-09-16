/* =============================================================
   ALMARA · PSICOLOGÍA — comportamiento de la web
   -------------------------------------------------------------
   No hace falta tocar este archivo para cambiar los datos:
   eso se hace en  lib/manifest.js  (el "config").

   Todo va dentro de una función cerrada y cada bloque está
   protegido: si uno fallara, el resto de la web sigue funcionando.
   ============================================================= */

(function () {
  "use strict";

  var data = window.__BRAND__ || {};

  /* --- Ayudantes ------------------------------------------- */
  var $  = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var reduced   = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function escHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function get(path) {
    return String(path).split(".").reduce(function (acc, k) {
      return acc && acc[k] != null ? acc[k] : null;
    }, data);
  }

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* Enlace de la agenda de Cal.com, tal cual se escribe en el config:
     "usuario/evento" (por ejemplo "vereda-psicologia/primera-sesion").
     Se aceptan también pegadas enteras: "https://cal.com/usuario/evento". */
  function calLink() {
    var b = data.booking || {};
    var v = String(b.calLink || "").trim();
    if (!v) return "";
    return v.replace(/^https?:\/\/(?:www\.)?cal\.com\//i, "").replace(/^\/+|\/+$/g, "");
  }


  /* =========================================================
     1. Volcar el config en la página
     Cada elemento con  data-brand="ruta.del.dato"  recibe su
     texto desde lib/manifest.js. Si el dato no existe, se queda
     el texto que ya venía escrito en el HTML.
     ========================================================= */
  function applyBrand() {
    $$("[data-brand]").forEach(function (el) {
      var v = get(el.getAttribute("data-brand"));
      if (v != null && String(v).trim() !== "") el.textContent = v;
    });

    // Enlaces construidos a partir del config
    var c = data.contact || {};

    $$('[data-href="tel"]').forEach(function (el) {
      if (c.phoneRaw) el.setAttribute("href", "tel:" + c.phoneRaw);
    });

    $$('[data-href="mailto"]').forEach(function (el) {
      if (c.email) el.setAttribute("href", "mailto:" + c.email);
    });

    // Correo para asuntos legales (páginas de aviso legal y privacidad)
    var lg = data.legal || {};
    $$('[data-href="mailto-legal"]').forEach(function (el) {
      if (lg.email) el.setAttribute("href", "mailto:" + lg.email);
    });

    $$('[data-href="maps"]').forEach(function (el) {
      if (c.mapsUrl) el.setAttribute("href", c.mapsUrl);
    });

    // Botones "Pedir cita": apuntan a la agenda de Cal.com.
    // El enlace normal es la red de seguridad; initBooking() lo convierte
    // en ventana emergente sin salir de la web.
    $$('[data-href="booking"]').forEach(function (el) {
      var link = calLink();
      if (link) {
        el.setAttribute("href", "https://cal.com/" + link);
        el.setAttribute("rel", "noopener");
        if (el.hasAttribute("data-only-if-booking")) el.hidden = false;
      }
    });

    // WhatsApp: solo aparece si está configurado
    $$('[data-href="whatsapp"]').forEach(function (el) {
      if (!c.whatsapp) return;
      var txt = encodeURIComponent("Hola, me gustaría pedir información sobre una primera cita.");
      el.setAttribute("href", "https://wa.me/" + c.whatsapp + "?text=" + txt);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.hidden = false;
    });

    // Año del pie
    $$("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* =========================================================
     Las fotos se detectan solas
     -------------------------------------------------------
     No hay que tocar ningún archivo: basta con dejar la foto
     en la carpeta  assets/img/  con uno de estos nombres:

        retrato   → la foto de «Quién te acompaña»
        portada   → la foto grande de la portada (opcional)

     Vale cualquiera de estos formatos: .webp, .jpg, .jpeg o
     .png. Si hay varios con el mismo nombre, se usa el
     primero de esa lista (el .webp pesa menos).

     Si solo dejas «retrato», se usa esa misma foto en los dos
     sitios. Si no dejas ninguna, se queda la ilustración.

     (Al buscarlas, el navegador pregunta por archivos que
     quizá no existen y anota un 404 en su consola. Es normal
     y no afecta a nada de lo que ve el visitante.)
     ========================================================= */
  var FOTO_DIR = "assets/img/";
  var FOTO_EXT = ["webp", "jpg", "jpeg", "png"];

  function candidatos(nombre) {
    return FOTO_EXT.map(function (ext) { return FOTO_DIR + nombre + "." + ext; });
  }

  function mostrarFoto(slot) {
    slot.hidden = false;
    var svg = slot.parentNode.querySelector("svg");
    if (svg) svg.style.display = "none";
    var fig = slot.closest("figure");
    if (fig) fig.removeAttribute("aria-hidden");
  }

  /* Prueba las rutas sobre la propia imagen de la página: la que
     cargue se queda puesta. Así la foto se descarga UNA sola vez
     (antes se bajaba entera para comprobar que existía y otra vez
     para enseñarla, y con una foto pesada eso tardaba). */
  function montarFoto(slot, nombres) {
    if (!slot) return;
    var rutas = [];
    nombres.forEach(function (n) { rutas = rutas.concat(candidatos(n)); });

    var i = 0;
    slot.alt = (data.pro && data.pro.name) ? data.pro.name : "";
    slot.decoding = "async";

    function intentar() {
      if (i >= rutas.length) return;        // ninguna existe: se queda la ilustración
      slot.onerror = intentar;
      slot.onload = function () { mostrarFoto(slot); };
      slot.src = rutas[i++];
    }
    intentar();
  }

  function applyPhoto() {
    var slotRetrato = $('[data-photo="retrato"]');
    var slotPortada = $('[data-photo="portada"]');

    // Ruta fijada a mano en el config: manda sobre todo lo demás
    var manual = data.pro && data.pro.photo;
    if (manual) {
      $$("[data-photo]").forEach(function (s) {
        s.alt = (data.pro && data.pro.name) ? data.pro.name : "";
        s.onload = function () { mostrarFoto(s); };
        s.src = manual;
      });
      return;
    }

    montarFoto(slotRetrato, ["retrato"]);
    montarFoto(slotPortada, ["portada", "retrato"]);
  }

  /* Redes sociales del pie */
  function mountSocial() {
    var box = $("[data-social]");
    if (!box || box.children.length > 0) return;
    var s = data.social || {};
    var items = [
      { k: "instagram", label: "Instagram" },
      { k: "linkedin",  label: "LinkedIn"  },
      { k: "google",    label: "Google"    }
    ].filter(function (i) { return s[i.k]; });

    if (!items.length) return;
    box.innerHTML = items.map(function (i) {
      return '<li><a href="' + escHTML(s[i.k]) + '" target="_blank" rel="noopener">' +
             escHTML(i.label) + "</a></li>";
    }).join("");
    box.hidden = false;
  }


  /* =========================================================
     2. Cabecera y menú
     ========================================================= */
  function initHeader() {
    var header = $("[data-header]");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initNav() {
    var btn = $(".nav-toggle");
    var nav = $("#nav-principal");
    if (!btn || !nav) return;

    var close = function () {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menú");
    };

    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    // Al pasar a escritorio, el menú móvil no debe quedarse abierto
    matchMedia("(min-width: 960px)").addEventListener("change", close);
  }


  /* =========================================================
     2.5. Reserva de cita con Cal.com
     Al pulsar "Pedir cita" se abre la agenda en una ventana
     emergente, sin sacar al visitante de la web.

     Cómo está montado:
     · El botón es un enlace normal a cal.com. Si el visitante
       tiene JavaScript desactivado, o si Cal.com no responde,
       el enlace sigue funcionando: se abre su página.
     · El motor de Cal.com se carga SOLO al pulsar el botón, nunca
       antes. Mientras el visitante no pida cita, la web no contacta
       con Cal.com ni le deja guardar nada en su navegador. Por eso
       este sitio no necesita aviso de cookies: lo único que se
       carga de terceros lo pide el visitante expresamente
       (art. 22.2 de la LSSI).
     ========================================================= */
  var calState = { asked: false, failed: false };

  function loadCal() {
    if (calState.asked || !calLink()) return;
    calState.asked = true;

    var b = data.booking || {};

    // Cargador oficial de Cal.com. Define window.Cal como una cola:
    // lo que se le pida antes de que el motor termine de cargar se
    // guarda y se ejecuta después.
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          var s = d.createElement("script");
          s.src = A;
          s.async = true;
          s.onerror = function () { calState.failed = true; };
          d.head.appendChild(s);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var ns = ar[1]; api.q = api.q || [];
          if (typeof ns === "string") {
            cal.ns[ns] = cal.ns[ns] || api;
            p(cal.ns[ns], ar);
            p(cal, ["initNamespace", ns]);
          } else { p(cal, ar); }
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    try {
      window.Cal("init", { origin: "https://cal.com" });
      window.Cal("ui", {
        layout: b.layout || "month_view",
        theme: b.theme || "light",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          light: { "cal-brand": b.brandColor || "#C0603C" },
          dark:  { "cal-brand": b.brandColor || "#C0603C" }
        }
      });
    } catch (e) { console.warn("[cal ui]", e); }
  }

  function openCal(url) {
    var link = calLink();
    if (!link) return false;
    if (calState.failed || typeof window.Cal !== "function") return false;
    try {
      window.Cal("modal", {
        calLink: link,
        config: { layout: (data.booking || {}).layout || "month_view" }
      });
    } catch (e) {
      console.warn("[cal modal]", e);
      return false;
    }
    // Si el motor no llega a cargar, abrimos la agenda en una pestaña
    // para que el visitante no se quede mirando un botón que no hace nada.
    setTimeout(function () {
      if (calState.failed && !document.querySelector("cal-modal-box, .cal-modal-box")) {
        window.open(url, "_blank", "noopener");
      }
    }, 4000);
    return true;
  }

  function initBooking() {
    var link = calLink();
    if (!link) return;

    // Si el enlace es solo el usuario ("angelpm") en vez del evento
    // ("angelpm/primera-sesion"), Cal.com enseña su página de perfil:
    // una tarjeta con la foto y otra con la lista de citas posibles.
    // Son dos recuadros separados, no un calendario. Con el enlace del
    // evento concreto se abre directamente el calendario, de una pieza.
    if (link.indexOf("/") === -1) {
      console.info(
        "[cita] El enlace de Cal.com (\"" + link + "\") es el de tu perfil, " +
        "así que la ventana muestra la lista de citas. Para que se abra " +
        "directamente el calendario, escribe en booking.calLink el enlace " +
        "del evento concreto: \"" + link + "/nombre-de-la-cita\"."
      );
    }

    // El motor de Cal.com se carga SOLO cuando el visitante pulsa
    // «Pedir cita». Mientras no lo pulse, la web no contacta con
    // Cal.com ni permite que guarde nada en su navegador: por eso
    // este sitio no necesita aviso de cookies.
    document.addEventListener("click", function (e) {
      var el = e.target.closest('[data-href="booking"]');
      if (!el) return;
      loadCal();
      if (openCal(el.getAttribute("href"))) e.preventDefault();
      // si openCal devuelve false, el enlace normal se encarga
    });
  }


  /* =========================================================
     2.6. Los textos legales, en ventana emergente
     El aviso legal, la privacidad y las cookies siguen siendo
     páginas propias (se editan en un solo sitio y se pueden
     enlazar), pero al pulsarlas desde la web se abren encima,
     sin sacar al visitante de la página.

     Si algo fallara —el navegador es antiguo, la página no se
     puede cargar—, el enlace normal se encarga y se abre la
     página de siempre.
     ========================================================= */
  var legalCache = {};

  function initLegal() {
    var dlg = $("[data-legal-dialog]");
    if (!dlg || typeof dlg.showModal !== "function") return;   // sin soporte: enlaces normales

    var cuerpo = $("[data-legal-body]", dlg);
    var titulo = $("[data-legal-title]", dlg);

    function cerrar() { if (dlg.open) dlg.close(); }

    function abrir(url, texto) {
      titulo.textContent = texto || "Información legal";
      cuerpo.innerHTML = '<p class="legal-dialog-cargando">Cargando…</p>';
      dlg.showModal();
      document.body.classList.add("dialog-abierto");

      var pintar = function (html) {
        cuerpo.innerHTML = html;
        cuerpo.scrollTop = 0;
      };

      if (legalCache[url]) return pintar(legalCache[url]);

      fetch(url, { credentials: "same-origin" })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, "text/html");
          var main = doc.querySelector("main.legal");
          if (!main) throw new Error("sin contenido");
          var h1 = main.querySelector("h1");
          if (h1) titulo.textContent = h1.textContent.trim();
          // fuera la cabecera y el pie de esa página: aquí sobran
          var trozo = main.outerHTML;
          legalCache[url] = trozo;
          pintar(trozo);
          // los datos del config también dentro del popup
          safe(applyBrand, "applyBrand(dialog)");
        })
        .catch(function () {
          cerrar();
          window.location.href = url;   // red de seguridad: la página de siempre
        });
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-legal]");
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;  // abrir en pestaña nueva
      e.preventDefault();
      abrir(a.getAttribute("href"), a.textContent.trim());
    });

    $$("[data-legal-close]", dlg).forEach(function (b) {
      b.addEventListener("click", cerrar);
    });

    // Pulsar fuera del recuadro cierra
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) cerrar();
    });

    // Al cerrar (también con Escape), la página vuelve a poder moverse
    dlg.addEventListener("close", function () {
      document.body.classList.remove("dialog-abierto");
    });
  }


  /* =========================================================
     3. Apariciones al hacer scroll
     Umbral bajo + red de seguridad: si algo fallara, todo se
     muestra igualmente a los 2,5 segundos.
     ========================================================= */
  function initReveals() {
    var items = $$(".reveal");
    if (!items.length) return;

    var showAll = function () {
      items.forEach(function (el) { el.classList.add("is-in"); });
    };

    if (reduced || !("IntersectionObserver" in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });

    items.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 2500);
  }


  /* =========================================================
     4. Parallax suave del retrato (un solo bucle de animación)
     ========================================================= */
  function initParallax() {
    if (reduced || !fineHover) return;
    var targets = $$("[data-parallax]");
    if (!targets.length) return;

    var ticking = false;
    var apply = function () {
      ticking = false;
      if (!window.innerHeight) return;              // pestaña en segundo plano
      targets.forEach(function (el) {
        var f = parseFloat(el.getAttribute("data-parallax")) || 0.06;
        var r = el.getBoundingClientRect();
        var mid = r.top + r.height / 2 - window.innerHeight / 2;
        var y = Math.max(-34, Math.min(34, -mid * f));
        el.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
      });
    };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) onScroll();
    });
  }


  /* =========================================================
     5. Acordeón de preguntas: solo una abierta a la vez
     ========================================================= */
  function initFaq() {
    var items = $$(".faq-item");
    items.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }


  /* =========================================================
     6. Formulario de contacto
     Sin servidor: por defecto abre el correo del visitante con
     el mensaje ya escrito. Si en el config hay "form.action",
     se envía a ese servicio sin salir de la página.
     ========================================================= */
  function initForm() {
    var form = $("[data-form]");
    if (!form) return;
    var status = $("[data-form-status]", form);
    var btn = form.querySelector('button[type="submit"]');
    var cfg = data.form || {};
    var c = data.contact || {};

    var say = function (msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status " + (ok ? "is-ok" : "is-err");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        say("Revisa los campos marcados, por favor.", false);
        return;
      }

      var fd = new FormData(form);
      var nombre  = (fd.get("nombre")  || "").toString().trim();
      var email   = (fd.get("email")   || "").toString().trim();
      var tel     = (fd.get("telefono")|| "").toString().trim();
      var motivo  = (fd.get("motivo")  || "").toString().trim();
      var mensaje = (fd.get("mensaje") || "").toString().trim();

      // A) Servicio de formularios configurado
      if (cfg.action) {
        if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }
        say("Enviando…", true);

        fetch(cfg.action, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" }
        }).then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          say(cfg.successMsg || "Mensaje enviado. Te respondo en menos de 24 horas laborables.", true);
        }).catch(function () {
          say("No se ha podido enviar. Escríbeme directamente a " + (c.email || "") + ".", false);
        }).then(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Enviar mensaje"; }
        });
        return;
      }

      // B) Sin servicio: abrimos el correo con todo escrito
      if (!c.email) {
        say("El correo de contacto aún no está configurado.", false);
        return;
      }

      var cuerpo =
        "Nombre: " + nombre + "\n" +
        "Email: " + email + "\n" +
        (tel ? "Teléfono: " + tel + "\n" : "") +
        "Modalidad: " + motivo + "\n\n" +
        mensaje + "\n";

      var href = "mailto:" + c.email +
                 "?subject=" + encodeURIComponent("Consulta desde la web · " + (nombre || "sin nombre")) +
                 "&body=" + encodeURIComponent(cuerpo);

      window.location.href = href;
      say("Se abrirá tu programa de correo con el mensaje listo para enviar.", true);
    });
  }


  /* =========================================================
     7. Arranque
     ========================================================= */
  function boot() {
    safe(applyBrand,  "applyBrand");
    safe(applyPhoto,  "applyPhoto");
    safe(mountSocial, "mountSocial");
    safe(initHeader,  "initHeader");
    safe(initNav,     "initNav");
    safe(initBooking, "initBooking");
    safe(initLegal,   "initLegal");
    safe(initFaq,     "initFaq");
    safe(initForm,    "initForm");
    safe(initReveals, "initReveals");
    safe(initParallax,"initParallax");

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
