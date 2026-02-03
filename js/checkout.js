/**
 * OrganicaFarm - Checkout Logic
 * Handles order summary rendering and payment simulation
 */

document.addEventListener('DOMContentLoaded', function () {
    loadOrderSummary();
    setupFormSubmission();
});

function loadOrderSummary() {
    const summaryList = document.getElementById('order-summary-list');
    const totalDisplay = document.getElementById('order-total-display');
    const savedCart = localStorage.getItem('organica-cart');

    if (!savedCart) {
        window.location.href = 'products.html'; // Redirect if no cart
        return;
    }

    const cartItems = JSON.parse(savedCart);

    if (cartItems.length === 0) {
        summaryList.innerHTML = '<li class="list-group-item text-center">Your cart is empty</li>';
        totalDisplay.textContent = '$0.00';
        document.getElementById('place-order-btn').disabled = true;
        return;
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Render items
    summaryList.innerHTML = '';
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center lh-sm py-3';
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="position-relative me-3">
                    <img src="${item.image || 'https://via.placeholder.com/50'}" class="order-item-img" alt="${item.name}">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                        ${item.quantity}
                    </span>
                </div>
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">$${item.price.toFixed(2)} / kg</small>
                </div>
            </div>
            <span class="text-muted">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        summaryList.appendChild(li);
    });

    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

function setupFormSubmission() {
    const form = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');

    // Intercept form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // Show processing modal
        const processingModal = new bootstrap.Modal(document.getElementById('processingModal'));
        processingModal.show();

        // Simulate API call / Payment processing
        setTimeout(() => {
            // Success state
            document.getElementById('processing-state').style.display = 'none';
            document.getElementById('success-state').style.display = 'block';

            // Clear cart
            localStorage.removeItem('organica-cart');

            // Allow user to read success message before redirecting manually via button
            // If they don't click, we can auto redirect after a few seconds if desired
            // For now, the button in modal handles redirection

        }, 2000); // 2 second delay
    });
}
