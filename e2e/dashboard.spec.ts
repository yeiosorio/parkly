import { test, expect } from '@playwright/test';
import { mockFirestore, waitForApp, screenshot } from './fixtures/firebase-mock';

test.describe('Dashboard', () => {
  test('debería mostrar el dashboard vacío con stats en 0', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await expect(page.getByText('Total hoy')).toBeVisible();
    await expect(page.getByText('Dentro')).toBeVisible();
    await expect(page.getByText('Salieron')).toBeVisible();
    await expect(page.getByText('Sin vehículos registrados')).toBeVisible();

    const fab = page.getByLabel('Registrar vehículo');
    await expect(fab).toBeVisible({ timeout: 10000 });

    await screenshot(page, 'dashboard-empty');
  });

  test('debería permitir registrar un vehículo y verlo en la lista', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    const fab = page.getByLabel('Registrar vehículo');
    await expect(fab).toBeVisible({ timeout: 10000 });
    await fab.click();

    await page.getByPlaceholder('Ej: ABC 123').fill('ABC123');
    await page.getByText('Registrar entrada').click();
    await page.waitForTimeout(500);

    await expect(page.getByText('ABC123')).toBeVisible();
    await expect(page.getByText('Carro', { exact: true })).toBeVisible();
    await screenshot(page, 'dashboard-with-vehicle');
  });

  test('debería mostrar tabs con el conteo correcto tras registrar vehículos', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    const fab = page.getByLabel('Registrar vehículo');
    await expect(fab).toBeVisible({ timeout: 10000 });
    await fab.click();

    await page.getByPlaceholder('Ej: ABC 123').fill('ABC123');
    await page.getByText('Registrar entrada').click();
    await page.waitForTimeout(500);

    const todos = page.getByText('Todos').locator('span');
    await expect(todos).toHaveText('1');
  });

  test('debería registrar múltiples vehículos', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    const fab = page.getByLabel('Registrar vehículo');
    await expect(fab).toBeVisible({ timeout: 10000 });

    await fab.click();
    await page.getByPlaceholder('Ej: ABC 123').fill('ABC123');
    await page.getByText('Registrar entrada').click();
    await page.waitForTimeout(500);

    await fab.click();
    await page.getByPlaceholder('Ej: ABC 123').fill('MOTO1');
    await page.getByText('Moto').nth(1).click();
    await page.getByText('Registrar entrada').click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Todos').locator('span')).toHaveText('2');
    await expect(page.getByText('Carros').locator('span')).toHaveText('1');
    await expect(page.getByText('Motos').locator('span')).toHaveText('1');
  });
});
