import { test, expect } from '@playwright/test';
import { mockFirestore, waitForApp, screenshot } from './fixtures/firebase-mock';

test.describe('Vehicle Card', () => {
  test('debería mostrar tarjeta de vehículo activo con placa y tipo', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();
    await page.getByPlaceholder('Ej: ABC 123').fill('ABC123');
    await page.getByText('Registrar entrada').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('ABC123')).toBeVisible();
    await expect(page.getByText('Carro', { exact: true })).toBeVisible();
    await expect(page.getByText('Tiempo')).toBeVisible();

    await screenshot(page, 'vehicle-card-active');
  });

  test('debería mostrar tarjeta de moto con badge allDay', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();
    await page.getByPlaceholder('Ej: ABC 123').fill('MOTO1');
    await page.getByText('Moto', { exact: true }).click();
    await page.getByText('Día completo (Tarifa Plana)').click();
    await page.getByText('Registrar entrada').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('MOTO1')).toBeVisible();
    await expect(page.getByText('Moto', { exact: true })).toBeVisible();
    await expect(page.getByText('DÍA')).toBeVisible();
  });
});
