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

    // Trigger hidden cost card animations on index.html (legacy .animate class)
    const hiddenCostCards = document.querySelectorAll('.hidden-cost-card');
    
    if (hiddenCostCards.length > 0) {
        const hiddenCostObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger the animation for each card
                    hiddenCostCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 150);
                    });
                    // Stop observing after animation is triggered
                    hiddenCostObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe the section
        const hiddenCostSection = document.getElementById('hidden-cost');
        if (hiddenCostSection) {
            hiddenCostObserver.observe(hiddenCostSection);
        }
    }

    // Trigger redesigned hidden cost card animations (new .visible class)
    const redesignedHiddenCostCards = document.querySelectorAll('.hidden-cost-card[data-card-index]');
    
    if (redesignedHiddenCostCards.length > 0) {
        const redesignedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger the animation for each card using .visible class
                    redesignedHiddenCostCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 150);
                    });
                    // Stop observing after animation is triggered
                    redesignedObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe the section
        const hiddenCostSection = document.getElementById('hidden-cost');
        if (hiddenCostSection) {
            redesignedObserver.observe(hiddenCostSection);
        }
    }

    // Live counter animation for hidden-cost section
    const counterEl = document.getElementById('hiddenCostCounter');
    if (counterEl) {
        const target = parseInt(counterEl.dataset.target, 10) || 1247;
        let hasCounted = false;
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    // Initial count up to target over 2 seconds
                    animateCounter(counterEl, 0, target, 2000);
                    // Then increment by 1 every 3 seconds
                    setInterval(() => {
                        const current = parseInt(counterEl.textContent.replace(/,/g, ''), 10);
                        animateCounter(counterEl, current, current + 1, 500);
                    }, 3000);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        counterObserver.observe(counterEl);
    }

    function animateCounter(el, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // Gradient line draw animation on scroll for hidden-cost section
    const hiddenCostSection = document.getElementById('hidden-cost');
    if (hiddenCostSection) {
        const gradientLineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scrolled');
                    gradientLineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        gradientLineObserver.observe(hiddenCostSection);
    }

    // Parallax effect for floating icons around the phone mockup
    const floatingIcons = document.querySelectorAll('.floating-icon');
    const container = document.querySelector('.phone-mockup-container');

    // Respect reduced motion preference
    if (container && floatingIcons.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

    // Trigger AI Team card animations on index.html
    const aiTeamCards = document.querySelectorAll('#ai-employees .group');
    
    if (aiTeamCards.length > 0) {
        const aiTeamObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger the animation for each card
                    aiTeamCards.forEach((card, index) => {
                        card.style.setProperty('--card-index', index);
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 150);
                    });
                    // Stop observing after animation is triggered
                    aiTeamObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe the ai-employees section
        const aiEmployeesSection = document.getElementById('ai-employees');
        if (aiEmployeesSection) {
            aiTeamObserver.observe(aiEmployeesSection);
        }
    }

});
