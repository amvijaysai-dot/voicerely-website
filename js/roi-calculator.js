/**
 * ROI Calculator Module
 * Handles live calculations for missed call cost estimation
 */

// Plan pricing in USD
const PLAN_PRICES = {
    base: 249,
    starter: 499,
    growth: 1497,
    enterprise: 0
};

// Format number as currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Format number with commas
function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

// Animate number counting
function animateValue(element, start, end, duration = 800, isCurrency = false) {
    const startNum = parseFloat(start) || 0;
    const endNum = parseFloat(end) || 0;
    const range = endNum - startNum;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startNum + range * easeOut);
        
        if (isCurrency) {
            element.textContent = formatCurrency(current);
        } else {
            element.textContent = formatNumber(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Calculate break-even time
function calculateBreakEven(monthlyRevenueLost, planType) {
    const planPrice = PLAN_PRICES[planType] || 249;
    if (planPrice === 0) return 'Custom';
    
    const weeksToBreakEven = Math.ceil((planPrice / monthlyRevenueLost) * 4);
    
    if (weeksToBreakEven <= 1) return '< 2 weeks';
    if (weeksToBreakEven <= 2) return '≈ 2 weeks';
    if (weeksToBreakEven <= 3) return '≈ 2-3 weeks';
    if (weeksToBreakEven <= 4) return '≈ 3 weeks';
    if (weeksToBreakEven <= 8) return '≈ 1 month';
    return '≈ 2 months';
}

// Calculate ROI
function calculateROI() {
    const callsPerMonth = parseFloat(document.getElementById('callsPerMonth').value) || 0;
    const missedPercent = parseFloat(document.getElementById('missedPercent').value) || 0;
    const customerValue = parseFloat(document.getElementById('customerValue').value) || 0;
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) || 0;
    const planType = document.getElementById('planType').value || 'base';
    
    // Calculations
    const missedCalls = Math.round(callsPerMonth * (missedPercent / 100));
    const lostCustomers = Math.round(missedCalls * (conversionRate / 100));
    const monthlyRevenueLost = lostCustomers * customerValue;
    const annualRevenueLost = monthlyRevenueLost * 12;
    
    // Update results with animation
    const missedCallsEl = document.getElementById('kpiMissedCalls');
    const lostClientsEl = document.getElementById('kpiPotentialCustomers');
    const monthlyRevenueEl = document.getElementById('monthlyRevenueResult');
    const annualRevenueEl = document.getElementById('kpiMonthlyLost');
    const breakEvenEl = document.getElementById('kpiBreakEven');
    const recoveryProgress = document.getElementById('recoveryProgress');
    const recoveryPercent = document.getElementById('recoveryPercent');
    
    // Snapshot elements (desktop)
    const snapshotMissedCalls = document.getElementById('snapshotMissedCalls');
    const snapshotLostClients = document.getElementById('snapshotLostClients');
    const snapshotMonthlyRevenue = document.getElementById('snapshotMonthlyRevenue');
    const snapshotBreakEven = document.getElementById('snapshotBreakEven');
    
    // Snapshot elements (mobile)
    const snapshotMissedCallsMobile = document.getElementById('snapshotMissedCallsMobile');
    const snapshotLostClientsMobile = document.getElementById('snapshotLostClientsMobile');
    const snapshotMonthlyRevenueMobile = document.getElementById('snapshotMonthlyRevenueMobile');
    const snapshotBreakEvenMobile = document.getElementById('snapshotBreakEvenMobile');
    
    if (missedCallsEl) {
        animateValue(missedCallsEl, missedCallsEl.textContent, missedCalls, 800, false);
    }
    if (lostClientsEl) {
        animateValue(lostClientsEl, lostClientsEl.textContent, lostCustomers, 800, false);
    }
    if (monthlyRevenueEl) {
        animateValue(monthlyRevenueEl, monthlyRevenueEl.textContent.replace(/[^0-9.-]+/g,"") || 0, monthlyRevenueLost, 800, true);
    }
    if (annualRevenueEl) {
        animateValue(annualRevenueEl, annualRevenueEl.textContent.replace(/[^0-9.-]+/g,"") || 0, annualRevenueLost, 800, true);
    }
    
    // Update mobile snapshot annual revenue
    const snapshotAnnualRevenueMobile = document.getElementById('snapshotAnnualRevenueMobile');
    if (snapshotAnnualRevenueMobile) {
        snapshotAnnualRevenueMobile.textContent = formatCurrency(annualRevenueLost);
    }
    if (breakEvenEl) {
        const breakEven = calculateBreakEven(monthlyRevenueLost, planType);
        breakEvenEl.textContent = breakEven;
    }
    
    // Update snapshot (desktop)
    if (snapshotMissedCalls) {
        snapshotMissedCalls.textContent = formatNumber(missedCalls);
    }
    if (snapshotLostClients) {
        snapshotLostClients.textContent = formatNumber(lostCustomers);
    }
    if (snapshotMonthlyRevenue) {
        snapshotMonthlyRevenue.textContent = formatCurrency(monthlyRevenueLost);
    }
    if (snapshotBreakEven) {
        snapshotBreakEven.textContent = calculateBreakEven(monthlyRevenueLost, planType);
    }
    
    // Update snapshot (mobile)
    if (snapshotMissedCallsMobile) {
        snapshotMissedCallsMobile.textContent = formatNumber(missedCalls);
    }
    if (snapshotLostClientsMobile) {
        snapshotLostClientsMobile.textContent = formatNumber(lostCustomers);
    }
    if (snapshotMonthlyRevenueMobile) {
        snapshotMonthlyRevenueMobile.textContent = formatCurrency(monthlyRevenueLost);
    }
    if (snapshotBreakEvenMobile) {
        snapshotBreakEvenMobile.textContent = calculateBreakEven(monthlyRevenueLost, planType);
    }
    
    // Update gauge (95% recovery potential)
    const gaugeFill = document.getElementById('gaugeFill');
    const gaugePercent = document.getElementById('recoveryPercent');
    
    if (gaugeFill && gaugePercent) {
        // Animate gauge arc from 0% to 95%
        const circumference = 2 * Math.PI * 80; // 2 * PI * radius
        const targetPercent = 95;
        const targetOffset = circumference - (circumference * targetPercent / 100);
        
        // Set initial state (fully visible)
        gaugeFill.style.strokeDasharray = circumference;
        gaugeFill.style.strokeDashoffset = '0';
        
        // Animate to target
        let start = null;
        const duration = 800;
        const initialOffset = circumference;
        
        function animateGauge(timestamp) {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentOffset = initialOffset - (initialOffset - targetOffset) * easeOut;
            
            gaugeFill.style.strokeDashoffset = currentOffset;
            
            // Also animate the percentage number
            const currentPercent = Math.round(targetPercent * easeOut);
            gaugePercent.textContent = currentPercent + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animateGauge);
            }
        }
        
        requestAnimationFrame(animateGauge);
    }
    
    // Add pulse animation to KPI cards
    const kpiCards = document.querySelectorAll('.roi-kpi-card');
    kpiCards.forEach(card => {
        card.classList.add('kpi-pulse');
        setTimeout(() => {
            card.classList.remove('kpi-pulse');
        }, 300);
    });
}


// Initialize ROI Calculator
document.addEventListener('DOMContentLoaded', function() {
    const callsInput = document.getElementById('callsPerMonth');
    const missedSlider = document.getElementById('missedPercent');
    const missedValue = document.getElementById('missedPercentValue');
    const valueInput = document.getElementById('customerValue');
    const conversionSlider = document.getElementById('conversionRate');
    const conversionValue = document.getElementById('conversionRateValue');
    const planSelect = document.getElementById('planType');
    
    // Set up event listeners
    if (callsInput) {
        callsInput.addEventListener('input', calculateROI);
    }
    
    if (missedSlider && missedValue) {
        missedSlider.addEventListener('input', function() {
            missedValue.textContent = this.value + '%';
            calculateROI();
        });
    }
    
    if (valueInput) {
        valueInput.addEventListener('input', calculateROI);
    }
    
    if (conversionSlider && conversionValue) {
        conversionSlider.addEventListener('input', function() {
            conversionValue.textContent = this.value + '%';
            calculateROI();
        });
    }
    
    if (planSelect) {
        planSelect.addEventListener('change', calculateROI);
    }
    
    // Initial calculation
    calculateROI();
});
