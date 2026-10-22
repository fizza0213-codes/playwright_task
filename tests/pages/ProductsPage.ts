import { expect, type Locator, type Page } from '@playwright/test';

import { CartPage } from './CartPage';

export class ProductsPage {
  private readonly productsHeading: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.productsHeading = page.getByText('Products', { exact: true });
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async expectDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html$/);
    await expect(this.productsHeading).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    await expect(product).toBeVisible();
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async expectCartItemCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).toBeHidden();
      return;
    }

    await expect(this.cartBadge).toHaveText(String(count));
  }

  async openCart(): Promise<CartPage> {
    await this.shoppingCartLink.click();
    return new CartPage(this.page);
  }
}
