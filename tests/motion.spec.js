import { test, expect } from '@playwright/test';

test('el paisaje responde al cursor y el control de pausa congela su movimiento', async ({ page }) => {
  await page.goto('/');
  const artwork = page.locator('.artwork');
  await artwork.scrollIntoViewIfNeeded();
  const bounds = await artwork.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * .85, bounds.y + bounds.height * .3, { steps: 5 });
  await expect.poll(() => artwork.evaluate(element => Math.abs(parseFloat(element.style.getPropertyValue('--pointer-x')) || 0))).toBeGreaterThan(1);
  await page.getByRole('button', { name: 'Pausar animación' }).click();
  await expect(page.locator('.artwork-image')).toHaveCSS('animation-play-state', 'paused');
  const still = await page.locator('#water-canvas').evaluate(canvas => canvas.toDataURL());
  await page.waitForTimeout(150);
  expect(await page.locator('#water-canvas').evaluate(canvas => canvas.toDataURL())).toBe(still);
  await page.getByRole('button', { name: 'Reanudar animación' }).click();
  await expect(page.locator('.artwork-image')).toHaveCSS('animation-play-state', 'running');
  await expect.poll(() => page.locator('#water-canvas').evaluate(canvas => canvas.toDataURL())).not.toBe(still);
});

test('las transiciones del archivo terminan y la lectura progresa al bajar', async ({ page }) => {
  await page.goto('/');
  const initial = await page.locator('.reading-progress').evaluate(element => element.getBoundingClientRect().width);
  await page.getByRole('button', { name: 'Memoria', exact: true }).click();
  const card = page.locator('.archive-card');
  await expect(card).toHaveCount(1);
  await expect(card).toContainText('2017: cruzar en medio del agua');
  await expect.poll(() => card.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  await expect.poll(() => page.locator('.reading-progress').evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(initial + 10);
  await card.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect.poll(() => page.getByRole('dialog').evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  await expect(page.locator('.detail-media img')).toHaveCSS('filter', 'none');
  await page.keyboard.press('Escape');
  await expect(card).toBeFocused();
});

test('reducir movimiento detiene los efectos nuevos y mantiene todo el contenido legible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Reanudar animación' })).toBeVisible();
  await expect(page.locator('.artwork-image')).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Hoy', exact: true }).click();
  await expect(page.locator('#story-title')).toHaveText('La prevención empieza antes del retorno.');
  await expect(page.locator('.timeline-story')).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'Memoria', exact: true }).click();
  await expect(page.locator('.archive-card')).toHaveCSS('opacity', '1');
  expect(await page.locator('.archive-card').evaluate(element => element.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('.artwork').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Pausar animación' })).toBeVisible();
  await expect(page.locator('.artwork-image')).toHaveCSS('animation-name', 'landscape-drift');
});

test('entre memoria y calma el paisaje se transforma y la vista anterior sale mientras entra la nueva', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: '02 La memoria' }).click();
  const land = page.locator('.artwork-land');
  await expect.poll(() => land.evaluate(element => Number(getComputedStyle(element).opacity))).toBeCloseTo(.48, 2);
  const indicatorBefore = await page.locator('.cycle-indicator').evaluate(element => element.getBoundingClientRect().x);
  await page.getByRole('tab', { name: '01 La calma' }).evaluate(element => element.click());
  await expect(page.locator('.stage-copy .transition-leaving')).toContainText('Lo que el territorio');
  await expect(page.locator('#art-title')).toContainText('La calma también');
  await page.waitForTimeout(650);
  const intermediate = await land.evaluate(element => Number(getComputedStyle(element).opacity));
  expect(intermediate).toBeGreaterThan(.5);
  expect(intermediate).toBeLessThan(.97);
  await page.getByRole('tab', { name: '01 La calma' }).evaluate(element => element.click());
  expect(await land.evaluate(element => Number(getComputedStyle(element).opacity))).toBeCloseTo(intermediate, 1);
  expect(await page.locator('.cycle-indicator').evaluate(element => element.getBoundingClientRect().x)).toBeLessThan(indicatorBefore);
  await expect.poll(() => land.evaluate(element => Number(getComputedStyle(element).opacity))).toBeCloseTo(.98, 2);
  await expect(page.locator('.stage-copy .transition-leaving')).toHaveCount(0);
  await expect(page.locator('.stage-copy > .transition-current')).toHaveCSS('opacity', '1');
});

