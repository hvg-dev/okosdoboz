import { test, expect } from '@playwright/test';

const promptsByTrack = {
  1: ['Most nem hallom, mert', 'Most meg fog szakadni, mert.', 'Most nem tudunk beszélni, mert', 'Most leteszem, mert'],
  2: ['Az én koromban:', 'Az én koromban:', 'Az én koromban:', 'Az én koromban:'],
  3: ['Neve:', 'Neve:', 'Neve:', 'Neve:'],
  4: ['Az én királyságomban', 'Az én királyságomban', 'Az én királyságomban', 'Az én királyságomban'],
  5: ['Van aki', 'Van aki', 'Van aki', 'Van aki'],
  6: ['A szerelmes nő', 'A szerelmes nő', 'A szerelmes nő', 'A szerelmes nő']
};
const imagesByTrack = {
  1: '48be45391e62992eb92fdd71dd5b42a3.png',
  2: '31cf114cb4f3de2e58a6f5ede0856ad6.png',
  3: '9707af5586524aabf5572f278a798e1b.png',
  4: '56a21850f7b016b68fe3999f7d068268.png',
  5: '939c522c20cc72326915bf86f03b9dc6.png',
  6: 'c102baa3550d1d9f00b9d3d389a87e3d.png'
};

test('mind a hat pálya hibrid SVG-összehasonlítója a megfelelő promptot mutatja', async ({ page }) => {
  const failed = [];
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
  for (const width of [390, 844, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [trackNumber, prompts] of Object.entries(promptsByTrack)) {
      await page.goto(`/experiments/1710-track-1/?track=${trackNumber}`);
      const original = page.locator('#original');
      const hybrid = page.locator('#hybrid');
      await expect(original).toHaveJSProperty('naturalWidth', 3150);
      await expect(original).toHaveAttribute('src', new RegExp(imagesByTrack[trackNumber].replaceAll('.', '\\.')));
      await expect(hybrid.locator('text[data-layer="native-svg-text"]')).toHaveText(prompts);
      await expect(hybrid.locator('image[data-layer="raster-illustration"]')).toHaveCount(1);
      await expect(hybrid.locator('image[data-layer="raster-text-mask"]')).toHaveCount(4);
      const dimensions = await page.evaluate(() => ({
        original: document.querySelector('#original').getBoundingClientRect(),
        hybrid: document.querySelector('#hybrid').getBoundingClientRect(),
        viewBox: document.querySelector('#hybrid').viewBox.baseVal
      }));
      expect(Math.abs(dimensions.original.width - dimensions.hybrid.width)).toBeLessThan(1);
      expect(dimensions.viewBox.width).toBe(3150);
    }
  }
  expect(failed).toEqual([]);
});

test('a legacy motor minden 1710 pályaváltáskor a hozzá tartozó SVG-t mutatja', async ({ page }) => {
  const failed = [];
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?lesson=1710&version=svg#svg-poc-1710-1');
  for (const [trackNumber, prompts] of Object.entries(promptsByTrack)) {
    const trackId = `1710_${trackNumber}`;
    await expect.poll(() => page.locator('body').getAttribute('data-svg-poc')).toBe(trackId);
    const state = await page.evaluate(async () => {
      const root = window.drwmsg.carco;
      const item = Object.values(root.recursivechildren).find(child => child.dataset.svgPoc === root.paramsdata.system.currenttrack);
      const svgMarkup = await fetch(item.carco.svgPocObjectUrl).then(response => response.text());
      const svg = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
      return {
        track: root.paramsdata.system.currenttrack,
        itemId: item?.carco.id,
        imageName: item?.carco.customparams.image.newname,
        background: item?.style.backgroundImage,
        prompts: [...svg.querySelectorAll('text')].map(text => text.textContent),
        embeddedRaster: svgMarkup.includes('data:image/png;base64,'),
        selectorCount: Object.values(root.recursivechildren).filter(child => child.carco?.customparams?.selectbox).length
      };
    });
    expect(state.track).toBe(trackId);
    expect(state.itemId).toBe('id104');
    expect(state.imageName).toBe(imagesByTrack[trackNumber]);
    expect(state.background).toContain('blob:');
    expect(state.embeddedRaster).toBe(true);
    expect(state.prompts).toEqual(prompts);
    expect(state.selectorCount).toBe(4);

    if (trackNumber === '1') {
      const toggle = await page.locator('[data-svg-poc-choice-toggle="1710_1"]').boundingBox();
      await page.mouse.click(toggle.x + toggle.width / 2, toggle.y + toggle.height / 2);
      await expect.poll(() => page.evaluate(() => {
        const selectbox = Object.values(window.drwmsg.carco.recursivechildren).find(child => child.carco?.customparams?.selectbox);
        return selectbox.children[0].style.visibility;
      })).toBe('visible');
      await page.mouse.click(toggle.x + toggle.width / 2, toggle.y + toggle.height / 2);
    }
    if (trackNumber !== '6') {
      await page.evaluate(() => window.drwmsg.carco.nextfunction());
    }
  }
  await page.evaluate(() => window.drwmsg.carco.nextfunction());
  await expect(page.locator('.drwmsg-endscreen.drwmsg-endtrans')).toBeVisible();
  expect(failed).toEqual([]);
});

