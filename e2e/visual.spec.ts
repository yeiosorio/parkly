import { test, expect } from '@playwright/test';
import { mockFirestore, waitForApp } from './fixtures/firebase-mock';

test.describe('Visual Snapshots', () => {
  test('dashboard vacío coincide con snapshot', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('dashboard-empty.png', {
      maxDiffPixels: 100,
    });
  });

  test('dashboard con vehículo coincide con snapshot', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();
    await page.getByPlaceholder('Ej: ABC 123').fill('ABC123');
    await page.getByText('Registrar entrada').click();
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('dashboard-with-vehicle.png', {
      maxDiffPixels: 100,
    });
  });

  test('modal abierto coincide con snapshot', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('modal-open.png', {
      maxDiffPixels: 100,
    });
  });

  test('modal con formulario lleno coincide con snapshot', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();
    await page.getByPlaceholder('Ej: ABC 123').fill('ABC123');
    await page.getByText('Moto').nth(1).click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('modal-filled.png', {
      maxDiffPixels: 100,
    });
  });

  test('wallet page coincide con snapshot', async ({ page }) => {
    await mockFirestore(page);
    await page.goto('/wallet');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('wallet.png', {
      maxDiffPixels: 100,
    });
  });
});
