/**
 * Main JavaScript Entry Point
 * Initializes the application and provides initialization logging
 */

// All functions are registered on window object by their respective modules
// - window.toggleMobileMenu(isOpen) - from navigation.js
// - window.toggleTheme() - from theme.js

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Voicerely app initialized');
    
    // Trigger pricing card animations when section comes into view
    const pricingSection = document.getElementById('pricing');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    if (pricingSection && pricingCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add 'animate' class to trigger entrance animation
                    pricingCards.forEach((card, index) => {
                        card.classList.add('animate');
                    });
                    // Stop observing after animation is triggered
                    observer.unobserve(pricingSection);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(pricingSection);
    }
    
// Trigger timeline step animations on howitworks.html
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    if (timelineSteps.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger the animation for each step
                    timelineSteps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.add('animate');
                        }, index * 200);
                    });
                    // Stop observing after animation is triggered
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe the parent section
        const timelineSection = document.querySelector('section:nth-of-type(3)');
        if (timelineSection) {
            timelineObserver.observe(timelineSection);
        }
    }
    
    // Trigger timeline line draw animation on howitworks.html
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        const lineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    lineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        lineObserver.observe(timelineLine);
    }

    // Parallax effect for floating icons around the phone mockup
    const floatingIcons = document.querySelectorAll('.floating-icon');
    const container = document.querySelector('.phone-mockup-container');

    if (container && floatingIcons.length > 0) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const offsetX = e.clientX - rect.left - rect.width / 2;
            const offsetY = e.clientY - rect.top - rect.height / 2;

            floatingIcons.forEach((icon, index) => {
                const movementStrength = 10 + index * 5; // Vary movement strength per icon
                const xMove = (offsetX / rect.width) * movementStrength;
                const yMove = (offsetY / rect.height) * movementStrength;

                icon.style.transform = `translate3d(${xMove}px, ${yMove}px, 0)`;
            });
        });

        container.addEventListener('mouseleave', () => {
            floatingIcons.forEach((icon) => {
                icon.style.transform = 'translate3d(0, 0, 0)';
            });
        });
    }
});