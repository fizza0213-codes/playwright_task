import { expect, type Locator, type Page } from '@playwright/test';

import { CheckoutPage } from './CheckoutPage';

export class CartPage {
  private readonly cartHeading: Locator;
  private readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.cartHeading = page.getByText('Your Cart', { exact: true });
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html$/);
    await expect(this.cartHeading).toBeVisible();
  }

  async expectProductInCart(productName: string): Promise<void> {
    await this.expectDisplayed();
    const cartItem = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(cartItem).toHaveCount(1);
    await expect(cartItem.getByText(productName, { exact: true })).toBeVisible();
  }

  async clickCheckout(): Promise<CheckoutPage> {
    await this.checkoutButton.click();
    return new CheckoutPage(this.page);
  }
}
