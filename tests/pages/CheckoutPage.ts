import { expect, type Locator, type Page } from '@playwright/test';

export interface CheckoutOverview {
  productName: string;
  quantity: string;
  itemPrice: string;
  paymentInformation: string;
  shippingInformation: string;
  itemTotal: string;
  tax: string;
  total: string;
}

export class CheckoutPage {
  private readonly checkoutInformationHeading: Locator;
  private readonly checkoutOverviewHeading: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly confirmationHeading: Locator;
  private readonly confirmationText: Locator;

  constructor(private readonly page: Page) {
    this.checkoutInformationHeading = page.getByText('Checkout: Your Information', { exact: true });
    this.checkoutOverviewHeading = page.getByText('Checkout: Overview', { exact: true });
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.confirmationText = page.getByText(/Your order has been dispatched/);
  }

  async expectInformationStepDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one\.html$/);
    await expect(this.checkoutInformationHeading).toBeVisible();
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async expectOverview(overview: CheckoutOverview): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html$/);
    await expect(this.checkoutOverviewHeading).toBeVisible();
    await expect(this.page.locator('.cart_item')).toContainText(overview.productName);
    await expect(this.page.locator('.cart_quantity')).toHaveText(overview.quantity);
    await expect(this.page.locator('.inventory_item_price')).toHaveText(overview.itemPrice);
    await expect(this.page.locator('.summary_value_label').filter({ hasText: overview.paymentInformation })).toBeVisible();
    await expect(this.page.locator('.summary_value_label').filter({ hasText: overview.shippingInformation })).toBeVisible();
    await expect(this.page.locator('.summary_subtotal_label')).toHaveText(`Item total: ${overview.itemTotal}`);
    await expect(this.page.locator('.summary_tax_label')).toHaveText(`Tax: ${overview.tax}`);
    await expect(this.page.locator('.summary_total_label')).toHaveText(`Total: ${overview.total}`);
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async expectOrderConfirmation(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html$/);
    await expect(this.confirmationHeading).toBeVisible();
    await expect(this.confirmationText).toBeVisible();
    await expect(this.page.locator('[data-test="shopping-cart-badge"]')).toBeHidden();
  }
}