test('a 1710 SVG-réteget normál betöltéskor is aktiválja', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?lesson=1710');
  await expect.poll(() => page.locator('body').getAttribute('data-svg-poc')).toMatch(/^1710_[1-6]$/);
  const state = await page.evaluate(async () => {
    const root = window.drwmsg.carco;
    const track = root.paramsdata.system.currenttrack;
    const item = [...document.querySelectorAll('canvas')].find(child => child.dataset.svgPoc === track);
    const markup = await fetch(item.carco.svgPocObjectUrl).then(response => response.text());
    return {
      track,
      image: item.carco.customparams.image.newname,
      background: item.style.backgroundImage,
      svgTextCount: (markup.match(/<text\b/g) || []).length
    };
  });
  expect(state.track).toMatch(/^1710_[1-6]$/);
  expect(state.image).toBe(imagesByTrack[Number(state.track.slice(-1))]);
  expect(state.background).toContain('blob:');
  expect(state.svgTextCount).toBe(4);
});

for (const version of ['original', 'svg']) {
  test(`a ${version} URL teljes csomagja végigjátszható`, async ({ page }) => {
    test.setTimeout(180000);
    const errors = [];
    const failed = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/?lesson=1710&version=${version}`);
    await expect(page.locator('body')).toHaveAttribute('data-lesson-version', version);
    const visited = new Set();
    for (let index = 0; index < 6; index++) {
      await expect(page.locator('body')).toHaveAttribute('data-state', 'ready');
      const trackId = await page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack);
      expect(visited.has(trackId)).toBe(false);
      visited.add(trackId);
      if (version === 'svg') {
        await expect(page.locator('body')).toHaveAttribute('data-svg-poc', trackId);
        await expect(page.locator(`[data-svg-poc="${trackId}"]`)).toHaveCSS('background-image', /blob:/);
      } else {
        expect(await page.locator('body').getAttribute('data-svg-poc')).toBeNull();
        await expect(page.locator('[data-svg-poc]')).toHaveCount(0);
        const background = await page.evaluate(() => {
          const root = window.drwmsg.carco;
          const item = Object.values(root.recursivechildren).find(child => child.isConnected && child.carco?.id === 'id104');
          return { imageName: item.carco.customparams.image.newname, background: item.style.backgroundImage };
        });
        expect(background.imageName).toBe(imagesByTrack[Number(trackId.slice(-1))]);
        expect(background.background).not.toContain('blob:');
      }
      for (let groupIndex = 0; groupIndex < 4; groupIndex++) {
        for (const selectOption of [false, true]) {
          const bounds = await page.evaluate(({ groupIndex, selectOption }) => {
            const groups = [...document.querySelectorAll('#odPlayer div')].filter(item => item.carco?.customparams?.gametype === 'random_mix_sort_cont' && getComputedStyle(item).visibility === 'visible');
            const button = [...groups[groupIndex].querySelectorAll('div')].find(item => item.carco?.customparams?.gametype === 'button' && (selectOption ? item.textContent.length > 0 : item.textContent === '' && item.offsetWidth > 70));
            return button.getBoundingClientRect().toJSON();
          }, { groupIndex, selectOption });
          await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        }
      }
      await expect(page.locator('.checkbutton')).not.toHaveClass(/drwmsg-nav_ul_disable/);
      await page.locator('.checkbutton').click();
      await expect(page.locator('.solutionbutton')).not.toHaveClass(/drwmsg-nav_ul_disable/);
      await expect.poll(() => page.evaluate(() => window.drwmsg.carco.playeritems.preload_layer.style.display)).toBe('none');
      await page.locator('.solutionbutton').click();
      await expect.poll(() => page.evaluate(() => window.drwmsg.carco.playeritems.preload_layer.style.display)).toBe('none');
      await expect(page.locator('.nextbutton:visible')).toBeVisible();
      await page.locator('.nextbutton:visible').click();
      if (index < 5) {
        await expect.poll(() => page.evaluate(() => window.drwmsg.carco.paramsdata.system.currenttrack)).not.toBe(trackId);
      }
    }
    expect([...visited].sort()).toEqual(Object.keys(promptsByTrack).map(number => `1710_${number}`));
    await expect(page.locator('.drwmsg-endscreen.drwmsg-endtrans')).toBeVisible();
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
  });
}

test('hibás változat nem indítja el a motort', async ({ page }) => {
  for (const search of ['?version=unknown', '?version=original&version=svg']) {
    await page.goto(`/${search}`);
    await expect(page.locator('body')).toHaveAttribute('data-state', 'error');
    await expect(page.locator('#status')).toContainText('version');
    expect(await page.evaluate(() => Boolean(window.carco))).toBe(false);
  }
});