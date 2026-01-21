/**
 * Template Loader - Pure Frontend Solution
 * Loads navigation and footer templates into pages
 */

class TemplateLoader {
    constructor() {
        this.loadTemplates();
    }

    async loadTemplates() {
        await this.loadNavigation();
        await this.loadFooter();
        this.setActiveNavLink();
    }

    async loadNavigation() {
        const navPlaceholder = document.querySelector('[data-include="navigation"]');
        if (!navPlaceholder) return;

        try {
            const response = await fetch('templates/navigation.html');
            const html = await response.text();
            navPlaceholder.innerHTML = html;
        } catch (error) {
            console.error('Error loading navigation:', error);
        }
    }

    async loadFooter() {
        const footerPlaceholder = document.querySelector('[data-include="footer"]');
        if (!footerPlaceholder) return;

        try {
            const response = await fetch('templates/footer.html');
            const html = await response.text();
            footerPlaceholder.innerHTML = html;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    setActiveNavLink() {
        // Wait for navigation to load
        setTimeout(() => {
            const currentPage = this.getCurrentPage();
            const navLinks = document.querySelectorAll('.nav-link[data-page]');

            navLinks.forEach(link => {
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            });
        }, 100);
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'index';
    }
}

// Initialize template loader when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    new TemplateLoader();
});
