/**
 * Main JavaScript - Scroll animations and interactions
 */
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initSmoothScroll();
});

function initScrollReveal() {
    const elements = document.querySelectorAll('.concierge, .offering-card, .testimonials-header, .footer-cta');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    elements.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            e.preventDefault();
            document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
