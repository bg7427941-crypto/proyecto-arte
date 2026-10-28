import { test, expect } from '@playwright/test';
import path from 'node:path';

test('la portada y sus recursos locales cargan sin errores', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const failures = [];
  page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:5173') && response.status() >= 400) failures.push(response.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('La ilusión de habitar al margen.');
  await expect(page.locator('.archive-card')).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.archive-card').first().scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.card-image img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => Promise.all(document.getAnimations()
    .filter(animation => animation.effect?.getTiming().iterations !== Infinity)
    .map(animation => animation.finished.catch(() => {}))));
  await page.screenshot({ path: '/tmp/al-margen-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});

test('los momentos del ciclo responden a clic y teclado', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: '01 La calma' }).click();
  await expect(page.locator('#art-title')).toHaveText('La calma tambiénes parte del ciclo.');
  await expect(page.getByRole('tabpanel')).toContainText('La tierra parece inmóvil');
  await page.getByRole('tab', { name: '01 La calma' }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: '02 La memoria' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#art-title')).toContainText('no olvida.');
  await page.getByRole('tab', { name: '02 La memoria' }).press('End');
  await expect(page.getByRole('tab', { name: '03 El retorno' })).toBeFocused();
  await expect(page.locator('#art-title')).toContainText('regresa.');
});

