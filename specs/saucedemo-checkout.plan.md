# SauceDemo Checkout Test Plan

## Application Overview

Automated Playwright TypeScript coverage for SauceDemo using Page Object Model classes LoginPage, ProductsPage, CartPage, and CheckoutPage. The primary flow logs in as standard_user, adds Sauce Labs Backpack, verifies cart and checkout overview details, completes the order, and verifies the confirmation message. Each scenario starts from a fresh browser state and keeps locators and page-specific actions inside the relevant Page Object class; test files contain only flow orchestration and assertions through Page Object methods.

## Test Scenarios

### 1. SauceDemo checkout

**Seed:** `tests/seed.spec.ts`

#### 1.1. Complete checkout successfully with one product

**File:** `tests/saucedemo-checkout.spec.ts`

**Steps:**
  1. Start from a fresh browser context and navigate to https://www.saucedemo.com/. Use LoginPage to fill username standard_user and password secret_sauce, then submit login.
    - expect: The browser navigates to the inventory/products page.
    - expect: The Products page is displayed with the Products heading and product listing visible.
    - expect: No direct locator is used in the test file; login locators and actions are owned by LoginPage.
  2. Use ProductsPage to verify the products page is displayed, select Sauce Labs Backpack, and add it to the cart.
    - expect: The Sauce Labs Backpack is available in the product list.
    - expect: The product is added successfully.
    - expect: The cart indicator shows one item.
    - expect: Product locators and add-to-cart behavior are owned by ProductsPage.
  3. Use ProductsPage to open the shopping cart, then use CartPage to verify the selected product is present.
    - expect: The browser navigates to the cart page.
    - expect: The cart contains exactly one item named Sauce Labs Backpack.
    - expect: Cart navigation and product-presence locators are owned by CartPage.
  4. Use CartPage to click Checkout and use CheckoutPage to enter first name Test, last name User, and postal code 12345.
    - expect: The checkout information page is displayed.
    - expect: The first name, last name, and postal code fields contain the supplied values.
    - expect: Checkout form locators and field-entry actions are owned by CheckoutPage.
  5. Use CheckoutPage to continue to the checkout overview.
    - expect: The checkout overview page is displayed.
    - expect: The overview contains Sauce Labs Backpack with quantity 1 and price $29.99.
    - expect: Payment information shows SauceCard #31337.
    - expect: Shipping information shows Free Pony Express Delivery!.
    - expect: The price summary shows item total $29.99, tax $2.40, and total $32.39.
  6. Use CheckoutPage to click Finish and verify the order confirmation.
    - expect: The checkout complete page is displayed.
    - expect: The confirmation heading reads Thank you for your order!.
    - expect: The confirmation text states that the order has been dispatched.
    - expect: The cart indicator is empty.
    - expect: The order is considered successfully completed.

#### 1.2. Reject checkout when required customer information is missing

**File:** `tests/saucedemo-checkout-validation.spec.ts`

**Steps:**
  1. Start from a fresh browser context, log in through LoginPage with standard_user and secret_sauce, add Sauce Labs Backpack through ProductsPage, open the cart, and use CartPage to navigate to checkout.
    - expect: The checkout information page is displayed with empty customer-information fields.
    - expect: All interactions use Page Object methods; the test file contains no direct locators.
  2. Use CheckoutPage to submit the checkout information form without entering first name, last name, or postal code.
    - expect: The user remains on the checkout information page.
    - expect: A required-field validation message is displayed for the missing information.
    - expect: The checkout overview is not opened and the order is not completed.

#### 1.3. Keep checkout state and product totals consistent across overview and completion

**File:** `tests/saucedemo-checkout-integrity.spec.ts`

**Steps:**
  1. Start from a fresh browser context and repeat the valid login, Backpack selection, cart verification, and checkout-information entry flow using LoginPage, ProductsPage, CartPage, and CheckoutPage.
    - expect: The selected product and entered customer information are present before continuing.
    - expect: The test uses only Page Object methods for navigation and page-specific interaction.
  2. Continue to the overview, capture the displayed product name, quantity, item price, tax, and total through CheckoutPage methods, then finish the order.
    - expect: The overview values remain consistent with one Sauce Labs Backpack: quantity 1, item price $29.99, tax $2.40, and total $32.39.
    - expect: The completed order displays the Thank you for your order! confirmation.
    - expect: No product or price changes occur between cart, overview, and completion.
