/**
 * OrganicaFarm - Products Page
 * Handles product filtering and add to cart functionality
 */

// Product Filter Class
class ProductFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('[data-filter]');
        this.products = document.querySelectorAll('#product-grid > div[data-category]');
        this.init();
    }

    init() {
        if (this.filterButtons.length === 0) return;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.filter(e));
        });
    }

    filter(event) {
        const category = event.target.getAttribute('data-filter');
        this.updateActiveButton(event.target);
        this.filterProducts(category);
    }

    updateActiveButton(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    filterProducts(category) {
        this.products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            const visible = category === 'all' || productCategory.includes(category);
            product.style.display = visible ? 'block' : 'none';
        });
    }
}

// Product Cart Integration
function initializeProductCart() {
    const addToCartButtons = document.querySelectorAll('.btn-primary');

    addToCartButtons.forEach(button => {
        // Skip if it's the filter button or already has listener
        if (button.closest('.filter-buttons') || button.dataset.cartListener) return;

        button.dataset.cartListener = 'true';
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Get product information
            const card = this.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const imageEl = card.querySelector('.product-img');
            const image = imageEl ? imageEl.src : 'https://via.placeholder.com/80';
            const productId = `product-${Date.now()}-${Math.random()}`;

            // Add to cart
            if (window.cart) {
                window.cart.addItem({
                    id: productId,
                    name: title,
                    price: price,
                    image: image
                });
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Initialize product filter
    new ProductFilter();

    // Initialize cart functionality for products
    initializeProductCart();
});
