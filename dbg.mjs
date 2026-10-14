import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
await page.goto('http://localhost:3000/?lesson=1710');
await page.waitForSelector('body[data-state=ready]');
console.log(await page.evaluate(() => [document.getElementById('controls').getBoundingClientRect().height, document.querySelectorAll('.shell-header .drwmsg-navigation').length]));
await page.screenshot({ path: 'test-results/dbg-0.png' });
await browser.close();
