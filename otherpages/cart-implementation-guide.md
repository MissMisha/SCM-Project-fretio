# Shopping Cart Implementation Guide for Fretio Website

This guide explains how to add the shopping cart functionality to all pages of the Fretio website.

## Files Included

1. **cart.js** - Contains all the cart functionality logic
2. **cart.css** - Contains all the cart-related styles
3. **cart-template.html** - Contains the HTML structure for the cart modal

## Implementation Steps

### Step 1: Add CSS and JavaScript Files

Add the following lines in the `<head>` section of each HTML page:

```html
<!-- Add the cart stylesheet -->
<link rel="stylesheet" href="[path-to]/cart.css">
```

Add the following line just before the closing `</body>` tag:

```html
<!-- Add the cart JavaScript -->
<script src="[path-to]/cart.js"></script>
```

**Note:** Replace `[path-to]` with the relative path to the cart files from your HTML page. For example:
- For pages in the root directory: `./otherpages/cart.css`
- For pages in subdirectories: `../otherpages/cart.css`

### Step 2: Add Cart Icon in Header

Replace the existing shopping cart icon with this code:

```html
<div class="cart-icon-container">
    <i class="fas fa-shopping-cart" onclick="toggleCart()"></i>
    <span class="cart-badge" id="cartBadge">0</span>
</div>
```

### Step 3: Add Cart Modal HTML

Add the following HTML code just before the closing `</body>` tag:

```html
<!-- Cart Modal -->
<div class="cart-modal" id="cartModal">
    <div class="cart-container">
        <div class="cart-header">
            <h2 class="cart-title">Your Cart</h2>
            <button class="close-cart" onclick="toggleCart()"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-items" id="cartItems">
            <!-- Cart items will be dynamically generated here -->
        </div>
        <div class="cart-summary">
            <div class="subtotal">
                <span>Subtotal:</span>
                <span id="subtotalAmount">$0.00</span>
            </div>
            <div class="total">
                <span>Total:</span>
                <span class="total-amount" id="totalAmount">$0.00</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
        </div>
    </div>
</div>

<!-- Toast Notification -->
<div id="toast" style="display: none; position: fixed; bottom: 20px; right: 20px; background-color: rgba(0, 0, 0, 0.8); color: white; padding: 15px 25px; border-radius: 5px; z-index: 1002; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); border-left: 4px solid #FFD700;">
    <span id="toastMessage"></span>
</div>
```

### Step 4: Add Product Cards with "Add to Cart" Buttons

For each product you want to display with an "Add to Cart" button, use this pattern:

```html
<div class="product-card">
    <img src="[product-image-path]" alt="[Product Name]" class="product-image">
    <h3>[Product Name]</h3>
    <p class="product-price">$[Price]</p>
    <button class="add-to-cart-btn" onclick="addToCart('[product-id]', '[Product Name]', [price], '[product-image-path]')">
        Add to Cart <i class="fas fa-shopping-cart"></i>
    </button>
</div>
```

Replace:
- `[product-id]` with a unique ID for each product
- `[Product Name]` with the name of the product
- `[price]` with the price as a number (without the $ symbol)
- `[product-image-path]` with the path to the product image

## Cart Functions Available

- `toggleCart()` - Opens and closes the cart modal
- `addToCart(id, name, price, imagePath)` - Adds a product to the cart
- `updateQuantity(id, change)` - Updates the quantity of a product in the cart
- `removeItem(id)` - Removes a product from the cart
- `clearCart()` - Empties the cart
- `checkout()` - Processes the checkout (currently just shows an alert)

## Features

- **Persistent Storage**: The cart data is saved in the browser's localStorage, so it persists across page reloads and navigation between pages.
- **Dynamic Updates**: The cart badge updates automatically to show the number of items in the cart.
- **Toast Notifications**: Notifications appear when items are added to or removed from the cart.
- **Responsive Design**: The cart works well on both desktop and mobile devices.

## Troubleshooting

If the cart functionality isn't working correctly:

1. Check the browser console for any JavaScript errors.
2. Ensure all paths to CSS and JS files are correct.
3. Make sure Font Awesome is properly loaded to display the icons.
4. Verify that the product IDs are unique across the website.

## Example Implementation

The index.html page has been updated with a fully functional example of the cart implementation. Refer to this page as a template for implementing the cart on other pages. 