test('se puede pausar, ampliar y activar el sonido con una acción explícita', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Pausar animación' }).click();
  await expect(page.getByRole('button', { name: 'Reanudar animación' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Reanudar animación' }).click();
  await page.getByRole('button', { name: 'Ampliar experiencia' }).click();
  await expect(page.getByRole('button', { name: 'Salir de pantalla completa' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Salir de pantalla completa' }).click();
  await expect(page.getByRole('button', { name: 'Ampliar experiencia' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Activar sonido ambiental' }).click();
  await expect(page.getByRole('button', { name: 'Desactivar sonido ambiental' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Desactivar sonido ambiental' }).click();
  await expect(page.getByRole('button', { name: 'Activar sonido ambiental' })).toHaveAttribute('aria-pressed', 'false');
});

test('el archivo filtra y muestra el contexto, la fecha y los derechos de una fotografía documental', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Memoria', exact: true }).click();
  await expect(page.locator('.archive-card')).toHaveCount(1);
  await page.getByRole('button', { name: /2017: cruzar en medio del agua/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('28 de marzo de 2017');
  await expect(page.getByRole('dialog')).toContainText('Fotografía documental, no imagen generada.');
  await expect(page.getByRole('dialog').getByRole('link', { name: 'CC BY 2.0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/2.0/');
  await expect(page.getByRole('dialog').getByRole('link', { name: /Reportaje fotográfico original/ })).toHaveAttribute('href', 'https://www.flickr.com/photos/ministeriodedefensaperu/33008720133/');
  await expect(page.locator('.detail-media img')).toHaveAttribute('alt', /Personas atraviesan un paso inundado/);
  await expect(page.locator('.detail-sources').getByRole('link')).toHaveCount(3);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Todo 3' }).click();
  await expect(page.locator('.archive-card')).toHaveCount(3);
});

test('las fuentes originales están disponibles como PDF y el diálogo cierra con teclado', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Fuentes y créditos' }).click();
  await expect(page.getByRole('heading', { name: 'Detrás de la pregunta.' })).toBeVisible();
  for (const href of ['/docs/la-ilusion-de-habitar-al-margen.pdf', '/docs/calentamiento-global-y-vulnerabilidad-en-piura.pdf']) {
    const response = await request.get(href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Fuentes y créditos' })).toBeFocused();
});

test('la línea de memoria cambia la reflexión seleccionada', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '1983', exact: true }).click();
  await expect(page.locator('#story-title')).toHaveText('La historia también está en el paisaje.');
  await page.getByRole('button', { name: 'Hoy', exact: true }).click();
  await expect(page.locator('#story-text')).toContainText('El presente es una oportunidad');
});

test('una imagen se guarda, persiste tras recargar y se puede eliminar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Añadir al archivo' }).click();
  await page.getByLabel('Seleccionar imagen o video').setInputFiles(path.resolve('public/images/river-territory.png'));
  await page.getByLabel('Título del fragmento').fill('Registro de prueba <Piura>');
  await page.getByLabel('Lugar', { exact: true }).fill('Catacaos');
  await page.getByLabel('Autoría o fuente').fill('Equipo del proyecto');
  await page.getByLabel('Tema', { exact: true }).selectOption('Memoria');
  await page.getByLabel('Año del registro').fill('2017');
  await expect(page.locator('.upload-preview')).toBeVisible();
  await page.getByRole('button', { name: 'Añadir al archivo', exact: true }).last().click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.archive-card')).toHaveCount(4);
  await page.reload();
  const uploaded = page.getByRole('button', { name: /Registro de prueba <Piura>/ });
  await expect(uploaded).toBeVisible();
  await uploaded.click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Registro de prueba <Piura>' })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Equipo del proyecto');
  await page.getByRole('button', { name: 'Eliminar este archivo de mi navegador' }).click();
  await page.getByRole('button', { name: 'Sí, eliminar' }).click();
  await expect(page.locator('.archive-card')).toHaveCount(3);
  await page.reload();
  await expect(page.locator('.archive-card')).toHaveCount(3);
});

test('se rechazan archivos que no son imágenes o videos', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Añadir al archivo' }).click();
  await page.getByLabel('Seleccionar imagen o video').setInputFiles({ name: 'nota.txt', mimeType: 'text/plain', buffer: Buffer.from('Archivo no compatible') });
  await expect(page.locator('#file-error')).toContainText('Elige una imagen');
  await expect(page.locator('.upload-preview')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.archive-card')).toHaveCount(3);
});

test('se puede añadir y reproducir un video WebM', async ({ page }) => {
  await page.goto('/');
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 100;
    const context = canvas.getContext('2d');
    const stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];
    const done = new Promise(resolve => {
      recorder.ondataavailable = event => chunks.push(event.data);
      recorder.onstop = async () => resolve([...new Uint8Array(await new Blob(chunks).arrayBuffer())]);
    });
    recorder.start();
    const interval = setInterval(() => { context.fillStyle = '#294f49'; context.fillRect(0, 0, 100, 100); }, 70);
    setTimeout(() => { clearInterval(interval); recorder.stop(); stream.getTracks().forEach(track => track.stop()); }, 500);
    return done;
  });
  await page.getByRole('button', { name: 'Añadir al archivo' }).click();
  await page.getByLabel('Seleccionar imagen o video').setInputFiles({ name: 'paisaje.webm', mimeType: 'video/webm', buffer: Buffer.from(bytes) });
  await page.getByLabel('Título del fragmento').fill('Un video del paisaje');
  await page.getByLabel('Lugar', { exact: true }).fill('Piura');
  await page.getByLabel('Autoría o fuente').fill('Archivo de prueba');
  await page.getByRole('button', { name: 'Añadir al archivo', exact: true }).last().click();
  await page.getByRole('button', { name: /Un video del paisaje/ }).click();
  const video = page.locator('.detail-media video');
  await expect(video).toHaveAttribute('controls', '');
  await expect.poll(() => video.evaluate(element => element.readyState)).toBeGreaterThan(0);
  await video.evaluate(element => element.play());
  await expect.poll(() => video.evaluate(element => element.currentTime)).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.detail-media video')).toHaveCount(0);
});

test('el menú y el diseño móvil no desbordan la pantalla', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page.getByRole('link', { name: 'Archivo vivo', exact: true }).click();
  await expect(page.locator('.mobile-menu')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#archive-title')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(document.getAnimations()
    .filter(animation => animation.effect?.getTiming().iterations !== Infinity)
    .map(animation => animation.finished.catch(() => {}))));
  await page.screenshot({ path: '/tmp/al-margen-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('se respeta la preferencia de reducir movimiento', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Reanudar animación' })).toHaveAttribute('aria-pressed', 'true');
});
