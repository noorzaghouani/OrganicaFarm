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
                        message: 'Le nom doit contenir au moins 3 caractères'
                    },
                    {
                        test: (val) => /^[a-zA-ZÀ-ÿ\s\-']+$/.test(val),
                        message: 'Le nom ne peut contenir que des lettres'
                    }
                ]
            },
            email: {
                element: this.form.querySelector('#email'),
                validators: [
                    {
                        test: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                        message: 'Veuillez entrer une adresse email valide'
                    }
                ]
            },
            phone: {
                element: this.form.querySelector('#phone'),
                validators: [
                    {
                        test: (val) => !val || /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val),
                        message: 'Veuillez entrer un numéro de téléphone valide',
                        optional: true
                    }
                ]
            },
            message: {
                element: this.form.querySelector('#message'),
                validators: [
                    {
                        test: (val) => val.trim().length >= 10,
                        message: 'Le message doit contenir au moins 10 caractères'
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
            Message envoyé avec succès! Nous vous contacterons bientôt.
        `;
        this.form.insertBefore(message, this.form.firstChild);

        setTimeout(() => message.remove(), 5000);
    }

    showValidationError() {
        const message = document.createElement('div');
        message.className = 'alert alert-danger';
        message.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            Veuillez corriger les erreurs dans le formulaire.
        `;
        this.form.insertBefore(message, this.form.firstChild);

        setTimeout(() => message.remove(), 3000);
    }
}

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    new FormValidator('form');
});
