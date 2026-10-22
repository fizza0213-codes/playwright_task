import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

test.describe('SauceDemo checkout', () => {
  test('Complete checkout successfully with one product', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // 1. Navigate to SauceDemo and log in with valid credentials.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // 2. Verify the Products page, select a product, and add it to the cart.
    await productsPage.expectDisplayed();
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartItemCount(1);

    // 3. Open the cart and verify the selected product is present.
    const cartPage: CartPage = await productsPage.openCart();
    await cartPage.expectProductInCart('Sauce Labs Backpack');

    // 4. Start checkout and enter customer information.
    const checkoutPage: CheckoutPage = await cartPage.clickCheckout();
    await checkoutPage.expectInformationStepDisplayed();
    await checkoutPage.fillCustomerInformation('Test', 'User', '12345');

    // 5. Continue to the overview and verify product and order information.
    await checkoutPage.continueToOverview();
    await checkoutPage.expectOverview({
      productName: 'Sauce Labs Backpack',
      quantity: '1',
      itemPrice: '$29.99',
      paymentInformation: 'SauceCard #31337',
      shippingInformation: 'Free Pony Express Delivery!',
      itemTotal: '$29.99',
      tax: '$2.40',
      total: '$32.39',
    });

    // 6. Finish the order and verify the confirmation.
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderConfirmation();
  });
});
