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
