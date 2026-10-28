import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('la página y la carga de medios cumplen las comprobaciones automáticas WCAG AA', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const settle = () => page.evaluate(() => Promise.all(document.getAnimations()
    .filter(animation => animation.effect?.getTiming().iterations !== Infinity)
    .map(animation => animation.finished.catch(() => {}))));
  await settle();
  const scan = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const summarize = result => result.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, reason: node.failureSummary })) }));
  expect(summarize(await scan())).toEqual([]);
  await page.getByRole('button', { name: 'Añadir al archivo' }).click();
  await settle();
  expect(summarize(await scan())).toEqual([]);
});
