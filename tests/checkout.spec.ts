import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../pages/data/users';

test.describe('Carrito y checkout', {tag: '@regression'}, () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.cartLink.click();
  });

  test('el carrito muestra el producto agregado', async () => {
    await expect(cart.items).toHaveCount(1);
    await expect(cart.itemNames).toHaveText('Sauce Labs Backpack');
  });


  test('compra completa con datos válidos', {tag: '@smoke'}, async () => {
    await cart.startCheckout();
    await checkout.fillInfo('Ana', 'Pérez', '55000');
    await checkout.finishButton.click();

    await expect(checkout.completeHeader).toHaveText(/thank you for your order/i);
  });

  
  test('checkout falla si falta el nombre', async () => {
    await cart.startCheckout();
    await checkout.fillInfo('', 'Pérez', '55000');

    await expect(checkout.errorMessage).toContainText(/first name is required/i);
  });

  test('checkout falla si falta el apellido', async () => {
    await cart.startCheckout();
    await checkout.fillInfo('Ana', '', '55000');
    
    await expect(checkout.errorMessage).toContainText(/last name is required/i);
  });
  
  test('checkout falla si falta el código postal', async () => {
    await cart.startCheckout();
    await checkout.fillInfo('Ana', 'Pérez', '');
    
    await expect(checkout.errorMessage).toContainText(/postal code is required/i);
  });

});