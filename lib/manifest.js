/* =============================================================
   DATOS DE LA WEB  ·  lib/manifest.js
   -------------------------------------------------------------
   Rellenado a partir de la ficha de Vereda Psicología.

   ⚠️  DATOS FICTICIOS salvo el enlace de Cal.com y el de Instagram,
       que son los que venían escritos en la ficha. La profesional,
       la dirección, el teléfono, el NIF y los testimonios son
       inventados: es una prueba, no un cliente real.

   Este es el único archivo que hay que tocar para cambiar los
   datos del gabinete. Los colores están en colores.css.

   Cómo funciona: index.html ya trae estos mismos textos escritos
   dentro, para que la web se vea completa aunque el navegador
   bloquee los scripts. Al cargar, main.js lee este archivo y
   sobreescribe esos huecos. Si cambias algo aquí y quieres que el
   código fuente quede igual, cámbialo también en index.html.
   ============================================================= */

(function () {
  "use strict";

  window.__BRAND__ = {
    /* ---------------------------------------------------------
       1. IDENTIDAD
       --------------------------------------------------------- */
    name: "Vereda",
    nameFull: "Vereda · Psicología",
    tagline: "Volver a habitarte",
    city: "Valencia",

    /* ---------------------------------------------------------
       2. LA PROFESIONAL
       --------------------------------------------------------- */
    pro: {
      name: "Marta Iriarte Coll",
      role: "Psicóloga General Sanitaria",
      license: "Nº Col. CV-00000",
      years: "9",

      // ⚠️ NO HACE FALTA TOCAR ESTO.
      // Las fotos se detectan solas: basta con dejarlas en la carpeta
      // assets/img/ con el nombre "retrato" (la de la biografía) y, si
      // quieres una distinta arriba, "portada". Valen .webp, .jpg, .jpeg
      // y .png. Lee assets/img/LEEME.txt.
      // Este campo solo sirve para forzar otra ruta a mano; si lo rellenas,
      // esa foto se usa en los dos sitios.
      photo: ""
    },

    /* ---------------------------------------------------------
       3. CONTACTO
       --------------------------------------------------------- */
    contact: {
      phone: "600 11 22 33",
      phoneRaw: "+34600112233",
      whatsapp: "34600112233",
      email: "hola@veredapsicologia.es",
      street: "Calle Sorní, 00 · 2ª puerta",
      zipCity: "46004 Valencia",
      metro: "Metro Colón (L3 y L5), a 5 min. Parking Porta de la Mar enfrente.",
      mapsUrl: "https://maps.google.com/?q=Calle+Sorn%C3%AD+Valencia",
      hours: "Lunes a jueves de 10:00 a 20:30 · Viernes de 10:00 a 14:00"
    },

    /* ---------------------------------------------------------
       3.b RESERVA DE CITA · Cal.com
       Al pulsar «Pedir cita» se abre este calendario en una
       ventana emergente, sin salir de la web.
       --------------------------------------------------------- */
    booking: {
      // ⚠️ IMPORTANTE: pon aquí el enlace DEL EVENTO, no el del perfil.
      //
      //   "angelpm"                     → abre tu página de perfil: sale una
      //                                   tarjeta con tu foto y otra con la
      //                                   lista de citas. Dos recuadros sueltos.
      //   "angelpm/primera-sesion"      → abre directamente el calendario de
      //                                   esa cita, en un solo bloque. ESTO.
      //
      // El nombre exacto lo ves en Cal.com, en «Event Types»: es lo que
      // aparece detrás de cal.com/tu-usuario/ en cada tipo de cita.
      calLink: "angelpm",                            // tal y como venía en la ficha
      layout: "month_view",                          // "month_view" · "week_view" · "column_view"
      theme: "light",
      brandColor: "#467052"                          // el verde de la web, dentro del calendario
    },

    /* ---------------------------------------------------------
       4. REDES  (vacías = no aparecen)
       --------------------------------------------------------- */
    social: {
      instagram: "https://instagram.com/angelpecharorman",
      linkedin: "",
      google: ""                                     // pendiente: la clienta envía el enlace de
                                                     // su ficha de Google (14 reseñas)
    },

    /* ---------------------------------------------------------
       5. TARIFAS
       --------------------------------------------------------- */
    prices: {
      individual: "65 €",
      couple: "85 €",
      online: "60 €",
      duration: "50 minutos",
      first: "Primera sesión de valoración: 40 €"
    },

    /* ---------------------------------------------------------
       6. DATOS LEGALES  (los usa el pie y las páginas legales)
       --------------------------------------------------------- */
    legal: {
      holder: "Marta Iriarte Coll",
      nif: "00000000X",
      email: "administracion@veredapsicologia.es"
    },

    /* ---------------------------------------------------------
       7. FORMULARIO
       Sin servidor: abre el correo del visitante con el mensaje
       ya escrito. Si contratas un servicio de formularios
       (Formspree, Getform…), pega aquí su dirección.
       ⚠️ Si lo haces, ese servicio pasa a ser un encargado del
       tratamiento y hay que nombrarlo en la política de
       privacidad.
       --------------------------------------------------------- */
    form: {
      action: "",
      successMsg: "Mensaje enviado. Te respondo en menos de 24 horas laborables."
    }
  };
})();
