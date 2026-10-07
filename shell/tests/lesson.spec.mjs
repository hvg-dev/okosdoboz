import { test, expect } from '@playwright/test';

test('same-document feladat, reszponzív kezelősáv és assetek', async ({ page }) => {
  const errors = [];
  const failed = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().includes('/lessons/')) failed.push(response.url()); });
  await page.goto('/?lesson=1710');
  await expect(page.locator('body')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('#odPlayer')).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(await page.evaluate(() => String(window.drwmsg.carco.paramsdata.system.currentgame))).toBe('1710');
  expect(await page.evaluate(() => window.jQuery.fn.jquery)).toBe('2.0.3');
  for (const width of [320, 390, 750, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.checkbutton')).toBeVisible();
    await expect(page.locator('.solutionbutton')).toBeVisible();
    await expect.poll(() => page.evaluate(() => {
      const root = window.drwmsg;
      const player = root.carco.playeritems.player.getBoundingClientRect();
      const game = root.parentElement.getBoundingClientRect();
      return game.bottom <= player.bottom + 2;
    })).toBe(true);
  }
  const track = await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack);
  await page.locator('.lesson-container').evaluate(item => { item.style.width = '460px'; });
  await expect.poll(() => page.evaluate(() => Math.round(window.drwmsg.parentElement.offsetWidth))).toBeLessThanOrEqual(460);
  expect(await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack)).toBe(track);
  await page.locator('.lesson-container').evaluate(item => { item.style.width = ''; });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByText('Info', { exact: true }).click();
  await expect.poll(() => page.evaluate(() => getComputedStyle(window.drwmsg.carco.playeritems.infoscreen).display)).not.toBe('none');
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
});

test('választás, ellenőrzés, megoldás és pályaváltás', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-state', 'ready');
  const track = await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack);
  const count = await page.evaluate(() => [...document.querySelectorAll('#odPlayer div')].filter(item => item.carco?.customparams?.gametype === 'random_mix_sort_cont' && getComputedStyle(item).visibility === 'visible').length);
  for (let index = 0; index < count; index++) {
    const button = await page.evaluate(index => {
      const groups = [...document.querySelectorAll('#odPlayer div')].filter(item => item.carco?.customparams?.gametype === 'random_mix_sort_cont' && getComputedStyle(item).visibility === 'visible');
      const item = [...groups[index].querySelectorAll('div')].find(item => item.carco?.customparams?.gametype === 'button' && item.textContent === '' && item.offsetWidth > 70);
      return item.getBoundingClientRect().toJSON();
    }, index);
    await page.mouse.click(button.x + button.width / 2, button.y + button.height / 2);
    const option = await page.evaluate(index => {
      const groups = [...document.querySelectorAll('#odPlayer div')].filter(item => item.carco?.customparams?.gametype === 'random_mix_sort_cont' && getComputedStyle(item).visibility === 'visible');
      const item = [...groups[index].querySelectorAll('div')].find(item => item.carco?.customparams?.gametype === 'button' && item.textContent.length > 0);
      return item.getBoundingClientRect().toJSON();
    }, index);
    await page.mouse.click(option.x + option.width / 2, option.y + option.height / 2);
  }
  await expect(page.locator('.checkbutton')).not.toHaveClass(/drwmsg-nav_ul_disable/);
  await page.locator('.checkbutton').click();
  await expect(page.locator('.solutionbutton')).not.toHaveClass(/drwmsg-nav_ul_disable/);
  await expect.poll(() => page.evaluate(() => window.drwmsg.carco.playeritems.preload_layer.style.display)).toBe('none');
  await page.locator('.solutionbutton').click();
  await expect.poll(() => page.evaluate(() => window.drwmsg.carco.playeritems.preload_layer.style.display)).toBe('none');
  await expect(page.locator('.nextbutton:visible, .restartbutton:visible')).toBeVisible();
  await page.locator('.nextbutton:visible, .restartbutton:visible').click();
  await expect.poll(() => page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack)).not.toBe(track);
  await expect.poll(() => page.evaluate(() => window.drwmsg.carco.playeritems.preload_layer.style.display)).toBe('none');
});

test('mobilos képernyő és resize stabilitás', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-state', 'ready');
  await page.waitForTimeout(2000);
  const mutations = await page.evaluate(async () => {
    let count = 0;
    const observer = new MutationObserver(records => { count += records.length; });
    observer.observe(document.getElementById('odPlayer'), { attributes: true, subtree: true });
    await new Promise(resolve => setTimeout(resolve, 1800));
    observer.disconnect();
    return count;
  });
  expect(mutations).toBeLessThan(100);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});

test('hibás query nem indít motort, hiányzó asset valódi 404', async ({ page, request }) => {
  await page.goto('/?lesson=999');
  await expect(page.locator('body')).toHaveAttribute('data-state', 'error');
  await expect(page.getByText('Ismeretlen feladat.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => Boolean(window.carco))).toBe(false);
  await page.goto('/?lesson=1710&id=999');
  await expect(page.locator('body')).toHaveAttribute('data-state', 'error');
  const config = await (await request.get('/shell-config.json')).json();
  expect((await request.get(config.lessonsPrefix + '1710/tracksjs/not-found.js')).status()).toBe(404);
});