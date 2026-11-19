import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users } from '../data/users';

test.describe('Inventario', {tag: '@regression'}, () => {
  let inventory: InventoryPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
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
    await inventory.sortBy('lohi');
    await expect(inventory.sortSelect).toHaveValue('lohi');
  });

    test('ordena alfabéticamente de Z a A', async () => {
    await inventory.sortBy('za');
    const names = await inventory.itemNames.allTextContents();
    const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sortedNames);
    await inventory.sortBy('za');
    await expect(inventory.sortSelect).toHaveValue('za');
  });

   test('agregar producto al carrito y validar flujo de ida y vuelta', async ({ page }) => {
    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');
    await inventory.cartLink.click();
    await expect(page).toHaveURL(/cart.html/);
    await expect(cart.itemNames).toHaveText('Sauce Labs Backpack');
    await cart.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('quitar el producto elimina el contador del carrito', async () => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.removeFromCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveCount(0);
  });

  test('ver detalle del producto y regresar al inventario', async ({ page }) => {
    await inventory.itemNames.first().click();
    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
    await expect(inventory.detailName).toBeVisible();
    await expect(inventory.detailDesc).toBeVisible();
    await expect(inventory.detailPrice).toBeVisible();
    await expect(inventory.detailImage).toBeVisible();
    await inventory.backToProductsBtn.click();
    await expect(page).toHaveURL(/inventory.html/);
  });

    test('quitar producto desde la página del carrito', async ({ page }) => {
    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');
    await inventory.cartLink.click();
    await expect(page).toHaveURL(/cart.html/);
    await cart.removeFromCart('sauce-labs-backpack');
    await expect(cart.items).toHaveCount(0);
    await expect(inventory.cartBadge).toHaveCount(0); 
  });

});