# Automation Exercise - Complete Playwright TypeScript Automation Suite

An enterprise-grade, end-to-end test automation framework built using **Playwright** with **TypeScript** and the **Page Object Model (POM)** pattern for [Automation Exercise](https://www.automationexercise.com/).

---

## 🏗️ Architecture & Directory Structure

```plaintext
playwright-practise/
├── playwright.config.ts            # Global Playwright configuration (baseURL, timeouts, reporters)
├── package.json                    # Scripts and dependencies
├── src/
│   ├── fixtures/
│   │   ├── test-base.ts            # Extended test fixture with auto ad-blocking & POM instances
│   │   └── sample-upload.txt       # Sample attachment for Contact Us file upload verification
│   ├── pages/
│   │   ├── BasePage.ts             # Universal header navigation, footer subscriptions & ad-blocking
│   │   ├── HomePage.ts             # Carousel slider, sidebar categories/brands, featured & recommended items
│   │   ├── AuthPage.ts             # Login, signup initiation, detailed registration form & delete lifecycle
│   │   ├── ProductsPage.ts         # Catalog, search, category & brand filtering, add to cart
│   │   ├── ProductDetailPage.ts   # Product specifications, quantity selector, customer review submission
│   │   ├── CartPage.ts             # Cart line items, pricing calculations, item deletion & checkout modal
│   │   ├── CheckoutPage.ts         # Delivery/invoice address verification, order comments & place order
│   │   ├── PaymentPage.ts          # Card details simulation, order confirmation & invoice PDF download
│   │   ├── ContactPage.ts          # Contact Us form with file attachment and window.confirm handling
│   │   └── StaticPages.ts          # Test cases documentation, REST API list, Video Tutorials
│   ├── utils/
│   │   └── test-data.ts            # Dynamic user registration, mock payment, and contact form generators
│   └── tests/
│       ├── auth.spec.ts            # TC01 - TC05: Authentication & User Lifecycle tests
│       ├── products.spec.ts        # TC06 - TC10: Products, Search, Filters & Reviews tests
│       ├── cart.spec.ts            # TC11 - TC14: Shopping Cart, Quantities & Recommended Items tests
│       ├── checkout.spec.ts        # TC15 - TC17: End-to-End Checkout, Payment & Invoice tests
│       └── routes-and-content.spec.ts # TC18 - TC23: Carousel, Routes, Forms & Documentation tests
```

---

## 🧪 Test Coverage Matrix (23 Test Cases)

| Test ID  | Test Suite                   | Test Scenario / Workflow                                                                                | Target Route                                    |
| :------- | :--------------------------- | :------------------------------------------------------------------------------------------------------ | :---------------------------------------------- |
| **TC01** | `auth.spec.ts`               | Register user with dynamic data, verify account created, verify logged in, delete account               | `/login`, `/signup`, `/delete_account`          |
| **TC02** | `auth.spec.ts`               | Login with valid credentials and verify user session                                                    | `/login`                                        |
| **TC03** | `auth.spec.ts`               | Negative login with invalid email and password                                                          | `/login`                                        |
| **TC04** | `auth.spec.ts`               | Register with already existing email shows validation error                                             | `/signup`                                       |
| **TC05** | `auth.spec.ts`               | User logout terminates authenticated session                                                            | `/login`, `/logout`                             |
| **TC06** | `products.spec.ts`           | Verify All Products page and product detail information (name, category, price, stock, brand)           | `/products`, `/product_details/1`               |
| **TC07** | `products.spec.ts`           | Search product by keyword and verify all returned cards                                                 | `/products`                                     |
| **TC08** | `products.spec.ts`           | Filter products by Category & Subcategory (Women > Tops, Men > Tshirts)                                 | `/category_products/{id}`                       |
| **TC09** | `products.spec.ts`           | Filter products by Brand (Polo, Madame)                                                                 | `/brand_products/{brand}`                       |
| **TC10** | `products.spec.ts`           | Submit customer product review with name, email, and review comment                                     | `/product_details/1`                            |
| **TC11** | `cart.spec.ts`               | Add products from catalog to cart and verify items, prices, quantities, and totals                      | `/products`, `/view_cart`                       |
| **TC12** | `cart.spec.ts`               | Verify exact product quantity in cart when adding from product detail page                              | `/product_details/1`, `/view_cart`              |
| **TC13** | `cart.spec.ts`               | Remove product from cart and assert line-item deletion                                                  | `/view_cart`                                    |
| **TC14** | `cart.spec.ts`               | Add recommended item to cart from Home page carousel                                                    | `/`, `/view_cart`                               |
| **TC15** | `checkout.spec.ts`           | Complete checkout workflow: delivery & invoice address verification, payment, and invoice download      | `/checkout`, `/payment`                         |
| **TC16** | `checkout.spec.ts`           | Place Order: Login before Checkout flow                                                                 | `/login`, `/checkout`, `/payment`               |
| **TC17** | `checkout.spec.ts`           | Place Order: Guest user registers during checkout modal prompt                                          | `/view_cart`, `/login`, `/checkout`, `/payment` |
| **TC18** | `routes-and-content.spec.ts` | Home page elements: Carousel slider, categories, featured grid, recommended carousel, footer newsletter | `/`                                             |
| **TC19** | `routes-and-content.spec.ts` | Verify Subscription in Cart page footer                                                                 | `/view_cart`                                    |
| **TC20** | `routes-and-content.spec.ts` | Contact Us form submission with file attachment upload and dialog alert acceptance                      | `/contact_us`                                   |
| **TC21** | `routes-and-content.spec.ts` | Verify Test Cases documentation list (scenarios count & visibility)                                     | `/test_cases`                                   |
| **TC22** | `routes-and-content.spec.ts` | Verify API Testing documentation reference list                                                         | `/api_list`                                     |
| **TC23** | `routes-and-content.spec.ts` | Verify Video Tutorials navigation link to YouTube playlist                                              | Header Navbar                                   |

---

## 🚀 Execution Commands

Run all tests in Chromium:

```bash
npm run test:chromium
```

Run individual module suites:

```bash
npm run test:auth        # Authentication & User Lifecycle tests
npm run test:products    # Product Catalog, Search & Reviews tests
npm run test:cart        # Shopping Cart & Quantity tests
npm run test:checkout    # End-to-End Checkout & Payment tests
npm run test:routes      # Navigation Routes & Content tests
```

Run tests in headed mode (interactive browser UI):

```bash
npm run test:headed
```

View the HTML test execution report:

```bash
npm run report
```

---

## 🛡️ Reliability & Anti-Flakiness Strategy

1. **Intelligent Network Ad-Blocking**: The site loads heavy Google AdSense & Vignette overlays (`googlesyndication`, `doubleclick`, `googleads`). The suite intercepts and blocks these third-party scripts via Playwright routes in `test-base.ts`, making page loads instantaneous (< 1s) and preventing click-interception overlay modals.
2. **Dynamic Unique Test Data**: User registration automatically creates dynamic, timestamped credentials to prevent test collision across parallel test workers.
3. **Resilient Event Handling**: Handles native `window.confirm` browser dialogs in the Contact Us form using Playwright event listeners (`page.once('dialog', ...)`).
4. **DOM Dispatch Clicks**: Bypasses Bootstrap accordion sliding transitions using standard DOM event dispatching to eliminate animation timing discrepancies.
