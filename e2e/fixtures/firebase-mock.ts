import { Page } from '@playwright/test';

/**
 * Intercepta peticiones a Firestore REST API y devuelve datos mockeados.
 */
export async function mockFirestore(page: Page, data: {
  activeVehicles?: Record<string, unknown>[];
  pastVehicles?: Record<string, unknown>[];
}) {
  await page.route('**/firestore.googleapis.com/**', async (route) => {
    const url = route.request().url();

    if (url.includes('activeVehicles')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          documents: (data.activeVehicles ?? []).map((v, i) => ({
            name: `projects/parkly/databases/(default)/documents/activeVehicles/doc_${i}`,
            fields: {
              plate: { stringValue: v.plate ?? '' },
              type: { stringValue: v.type ?? 'Carro' },
              entryTime: { timestampValue: v.entryTime ?? new Date().toISOString() },
              allDay: { booleanValue: v.allDay ?? false },
              ...(v.exitTime ? { exitTime: { timestampValue: v.exitTime } } : {}),
              ...(v.totalToPay ? { totalToPay: { integerValue: v.totalToPay } } : {}),
              ...(v.totalTimeStr ? { totalTimeStr: { stringValue: v.totalTimeStr } } : {}),
            },
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
          })),
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ documents: [] }),
    });
  });
}

/**
 * Espera a que la app Angular termine de bootstrap.
 */
export async function waitForApp(page: Page) {
  await page.goto('/');
  await page.waitForSelector('text=Parkly', { timeout: 15000 });
}

/**
 * Toma un screenshot y lo guarda con nombre descriptivo.
 */
export async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
}
