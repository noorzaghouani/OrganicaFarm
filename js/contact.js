/**
 * OrganicaFarm - Contact Form Validation
 * Handles form validation and submission
 */

class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;

        this.fields = {
            fullName: {
                element: this.form.querySelector('#fullName'),
                validators: [
                    {
                        test: (val) => val.trim().length >= 3,
                        message: 'Name must contain at least 3 characters'
                    },
                    {
                        test: (val) => /^[a-zA-ZÀ-ÿ\s\-']+$/.test(val),
                        message: 'Name can only contain letters'
                    }
                ]
            },
            email: {
                element: this.form.querySelector('#email'),
                validators: [
                    {
                        test: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                        message: 'Please enter a valid email address'
                    }
                ]
            },
            phone: {
                element: this.form.querySelector('#phone'),
                validators: [
                    {
                        test: (val) => !val || /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val),
                        message: 'Please enter a valid phone number',
                        optional: true
                    }
                ]
            },
            message: {
                element: this.form.querySelector('#message'),
                validators: [
                    {
                        test: (val) => val.trim().length >= 10,
                        message: 'Message must contain at least 10 characters'
                    }
                ]
            }
        };

        this.init();
    }

    init() {
        // Real-time validation on blur
        Object.entries(this.fields).forEach(([name, field]) => {
            if (!field.element) return;
            field.element.addEventListener('blur', () => this.validateField(name));
            field.element.addEventListener('input', () => this.clearError(name));
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        if (!field || !field.element) return true;

        const value = field.element.value;

        for (const validator of field.validators) {
            if (!validator.test(value)) {
                if (!validator.optional || value) {
                    this.showError(fieldName, validator.message);
                    return false;
                }
            }
        }

        this.clearError(fieldName);
        return true;
    }

    showError(fieldName, message) {
        const field = this.fields[fieldName].element;
        field.classList.add('is-invalid');

        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
    }

    clearError(fieldName) {
        const field = this.fields[fieldName].element;
        if (!field) return;

        field.classList.remove('is-invalid');

        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
            errorDiv.textContent = '';
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isValid = Object.keys(this.fields).every(
            fieldName => this.validateField(fieldName)
        );

        if (isValid) {
            this.submitForm();
        } else {
            this.showValidationError();
        }
    }

    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        console.log('Form data:', data);

        // Show success message
        this.showSuccessMessage();
        this.form.reset();
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'alert alert-success';
        message.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Message sent successfully! We will contact you soon.
        `;
        this.form.insertBefore(message, this.form.firstChild);

        setTimeout(() => message.remove(), 5000);
    }

    showValidationError() {
        const message = document.createElement('div');
        message.className = 'alert alert-danger';
        message.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            Please correct the errors in the form.
        `;
        this.form.insertBefore(message, this.form.firstChild);

        setTimeout(() => message.remove(), 3000);
    }
}

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    new FormValidator('form');
});
