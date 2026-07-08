import { test, expect } from '@playwright/test';
import { mockFirestore, waitForApp, screenshot } from './fixtures/firebase-mock';

test.describe('Entry Modal', () => {
  test('debería abrir el modal y mostrar el formulario', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();

    await expect(page.getByText('Registrar Vehículo')).toBeVisible();
    await expect(page.getByPlaceholder('Ej: ABC 123')).toBeVisible();
    await expect(page.getByText('Carro', { exact: true })).toBeVisible();
    await expect(page.getByText('Moto', { exact: true })).toBeVisible();
    await expect(page.getByText('Día completo (Tarifa Plana)')).toBeVisible();

    const submitBtn = page.getByText('Registrar entrada');
    await expect(submitBtn).toBeDisabled();

    await screenshot(page, 'modal-open');
  });

  test('debería habilitar submit al escribir una placa', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();

    const submitBtn = page.getByText('Registrar entrada');
    await expect(submitBtn).toBeDisabled();

    await page.getByPlaceholder('Ej: ABC 123').fill('ABC123');
    await expect(submitBtn).toBeEnabled();

    await screenshot(page, 'modal-filled');
  });

  test('debería seleccionar tipo Moto y toggle All Day', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();

    await page.getByPlaceholder('Ej: ABC 123').fill('MOTO1');
    await page.getByText('Moto').nth(1).click();
    await page.getByText('Día completo (Tarifa Plana)').click();

    await page.getByText('Registrar entrada').click();
    await page.waitForTimeout(300);

    await expect(page.getByText('MOTO1')).toBeVisible();
    await expect(page.getByText('DÍA')).toBeVisible();
  });

  test('debería cerrar el modal al hacer click en el backdrop', async ({ page }) => {
    await mockFirestore(page);
    await waitForApp(page);

    await page.getByLabel('Registrar vehículo').click();
    await expect(page.getByText('Registrar Vehículo')).toBeVisible();

    await page.locator('[role="dialog"]').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(300);

    await expect(page.getByText('Registrar Vehículo')).not.toBeVisible();
  });
});
