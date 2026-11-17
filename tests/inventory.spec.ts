import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../pages/data/users';

test.describe('Inventario', {tag: '@regression'}, () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventory = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('muestra 6 productos', {tag: '@smoke'}, async () => {
    await expect(inventory.items).toHaveCount(6);
  });

  test('ordena por precio de menor a mayor', async () => {
    await inventory.sortBy('lohi');
    const prices = await inventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('agregar un producto sube el contador del carrito a 1', async () => {
    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('quitar el producto elimina el contador del carrito', async () => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.removeFromCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveCount(0);
  });
});