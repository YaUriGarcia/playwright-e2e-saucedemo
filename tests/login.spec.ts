import { test, expect } from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import { users } from '../pages/data/users';

test.describe('Login', () => {
  test('login exitoso con standard_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });


test('login falla con contraseña incorrecta', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.invalid.username, users.invalid.password);

  await expect(loginPage.errorMessage).toBeVisible();
});


test('usuario bloqueado no puede entrar', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.locked.username, users.locked.password);

  await expect(loginPage.errorMessage).toBeVisible();
});

});



