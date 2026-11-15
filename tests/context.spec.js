import { test, expect } from '@playwright/test';

test('el filtro combina episodio y tema y distingue las fichas de las fotografías', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Episodio', exact: true }).selectOption('1998');
  await page.getByRole('button', { name: 'Prevención', exact: true }).click();
  await expect(page.locator('.empty-state')).toContainText('No hay registros para esta combinación');
  await page.getByRole('button', { name: 'Territorio', exact: true }).click();
  await expect(page.locator('.archive-card')).toHaveCount(1);
  await page.getByRole('button', { name: /1998: la ausencia de un puente/ }).click();
  await expect(page.getByRole('dialog')).toContainText('fecha de toma no indicada');
  await expect(page.getByRole('dialog')).toContainText('2006 es la fecha de subida');
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Dominio público', exact: true })).toHaveAttribute('href', /#Licensing$/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /^Todo/ }).click();
  await page.getByRole('combobox', { name: 'Episodio', exact: true }).selectOption('2023');
  await expect(page.locator('.archive-card')).toHaveCount(1);
  await expect(page.locator('#archive-result')).toContainText('1 de 5 registros');
  await page.getByRole('button', { name: /2023: Tumbes vuelve/ }).click();
  await expect(page.getByRole('dialog')).toContainText('10 de marzo de 2023');
  await expect(page.getByRole('dialog')).toContainText('Yaku y El Niño son fenómenos distintos');
  await expect(page.locator('.detail-media img')).toHaveAttribute('src', '/images/documental/tumbes-lluvias-2023.jpg');
});

test('la portada ofrece tres casos de años distintos con fotografía con imagen y abre su ficha', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.case-card');
  await expect(cards).toHaveCount(3);
  const years = await page.locator('.case-year').allTextContents();
  expect(new Set(years).size).toBe(years.length);
  for (const image of await page.locator('.case-card img').all()) await image.scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.case-card img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  await cards.nth(0).click();
  await expect(page.getByRole('dialog')).toContainText('10 de marzo de 2023');
});

test('la sección de memoria usa la frase del documento y ya no tiene línea de tiempo', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#memory-title')).toContainText('sino que hayamos olvidado que siempre formó parte del lugar que habitamos');
  await expect(page.locator('.timeline')).toHaveCount(0);
  await expect(page.locator('#project-title')).toContainText('separados de los ciclos de la naturaleza');
});