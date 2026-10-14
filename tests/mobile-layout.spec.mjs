import { test, expect } from '@playwright/test';

for (const version of ['original', 'svg']) {
  test(`${version}: phone landscape bar hides on scroll and returns on scroll up or tab`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    try {
      await page.goto(`/?lesson=1710&version=${version}`);
      await expect(page.locator('body')).toHaveAttribute('data-state', 'ready');
      await expect(page.locator('html')).toHaveClass(/mobile-layout/);
      await expect(page.locator('.shell-header .checkbutton')).toBeVisible();
      await expect(page.locator('.shell-header .solutionbutton')).toBeVisible();
      const track = await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack);
      const top = () => page.evaluate(() => document.querySelector('.lesson-container').getBoundingClientRect().top + scrollY);
      const lessonTop = await top();
      await page.evaluate(y => window.scrollTo(0, y), lessonTop);
      await expect(page.locator('html')).toHaveClass(/bar-hidden/);
      expect(await page.locator('.shell-header').evaluate(item => item.inert)).toBe(true);
      await expect(page.locator('#bar-tab')).toBeVisible();
      await page.locator('#bar-tab').click();
      await expect(page.locator('html')).not.toHaveClass(/bar-hidden/);
      await page.evaluate(y => window.scrollTo(0, y), lessonTop);
      await page.evaluate(y => window.scrollTo(0, y), lessonTop + 1);
      await page.evaluate(y => window.scrollTo(0, y), lessonTop);
      await page.evaluate(y => window.scrollTo(0, y - 60), lessonTop);
      await expect(page.locator('html')).not.toHaveClass(/bar-hidden/);
      expect(await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack)).toBe(track);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    } finally {
      await context.close();
    }
  });
}

test('phone portrait shows description and an inline rotate card', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  try {
    await page.goto('/');
    await expect(page.locator('body')).toHaveAttribute('data-state', 'ready');
    await expect(page.locator('html')).toHaveClass(/mobile-portrait/);
    await expect(page.locator('#rotate-card')).toBeVisible();
    await expect(page.locator('.shell-brand')).toBeVisible();
    await expect(page.locator('.drwmsg-game-title')).toBeVisible();
    const track = await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack);
    await page.setViewportSize({ width: 844, height: 390 });
    await expect(page.locator('#rotate-card')).toBeHidden();
    expect(await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack)).toBe(track);
  } finally {
    await context.close();
  }
});
