import { test, expect } from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import { users } from '../data/users';

test.describe('Login', {tag: '@regression'}, () => {
  test('login exitoso con standard_user', {tag: '@smoke'}, async ({ page }) => {
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
  
  test('login falla con usuario vacío', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', users.standard.password);
    
    await expect(loginPage.errorMessage).toContainText(/username is required/i);
  });
  
  test('login falla con contraseña vacía', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, '');
    
    await expect(loginPage.errorMessage).toContainText(/password is required/i);
  });
  
  test('login falla con usuario inexistente', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('usuario_que_no_existe', 'secret_sauce');
    
    await expect(loginPage.errorMessage).toContainText(/do not match/i);
  });

});


