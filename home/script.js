document.addEventListener("DOMContentLoaded", () => {
    // Chatbox Toggle
    const chatToggle = document.querySelector(".chat-toggle");
    const chatContent = document.querySelector(".chat-content");

    chatToggle.addEventListener("click", () => {
        chatContent.style.display = chatContent.style.display === "block" ? "none" : "block";
    });

    // Placeholder Animation
    const chatInput = document.querySelector(".chat-content input");
    chatInput.addEventListener("focus", function() {
        this.placeholder = "";
    });

    chatInput.addEventListener("blur", function() {
        this.placeholder = "Ask anything ...";
    });
});
// Toggle search bar visibility
function toggleSearch() {
    const searchBar = document.getElementById('search-bar');
    searchBar.style.display = searchBar.style.display === 'block' ? 'none' : 'block';
}

// Search functionality (simple for now)
function searchProducts() {
    const searchTerm = document.querySelector('.search-bar input').value;
    if (searchTerm) {
        alert('Searching for: ' + searchTerm);
        // You can later integrate a product search functionality here.
    } else {
        alert('Please enter a product name.');
    }
    // Optionally, close the search bar after search
    toggleSearch();
}

// Cart functionality (simple for now)
function viewCart() {
    alert('Viewing Cart...');
    // You can add logic here to open a cart modal or display cart items.
}

// Optional: Add item to cart (example with a simple button click)
function addToCart(productId) {
    // Simulate adding an item to the cart
    console.log('Added product ID ' + productId + ' to cart.');
    // Update cart count (this can be dynamic based on cart items)
    updateCartCount();
}

// Update cart item count on cart icon
function updateCartCount() {
    const cartItemCount = 1; // This is just a placeholder; you'd get this dynamically
    document.querySelector('.cart-btn::after').textContent = cartItemCount;
}
