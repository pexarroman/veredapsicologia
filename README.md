# Vereda Psicología

Web de una página para una consulta de psicología, con reserva de cita en
Cal.com y sus tres páginas legales. HTML, CSS y JavaScript sin librerías ni
compilación: se sube tal cual y funciona.

> ### ⚠️ Los datos son ficticios
> Esta web está montada a partir de una **ficha de prueba**. La profesional, la
> dirección, el teléfono, el NIF, los precios y los testimonios son inventados.
> Lo único real es el enlace de Cal.com (`angelpm`) y el de Instagram, que
> venían escritos en la ficha.

---

## Los dos archivos que se tocan

| Archivo | Qué contiene |
|---|---|
| `lib/manifest.js` | **Los datos.** Nombre, profesional, contacto, Cal.com, redes, precios, datos legales |
| `colores.css` | **Los colores.** Seis paletas preparadas; ahora está activa «Verde salvia» |

El resto no hace falta abrirlo salvo para cambiar textos largos.

| Archivo | Qué es |
|---|---|
| `index.html` | La página. Aquí están los textos de todas las secciones |
| `aviso-legal.html` · `politica-privacidad.html` · `politica-cookies.html` | Los tres textos legales |
| `styles.css` | El diseño: medidas, tipografía y composición. Sin un solo color dentro |
| `main.js` | Menú, apariciones, acordeón, formulario y la ventana de Cal.com |
| `.htaccess` | Compresión y caché. Solo lo usan alojamientos tipo Hostinger; en GitHub Pages se ignora |
| `.nojekyll` | Le dice a GitHub Pages que sirva los archivos tal cual |

### Por qué los datos están en dos sitios

Los textos están escritos dentro de `index.html` para que la web se vea completa
aunque el navegador del visitante bloquee los scripts. Al cargar, `main.js` lee
`lib/manifest.js` y sobreescribe los datos de identidad, contacto y precios. Si
cambias uno y quieres que el código fuente quede igual, cámbialo en los dos.

---

## Cambiar los colores

Abre `colores.css`. Hay seis paletas: una activa y cinco comentadas. Para cambiar
de paleta, comenta el bloque activo y descomenta el que quieras. Nada más.

La paleta actual está ajustada a lo que pidió la clienta: el verde de su
logotipo (`#467052`, partiendo del `#4F7A5B` que indicó), un dorado suave de
acento y un fondo blanco roto cálido.

Si quieres tus propios colores, cambia los seis valores del bloque activo. Los
que terminan en `-rgb` son el mismo color en números sueltos: los usa la web para
sombras y transparencias, así que hay que cambiarlos también.

---

## La reserva de citas (Cal.com)

Los botones de «Pedir cita» abren el calendario en una ventana emergente sin
sacar al visitante de la web. El enlace se configura en `lib/manifest.js`, dentro
de `booking.calLink`.

**Pon el enlace del evento, no el del perfil.** Es la diferencia entre ver un
calendario y ver una lista:

| Lo que escribes | Lo que sale en la ventana |
|---|---|
| `"angelpm"` | Tu página de perfil: una tarjeta con la foto y otra con la lista de citas. Dos recuadros sueltos |
| `"angelpm/primera-sesion"` | El calendario de esa cita, directo y en un solo bloque |

El nombre exacto está en Cal.com, en «Event Types»: es lo que va detrás de
`cal.com/tu-usuario/` en cada tipo de cita. Si dejas solo el usuario, la web te
lo recuerda con un aviso en la consola del navegador.

Tres decisiones que están tomadas a propósito:

- El motor de Cal.com **se carga solo cuando el visitante pulsa el botón**, nunca
  antes. Tampoco hay preconexión. Mientras nadie pida cita, la web no contacta
  con Cal.com. Eso es lo que permite no tener aviso de cookies.
- El botón **sigue siendo un enlace normal** a `cal.com`. Si Cal.com no responde
  o el visitante tiene JavaScript desactivado, se abre su página y la reserva se
  hace igual. Nunca queda un botón muerto.
- Si dejas `calLink` vacío, no se carga nada de Cal.com y los botones llevan a la
  sección de contacto.

---

## Lo legal

Los tres textos se abren en una **ventana emergente sobre la propia web**, sin
que el visitante salga de la página. Siguen siendo tres archivos HTML
independientes, y eso es a propósito: se editan en un solo sitio, se pueden
enlazar directamente (para el registro de la AEPD, por ejemplo), Google los
indexa, y si el navegador fuera muy antiguo o fallara el JavaScript, el enlace
abre la página de siempre. Para cambiar un texto, se edita su archivo: la
ventana emergente muestra lo que haya dentro.

Las tres páginas están redactadas para la ley española: aviso legal conforme al
artículo 10 de la LSSI (Ley 34/2002), política de privacidad conforme al RGPD y
a la LOPDGDD, y política de cookies conforme al artículo 22.2 de la LSSI y a la
guía de la AEPD.

