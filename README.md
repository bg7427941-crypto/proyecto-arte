# Al margen

Página interactiva del proyecto **«La ilusión de habitar al margen»**, sobre El Niño, el agua y la memoria del territorio en Piura. Elaborada a partir de los dos documentos del equipo de Arte y Tecnología de UTEC.

## Desarrollo

Node.js **22.12 o superior** (verificado con 24.19) y npm.

```sh
cd /workspace/proyecto-arte
npm ci
npm run dev
```

Vite sirve la página en el puerto 5173. No requiere claves, servicios externos ni variables de entorno. Tipografías, imágenes, documentos y audio sintetizado funcionan localmente.

```sh
npm run build     # Genera dist/, listo para alojamiento estático
npm run preview   # Sirve la compilación en el puerto 4173
npm test          # Pruebas de navegador con Playwright
```

Las pruebas usan Chromium del sistema cuando está disponible en `/usr/bin/chromium`. En otra máquina, ejecuta `npx playwright install chromium` o indica el ejecutable con `CHROMIUM_PATH`. Las capturas se guardan en `/tmp/al-margen-desktop.png` y `/tmp/al-margen-mobile.png`.

## Qué incluye

- Paisaje con partículas, ondas y desplazamiento suave que responden al cursor, iluminación en movimiento y tres etapas: calma, memoria y retorno.
- Entrada progresiva de secciones y tarjetas al desplazarse, indicador de avance de lectura y transiciones en la línea de memoria, filtros y fotografías.
- Pausa del movimiento decorativo de la página, pantalla completa, sonido ambiental opcional y respeto a la preferencia de movimiento reducido. Las animaciones del paisaje se suspenden cuando sale de la pantalla; los efectos se detienen al ocultar la pestaña.
- Archivo filtrable con tres fotografías documentales de Piura en marzo de 2017, contexto de los casos y fuentes.
- Carga de imágenes y videos con título, ubicación, año, tema y autoría; vista previa y eliminación con confirmación.
- Línea de memoria de 1983, 1998, 2017 y una reflexión sobre el presente.
- Documentos PDF originales, créditos, navegación por teclado y diseño adaptable.

## Añadir material

Desde **«Añadir al archivo»** se pueden incorporar imágenes JPG, PNG, WebP, GIF y AVIF, o videos MP4 y WebM, de hasta 50 MB. La compatibilidad de cada video depende de su códec y del navegador. Incluye la autoría y utiliza solo material que tengas permiso de compartir.

Los archivos se conservan en **IndexedDB, únicamente en el navegador que los añade**. Persisten al recargar, pero no se suben a un servidor ni se comparten entre integrantes. Eliminar los datos del sitio elimina esta colección local. El almacenamiento puede estar limitado o no disponible en navegación privada. Para un archivo colaborativo se necesitarían almacenamiento remoto, autenticación y un flujo de publicación.

Para incorporar una entrada permanente para todo el equipo, añade su recurso autorizado en `public/images/` y sus datos en `src/documentary.js`. Identifica los registros documentales con su autoría, fecha, lugar y licencia; mantén diferenciada la interpretación artística de portada.

## Contenido y procedencia

Los dos PDF originales se encuentran en `public/docs/`. La página sintetiza el planteamiento del proyecto y conserva sus referencias. No incorpora como datos comprobados las cifras periodísticas de 2026 que no se verificaron independientemente.

La portada usa `river-delta.png`, una imagen artística generada con IA: **no es un registro documental de Piura ni una simulación climática**. El audio es sintetizado y solo se activa tras una acción del visitante.

El Archivo vivo contiene tres fotografías reales de Piura de marzo de 2017, tomadas de los reportajes fotográficos de la **Galería del Ministerio de Defensa del Perú**, a través de Wikimedia Commons, con licencia **[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)**. Cada tarjeta muestra el crédito; su vista ampliada incluye fecha de la toma, imagen completa, autoría, licencia y enlaces al reportaje original y a noticias de contexto de BBC News o RPP / Mongabay. Las noticias aportan contexto: no se atribuyen las fotografías a esos medios.

Las fotografías se sirven localmente desde `public/images/documental/`, sin retoques ni filtros de color. Las miniaturas adaptan el encuadre con CSS; el diálogo conserva la fotografía completa. `public/images/documental/credits.json` registra para cada archivo el título original, fecha, autor, fuentes, versión descargada, licencia y suma SHA-256. Los archivos artísticos de la primera versión se conservan para el desarrollo y las pruebas; no se presentan como fotografías documentales.

La referencia proporcionada fue [Unsupervised, de Refik Anadol](https://refikanadol.com/works/unsupervised/). La política de red impidió consultar esa página en este entorno. El diseño es una interpretación independiente de una experiencia de arte inmersivo; no utiliza imágenes ni código de esa obra.

## Estructura

- `src/main.js`: página, navegación y línea de memoria.
- `src/artwork.js`: animación, sonido y controles de la experiencia.
- `src/motion.js` y `src/motion.css`: transiciones, entradas al desplazarse, avance de lectura y control del movimiento. Usan las APIs del navegador, sin dependencias adicionales; el contenido permanece legible si se cancelan los efectos.
- `src/archive.js`: archivo, persistencia local, carga de medios, fuentes y diálogos.
- `src/documentary.js`: fotografías documentales, contexto, autoría, fechas, licencias y enlaces al reportaje original.
- `src/style.css`: diseño visual y adaptación a móvil.
- `tests/experience.spec.js`: comprobación de los flujos principales.

No hace falta crear otro checkout o un worktree para trabajar: utiliza este repositorio existente.

## Desplegar en Vercel

`vercel.json` configura Vite, `npm ci`, `npm run build` y la salida `dist`. `.vercelignore` excluye dependencias locales, pruebas y resultados de pruebas de la subida. No hay rutas de aplicación que requieran reescrituras.

Con una sesión de Vercel iniciada en tu máquina:

```sh
npx vercel@65.5.0 --prod --yes
```

Producción: **https://proyecto-arte.vercel.app**. La versión con fotografías documentales se publicó en la cuenta autorizada de Vercel, en el proyecto `proyecto-arte`. La carpeta `.vercel/` contiene el enlace local al proyecto y está excluida de Git. Esta URL de producción reemplaza al enlace temporal de la primera versión.

En este entorno, conserva los selectores de los directorios escribibles usados durante la autorización de la CLI:

```sh
XDG_CACHE_HOME=/tmp/al-margen-vercel/cache \
XDG_DATA_HOME=/tmp/al-margen-vercel/data \
XDG_CONFIG_HOME=/tmp/al-margen-vercel/config \
NPM_CONFIG_CACHE=/tmp/proyecto-npm-cache \
VERCEL_TELEMETRY_DISABLED=1 \
npm exec --yes --package vercel@65.5.0 -- vercel deploy --prod --yes
```

La autorización de la CLI se completó mediante el flujo de dispositivo de Vercel. No se han añadido credenciales al código ni al repositorio. Si la sesión ya no está disponible en un entorno nuevo, ejecuta `vercel login` con los mismos selectores de directorios y completa la autorización. La red debe permitir los destinos de Vercel y el dominio de producción resultante.

El proyecto de Vercel está conectado al repositorio de GitHub. Guarda los cambios en Git y súbelos a `main` para que los siguientes despliegues desde GitHub utilicen la versión actualizada.

La compilación y las 15 pruebas de navegador pasaron, incluidas pausa, respuesta al cursor, movimiento reducido, transiciones y accesibilidad automática. El archivo de medios sigue siendo local a cada navegador incluso después de publicar la página.
