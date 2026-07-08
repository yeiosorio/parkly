import { Page } from '@playwright/test';

/**
 * Bloquea todas las llamadas de red a Firestore para evitar conexiones reales.
 * Las escrituras (commit) reciben respuesta 200 OK para que el SDK no falle.
 */
export async function mockFirestore(page: Page) {
  await page.route('**/firestore.googleapis.com/**', async (route) => {
    const url = route.request().url();

    if (url.includes(':commit')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          writeResults: [{ updateTime: new Date().toISOString() }],
          commitTime: new Date().toISOString(),
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
  });
}

/**
 * Navega al dashboard y espera a que Angular termine de renderizar.
 */
export async function waitForApp(page: Page) {
  await page.goto('/');
  await page.waitForSelector('text=Parkly', { timeout: 15000 });
}

/**
 * Toma un screenshot full-page.
 */
export async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
}
