/**
 * OrganicaFarm - Main JavaScript
 * Handles cart functionality and notifications
 */

// Shopping Cart Class with LocalStorage and Modal
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateDisplay();
        this.attachCartButtonListener();
    }

    loadCart() {
        const saved = localStorage.getItem('organica-cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('organica-cart', JSON.stringify(this.items));
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);

        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image || 'https://via.placeholder.com/80'
            });
        }

        this.saveCart();
        this.updateDisplay();
        this.showNotification(`${product.name} added to cart`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateDisplay();
        this.renderCartModal();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateDisplay();
                this.renderCartModal();
            }
        }
    }

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        ).toFixed(2);
    }

    updateDisplay() {
        const cartElements = document.querySelectorAll('.btn-outline-primary');
        const totalItems = this.getTotalItems();

        cartElements.forEach(element => {
            if (element.querySelector('.fa-shopping-cart')) {
                element.innerHTML = `<i class="fas fa-shopping-cart me-1"></i> Cart (${totalItems})`;
            }
        });
    }

    attachCartButtonListener() {
        // Use event delegation to handle cart button clicks (works with template-loaded navigation)
        document.addEventListener('click', (e) => {
            // Check if clicked element is or contains the cart button
            const cartButton = e.target.closest('.btn-outline-primary');
            if (cartButton && cartButton.querySelector('.fa-shopping-cart')) {
                e.preventDefault();
                this.showModal();
            }
        });
    }

    showModal() {
        this.renderCartModal();

        // Check if Bootstrap is loaded
        if (typeof bootstrap !== 'undefined') {
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();

            // Attach checkout button listener after modal is shown
            setTimeout(() => {
                const checkoutBtn = document.getElementById('checkout-btn');
                if (checkoutBtn && !checkoutBtn.dataset.listenerAttached) {
                    checkoutBtn.dataset.listenerAttached = 'true';
                    checkoutBtn.addEventListener('click', () => {
                        // Redirect to checkout page
                        window.location.href = 'checkout.html';
                    });
                }
            }, 100);
        } else {
            console.error('Bootstrap not loaded');
        }
    }

    renderCartModal() {
        const container = document.getElementById('cart-items-container');
        const emptyMessage = document.getElementById('cart-empty-message');
        const totalElement = document.getElementById('cart-total');

        if (!container) return;

        // Clear container
        container.innerHTML = '';

        if (this.items.length === 0) {
            emptyMessage.style.display = 'block';
            container.style.display = 'none';
            totalElement.textContent = '$0.00';
        } else {
            emptyMessage.style.display = 'none';
            container.style.display = 'block';

            this.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} / Kg</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" data-action="decrease" data-id="${item.id}">−</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div>
                        <div class="cart-item-price mb-2">$${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                `;
                container.appendChild(itemDiv);
            });

            // Update total
            totalElement.textContent = `$${this.getTotalPrice()}`;

            // Attach event listeners to buttons
            this.attachModalEventListeners();
        }
    }

    attachModalEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                const action = e.currentTarget.dataset.action;
                const item = this.items.find(i => i.id === productId);

                if (item) {
                    const newQuantity = action === 'increase'
                        ? item.quantity + 1
                        : item.quantity - 1;
                    this.updateQuantity(productId, newQuantity);
                }
            });
        });

        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.removeItem(productId);
            });
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart when DOM is ready
// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    window.cart = new ShoppingCart();
});
