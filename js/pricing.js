/**
 * Pricing Page JavaScript
 * Handles currency selection, billing toggle, and FAQ accordion with localStorage persistence
 */

// Currency conversion rates (simplified for demo)
const currencyRates = {
    USD: 1,
    AUD: 1.5,
    INR: 83
};

// Pricing data with monthly and annual prices
const pricingData = {
    base: { monthly: 249, annual: 219 },
    starter: { monthly: 499, annual: 449 },
    growth: { monthly: 1497, annual: 1347 },
};

// Initialize pricing page functionality
document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currencySelect');
    const billingSwitch = document.getElementById('billingSwitch');
    const labelMonthly = document.getElementById('labelMonthly');
    const labelAnnual = document.getElementById('labelAnnual');
    
    let currentCurrency = localStorage.getItem('pricing-currency') || 'USD';
    let isAnnual = localStorage.getItem('pricing-billing') === 'annual';
    
    // Initialize currency selector
    if (currencySelect) {
        currencySelect.value = currentCurrency;
    }
    
    // Currency selector change handler
    if (currencySelect) {
        currencySelect.addEventListener('change', function() {
            currentCurrency = this.value;
            localStorage.setItem('pricing-currency', currentCurrency);
            updatePrices();
        });
    }
    
    // Billing toggle handler
    if (billingSwitch) {
        billingSwitch.addEventListener('click', function() {
            isAnnual = !isAnnual;
            localStorage.setItem('pricing-billing', isAnnual ? 'annual' : 'monthly');
            updateBillingToggle();
            updatePrices();
        });
    }
    
    // Initialize billing toggle state
    updateBillingToggle();
    
    function updateBillingToggle() {
        const toggleWrap = billingSwitch.closest('.toggle-wrap');
        if (isAnnual) {
            labelMonthly.classList.remove('active');
            labelAnnual.classList.add('active');
            if (toggleWrap) toggleWrap.classList.add('active');
        } else {
            labelMonthly.classList.add('active');
            labelAnnual.classList.remove('active');
            if (toggleWrap) toggleWrap.classList.remove('active');
        }
    }
    
    function updatePrices() {
        const rate = currencyRates[currentCurrency];
        const cards = document.querySelectorAll('.pricing-card');
        
        cards.forEach(card => {
            const tier = card.getAttribute('data-tier');
            const priceElement = card.querySelector('.price');
            const billedText = card.querySelector('.billed-text');
            
            if (!tier || !priceElement) return;
            
            // Handle enterprise separately (custom pricing)
            if (tier === 'enterprise') {
                return;
            }
            
            const basePrice = isAnnual ? pricingData[tier].annual : pricingData[tier].monthly;
            const convertedPrice = Math.round(basePrice * rate);
            
            // Format price with currency symbol
            let formattedPrice;
            switch (currentCurrency) {
                case 'USD':
                    formattedPrice = `$${convertedPrice}`;
                    break;
                case 'AUD':
                    formattedPrice = `A$${convertedPrice}`;
                    break;
                case 'INR':
                    formattedPrice = `₹${convertedPrice.toLocaleString()}`;
                    break;
                default:
                    formattedPrice = `$${convertedPrice}`;
            }
            
            priceElement.textContent = formattedPrice;
            
            // Update billed text
            if (billedText) {
                if (isAnnual) {
                    billedText.textContent = 'Billed annually';
                } else {
                    billedText.textContent = 'Billed monthly';
                }
            }
        });
    }
    
    // Initialize FAQ accordion
    initFAQAccordion();
    
    // Initialize
    updatePrices();
});

// FAQ Accordion functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-q');
        const answer = item.querySelector('.faq-a');
        const icon = item.querySelector('.faq-icon');
        
        // Initially collapse all answers
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        
        question.addEventListener('click', function() {
            // Close all other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-a');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    otherAnswer.style.maxHeight = '0';
                    otherItem.classList.remove('active');
                    // Reset chevron rotation
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current answer
            const isActive = item.classList.contains('active');
            if (isActive) {
                answer.style.maxHeight = '0';
                item.classList.remove('active');
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('active');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}