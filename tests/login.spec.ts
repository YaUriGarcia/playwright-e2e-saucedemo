
// Script de prueba para login exitoso con standard_user

import { test, expect } from '@playwright/test';

test('login exitoso con standard_user', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory/);
  await expect(page.getByText('Products')).toBeVisible();
});


// Script de prueba para login fallido con usuario bloqueado

test('login falla con contraseña incorrecta', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('incorrecta');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText(/do not match/i)).toBeVisible();
});









