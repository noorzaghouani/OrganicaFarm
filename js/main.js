/**
 * OrganicaFarm - Main JavaScript
 * Handles cart functionality and notifications
 */

// Shopping Cart Class with LocalStorage
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateDisplay();
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
                quantity: 1
            });
        }

        this.saveCart();
        this.updateDisplay();
        this.showNotification(`${product.name} ajouté au panier`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateDisplay();
    }

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        );
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
let cart;
document.addEventListener('DOMContentLoaded', function () {
    cart = new ShoppingCart();
});
