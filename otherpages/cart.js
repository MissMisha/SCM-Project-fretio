// Initialize cart from localStorage or create new cart
let cart = JSON.parse(localStorage.getItem('fretioCart')) || [];

// Update cart badge on page load
function initializeCart() {
    updateCartBadge();
    setupEventListeners();
}

// Set up event listeners for cart functionality
function setupEventListeners() {
    // Set up profile dropdown if it exists
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            const dropdown = document.querySelector('.dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }
}

// Cart functionality
function toggleCart() {
    console.log("Toggle cart called");
    const cartModal = document.getElementById('cart-modal');
    
    if (!cartModal) {
        console.error("Cart modal element not found!");
        return;
    }
    
    // Check if the modal is currently visible
    const isVisible = window.getComputedStyle(cartModal).display !== 'none';
    console.log("Cart modal is currently:", isVisible ? "visible" : "hidden");
    
    if (isVisible) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    } else {
        renderCartItems();
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) {
        console.error("Cart items container not found!");
        return;
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p>Your cart is empty</p>
                <p>Browse our products and add items to your cart</p>
            </div>
        `;
        return;
    }
    
    let cartHTML = '';
    
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                            onchange="updateQuantity('${item.id}', this.value)">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeItem('${item.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // You can add tax calculation, shipping, etc. here
    const total = subtotal;
    
    const subtotalElement = document.getElementById('subtotal-amount');
    const totalElement = document.getElementById('total-amount');
    
    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `₹${total.toFixed(2)}`;
    
    return { subtotal, total };
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    
    if (badge) {
        badge.textContent = totalItems;
        
        if (totalItems === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

function addToCart(id, name, price, image, quantity = 1) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item if it doesn't exist
        cart.push({
            id,
            name,
            price,
            image,
            quantity
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update UI
    updateCartBadge();
    
    // Show confirmation
    showToast(`${name} added to cart!`);
    
    // Open cart modal automatically after adding item
    toggleCart();
}

function updateQuantity(id, newQuantity) {
    console.log(`Updating quantity for item ${id} to ${newQuantity}`);
    newQuantity = parseInt(newQuantity);
    
    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
    }
    
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        if (newQuantity === 0) {
            // Remove item if quantity is 0
            removeItem(id);
        } else {
            // Update quantity
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            renderCartItems();
            updateCartBadge();
        }
    }
}

function removeItem(id) {
    console.log(`Removing item ${id} from cart`);
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCartItems();
    updateCartBadge();
    
    // Show confirmation
    showToast('Item removed from cart');
}

function saveCart() {
    localStorage.setItem('fretioCart', JSON.stringify(cart));
}

function clearCart() {
    cart = [];
    saveCart();
    renderCartItems();
    updateCartBadge();
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = '../otherpages/checkout.html';
}

function goToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = '../otherpages/checkout.html';
}

function placeOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Get form inputs
    const firstName = document.getElementById('firstName')?.value;
    const lastName = document.getElementById('lastName')?.value;
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const address = document.getElementById('address')?.value;
    
    // Validate form
    if (!firstName || !lastName || !email || !phone || !address) {
        showToast('Please fill in all required fields');
        return;
    }
    
    // Create order object with cart items and shipping details
    const order = {
        items: [...cart],
        customer: {
            firstName,
            lastName,
            email,
            phone,
            address,
            city: document.getElementById('city')?.value,
            zipCode: document.getElementById('zipCode')?.value,
            country: document.getElementById('country')?.value
        },
        totals: calculateOrderTotals(),
        orderDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save order to localStorage (in a real app, this would be sent to a server)
    saveOrder(order);
    
    // Clear cart
    clearCart();
    
    // Show success message
    showToast('Your order has been placed successfully!');
    
    // Redirect to thank you page after a delay
    setTimeout(() => {
        window.location.href = '../otherpages/thank-you.html';
    }, 2000);
}

function saveOrder(order) {
    // Get existing orders from localStorage
    const orders = JSON.parse(localStorage.getItem('fretioOrders')) || [];
    
    // Add new order with unique ID
    order.id = generateOrderId();
    orders.push(order);
    
    // Save back to localStorage
    localStorage.setItem('fretioOrders', JSON.stringify(orders));
}

function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function calculateOrderTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 40; // Fixed shipping cost
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;
    
    return {
        subtotal,
        shipping,
        tax,
        total
    };
}

function loadOrderSummary() {
    const summaryItems = document.getElementById('summary-items');
    if (!summaryItems) return;
    
    summaryItems.innerHTML = '';
    
    if (cart.length === 0) {
        summaryItems.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">₹${item.price.toFixed(2)}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
        `;
        
        summaryItems.appendChild(itemElement);
    });
    
    // Update summary totals
    const totals = calculateOrderTotals();
    
    const summarySubtotalElement = document.getElementById('summary-subtotal');
    const summaryTaxElement = document.getElementById('summary-tax');
    const summaryShippingElement = document.getElementById('summary-shipping');
    const summaryTotalElement = document.getElementById('summary-total');
    
    if (summarySubtotalElement) summarySubtotalElement.textContent = `₹${totals.subtotal.toFixed(2)}`;
    if (summaryTaxElement) summaryTaxElement.textContent = `₹${totals.tax.toFixed(2)}`;
    if (summaryShippingElement) summaryShippingElement.textContent = `₹${totals.shipping.toFixed(2)}`;
    if (summaryTotalElement) summaryTotalElement.textContent = `₹${totals.total.toFixed(2)}`;
}

function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        toast.style.color = '#fff';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '2000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(toast);
    }
    
    // Set message and display toast
    const toastMessage = document.getElementById('toastMessage');
    if (toastMessage) {
        toastMessage.textContent = message;
        toast.style.display = 'block';
    } else {
        toast.textContent = message;
        toast.style.opacity = '1';
    }
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        if (toastMessage) {
            toast.style.display = 'none';
        } else {
            toast.style.opacity = '0';
        }
    }, 3000);
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    
    // Load order summary on checkout page if applicable
    if (window.location.href.includes('checkout.html')) {
        loadOrderSummary();
    }
});

// Add to cart button
document.querySelector('.add-to-cart-btn').setAttribute('onclick', "addToCart('med1', 'Paracetamol', 29.00, 'https://cdn01.pharmeasy.in/dam/products_otc/I05582/dolo-650-tablet-15s-2-1671741628.jpg')");