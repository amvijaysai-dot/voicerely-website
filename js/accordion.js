/**
 * Shared FAQ Accordion Module
 * ARIA-aware accordion functionality for FAQ sections
 * Used by faq.html and pricing.html
 */

// Initialize FAQ Accordion
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
        
        // Set initial ARIA attributes
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        
        question.addEventListener('click', function() {
            // Close all other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-a');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    const otherQuestion = otherItem.querySelector('.faq-q');
                    otherAnswer.style.maxHeight = '0';
                    otherItem.classList.remove('active');
                    // Reset chevron rotation
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                    // Update ARIA
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                    if (otherAnswer) {
                        otherAnswer.setAttribute('aria-hidden', 'true');
                    }
                }
            });
            
            // Toggle current answer
            const isActive = item.classList.contains('active');
            if (isActive) {
                answer.style.maxHeight = '0';
                item.classList.remove('active');
                icon.style.transform = 'rotate(0deg)';
                question.setAttribute('aria-expanded', 'false');
                answer.setAttribute('aria-hidden', 'true');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('active');
                icon.style.transform = 'rotate(180deg)';
                question.setAttribute('aria-expanded', 'true');
                answer.setAttribute('aria-hidden', 'false');
            }
        });
    });
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initFAQAccordion);