test('el marcador de año recorre la línea y los cambios rápidos conservan solamente la última vista', async ({ page }) => {
  await page.goto('/');
  await page.locator('.timeline').scrollIntoViewIfNeeded();
  const marker = page.locator('.timeline-marker');
  const start = await marker.evaluate(element => element.getBoundingClientRect().x);
  await page.getByRole('button', { name: '1983', exact: true }).evaluate(element => element.click());
  await expect(page.locator('.timeline-story .transition-leaving')).toContainText('El agua ocupa');
  await page.waitForTimeout(300);
  const intermediate = await marker.evaluate(element => element.getBoundingClientRect().x);
  expect(intermediate).toBeLessThan(start - 1);
  const end = await page.getByRole('button', { name: '1983', exact: true }).evaluate(element => { const rect = element.getBoundingClientRect(); return rect.x + rect.width / 2 - 7; });
  expect(intermediate).toBeGreaterThan(end + 1);
  await page.evaluate(() => {
    document.querySelector('[data-year="1998"]').click();
    document.querySelector('[data-year="2017"]').click();
    document.querySelector('[data-year="Hoy"]').click();
  });
  await expect(page.locator('#story-title')).toHaveText('La prevención empieza antes del retorno.');
  await expect(page.locator('.timeline-story .transition-leaving')).toHaveCount(0);
  await expect(page.locator('.timeline-story > .transition-current')).toHaveCSS('opacity', '1');
  await expect.poll(() => page.locator('.timeline-story').evaluate(element => element.style.height)).toBe('');
  expect(await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(element => element.id); return ids.length === new Set(ids).size; })).toBe(true);
});

test('pausar o reducir movimiento durante una transición deja el estado final legible', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: '01 La calma' }).click();
  await page.getByRole('button', { name: 'Pausar animación' }).click();
  await expect(page.locator('.stage-copy .transition-leaving')).toHaveCount(0);
  await expect(page.locator('.stage-copy > .transition-current')).toHaveCSS('opacity', '1');
  await expect(page.locator('.artwork-land')).toHaveCSS('opacity', '0.98');
  await page.getByRole('button', { name: 'Reanudar animación' }).click();
  await page.getByRole('button', { name: 'Hoy', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.timeline-story .transition-leaving')).toHaveCount(0);
  await expect(page.locator('.timeline-story > .transition-current')).toHaveCSS('opacity', '1');
  await expect(page.locator('#story-title')).toHaveText('La prevención empieza antes del retorno.');
});

test('un dispositivo con movimiento reducido solo activa las transiciones si la persona pulsa reproducir', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.motion-notice')).toBeVisible();
  await expect(page.locator('.artwork-image')).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Reanudar animación' }).click();
  await expect(page.locator('.motion-notice')).not.toBeVisible();
  await expect(page.locator('.artwork-image')).toHaveCSS('animation-name', 'landscape-drift');
  await page.getByRole('tab', { name: '01 La calma' }).evaluate(element => element.click());
  await expect(page.locator('.stage-copy .transition-leaving')).toContainText('El agua siempre');
  await page.getByRole('button', { name: 'Pausar animación' }).click();
  await expect(page.locator('.stage-copy .transition-leaving')).toHaveCount(0);
  await expect(page.locator('.motion-notice')).toBeVisible();
  await expect(page.locator('.artwork-image')).toHaveCSS('animation-name', 'none');
});
