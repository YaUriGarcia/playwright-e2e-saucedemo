import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly startCheckoutButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('.cart_item');
    this.itemNames = page.locator('.cart_item [data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]'); 
    this.startCheckoutButton = page.locator('[data-test="checkout"]');
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }

  async removeFromCart(productSlug: string) {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }
}

