import { test, expect } from '@playwright/test';

for (const version of ['original', 'svg']) {
  test(`${version}: half-screen scrolling toggles the mobile control layer`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    try {
      await page.goto(`/?lesson=1710&version=${version}`);
      await expect(page.locator('body')).toHaveAttribute('data-state', 'ready');
      await expect(page.locator('html')).toHaveClass(/mobile-scroll/);
      await expect(page.locator('#scroll-indicator')).toBeVisible();
      const track = await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack);
      const threshold = await page.evaluate(() => innerHeight / 2);
      await page.evaluate(top => window.scrollTo(0, top), threshold - 20);
      await expect.poll(() => page.evaluate(top => Math.abs(scrollY - top), threshold - 20)).toBeLessThan(1);
      await expect(page.locator('html')).not.toHaveClass(/controls-hidden/);
      await page.evaluate(top => window.scrollTo(0, top), threshold + 10);
      await expect(page.locator('html')).toHaveClass(/controls-hidden/);
      await expect(page.locator('#controls')).toBeHidden();
      expect(await page.locator('#controls').evaluate(item => item.inert)).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 30));
      await expect.poll(() => page.evaluate(() => Math.abs(scrollY - 30))).toBeLessThan(1);
      await expect(page.locator('html')).toHaveClass(/controls-hidden/);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('html')).not.toHaveClass(/controls-hidden/);
      await expect(page.locator('#controls')).toBeVisible();
      await page.locator('#fullscreen').click();
      await expect(page.locator('html')).toHaveClass(/controls-hidden/);
      expect(await page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('html')).not.toHaveClass(/controls-hidden/);
      expect(await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack)).toBe(track);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(page.locator('#rotate-prompt')).toBeVisible();
      await expect(page.locator('html')).not.toHaveClass(/mobile-scroll/);
    } finally {
      await context.close();
    }
  });
}