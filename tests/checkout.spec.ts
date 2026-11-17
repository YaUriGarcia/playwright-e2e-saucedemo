import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../pages/data/users';

test.describe('Carrito y checkout', () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  // Estado inicial: usuario logueado con un producto en el carrito,
  // para que cada test parta de un escenario reproducible.
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

  // Flujo feliz: datos válidos → confirmación final de la orden.
  test('compra completa con datos válidos', async () => {
    await cart.startCheckout();
    await checkout.fillInfo('Ana', 'Pérez', '55000');
    await checkout.finishButton.click();

    await expect(checkout.completeHeader).toHaveText(/thank you for your order/i);
  });

  // Validación de campo obligatorio: sin nombre, el checkout debe bloquearse.
  test('checkout falla si falta el nombre', async () => {
    await cart.startCheckout();
    await checkout.fillInfo('', 'Pérez', '55000');

    await expect(checkout.errorMessage).toContainText(/first name is required/i);
  });
});