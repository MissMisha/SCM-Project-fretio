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
    const cartModal = document.getElementById('cart-modal');
    
    if (cartModal.style.display === 'flex') {
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
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                            onchange="updateQuantity(${item.id}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeItem(${item.id})">
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
    
    document.getElementById('subtotal-amount').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;
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
}

function updateQuantity(id, newQuantity) {
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
    
    alert('Proceeding to checkout...');
    // In a real application, you would redirect to a checkout page
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
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCart); 