Están escritas teniendo en cuenta que es una **consulta sanitaria**, que es lo
que la diferencia de una web cualquiera: datos de salud como categoría especial
del artículo 9 del RGPD, secreto profesional, historia clínica con el plazo de
conservación de la Ley 41/2002, y el aviso de que la web no atiende urgencias.

**Esta web no lleva aviso de cookies, y es correcto que no lo lleve:** no
instala cookies propias, no usa analítica ni publicidad, y lo único de terceros
que se carga lo pide el visitante expresamente al pulsar «Pedir cita».

### Pendiente antes de publicar (importante)

1. **Número de autorización sanitaria.** En `aviso-legal.html` está marcado como
   `[PENDIENTE]`. Una consulta de psicología es un centro sanitario y debe estar
   inscrita en el registro autonómico correspondiente; el número tiene que
   aparecer. Sin él, el aviso legal está incompleto.
2. **Comprobar la denominación del título y del colegio** con el colegio
   profesional, y el número de colegiada.
3. **Contratos con los encargados del tratamiento.** La política de privacidad
   afirma que existen contratos del artículo 28 del RGPD con Cal.com, el
   alojamiento, el correo y la asesoría. Hay que firmarlos o descargarlos de
   cada proveedor.
4. **Registro de actividades de tratamiento.** No va en la web, pero la
   profesional está obligada a tenerlo por el artículo 30 del RGPD.
5. **Alojar las tipografías en el propio servidor.** Ahora se descargan de Google
   Fonts, lo que comunica la IP del visitante a Google en cada visita. No son
   cookies, pero sí una transferencia de datos que conviene evitar. Se soluciona
   descargando las dos familias (Fraunces e Inter), poniéndolas en
   `assets/fuentes/`, declarándolas con `@font-face` en `styles.css` y quitando
   las tres etiquetas de Google del `<head>` de las cuatro páginas HTML. En
   cuanto se haga, hay que quitar también los dos párrafos que hablan de Google
   Fonts en la política de privacidad y en la de cookies.
6. **Revisión por un profesional.** Los textos legales son sólidos y están
   ajustados a la normativa vigente, pero no sustituyen la revisión de un
   abogado o de la asesoría de la clienta, que es quien responde de ellos.

---

## Las fotos

No hay que configurar nada. Basta con dejar el archivo en `assets/img/` con el
nombre correcto y la web lo detecta al cargar:

| Nombre del archivo | Dónde sale |
|---|---|
| `retrato` | La foto de «Quién te acompaña», junto a la biografía |
| `portada` | La foto grande de la portada. Opcional: si no está, se usa `retrato` también ahí |

Valen `.webp`, `.jpg`, `.jpeg` y `.png` — así, tal cual llegue del cliente, sin
convertir nada. Si hay varias con el mismo nombre se usa la `.webp`, que pesa
menos. Si no hay ninguna, se queda la ilustración y todo sigue funcionando.

El nombre tiene que ser exacto y en minúsculas: `retrato.jpg` sí, `Retrato.jpg`
o `retrato-marta.jpg` no. Las fotos, verticales y con la cara en el tercio
superior, porque la parte de abajo se recorta con la forma de arco. En
`assets/img/LEEME.txt` está esto mismo explicado para reenviárselo al cliente.

---

## Lo que falta del cliente

- [ ] La foto: dejarla en `assets/img/` como `retrato` (ver arriba).
- [ ] El logotipo (lo envía en PDF y PNG) para reemplazar la marca provisional.
- [ ] El enlace de su ficha de Google, para `social.google`.
- [ ] El tercer testimonio, cuando tenga el permiso de la paciente.
- [ ] Decidir si el formulario sigue abriendo el correo del visitante o se
      contrata un servicio de envío. Si se contrata, hay que añadirlo como
      encargado del tratamiento en la política de privacidad.

---

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube **el contenido de esta carpeta**, no la carpeta dentro de otra:
   `index.html` tiene que quedar en la raíz.
   - Por la web: **Add file → Upload files**, arrastra todo y **Commit changes**.
   - Por terminal:
     ```bash
     git init
     git add .
     git commit -m "Primera versión de la web"
     git branch -M main
     git remote add origin https://github.com/USUARIO/REPOSITORIO.git
     git push -u origin main
     ```
3. **Settings → Pages** → *Deploy from a branch*, rama `main`, carpeta `/ (root)`.

En macOS, cuatro archivos empiezan por punto y el Finder los oculta: pulsa
`Cmd + Shift + .` para verlos y súbelos también.

---

## Verla en tu ordenador

Doble clic en `index.html`, o desde esta carpeta:

```bash
python -m http.server 8137
```

y abre `http://localhost:8137`.
