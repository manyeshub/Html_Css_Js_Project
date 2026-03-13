/* ============================================
   script.js - Clean Energy Hub
   Written by: [Your Name], B.Tech CSE 2025-29
   ITM Skills University

   This file handles:
   1. Mobile menu toggle
   2. Smooth scrolling
   3. Energy savings calculator
   4. Product filter
   5. Compare table update
   6. Contact form submit
   7. Fade-in on scroll
   ============================================ */


// Wait for the HTML to fully load before running any JS
document.addEventListener('DOMContentLoaded', function() {

    // Call each function based on what page we are on
    setupMenu();
    setupSmoothScroll();
    setupCalculator();
    setupProductFilter();
    setupCompareTable();
    setupContactForm();
    setupFadeIn();

});


/* --------------------------------------------
   1. MOBILE MENU TOGGLE
   Clicking the hamburger button shows/hides the nav links
   -------------------------------------------- */
function setupMenu() {
    var menuBtn = document.querySelector('.menu-btn');
    var navLinks = document.querySelector('.nav-links');

    // Only run if these elements exist on the page
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            // toggle() adds the class if not present, removes if present
            navLinks.classList.toggle('open');
        });
    }
}


/* --------------------------------------------
   2. SMOOTH SCROLLING
   When user clicks a link like href="#section",
   it scrolls smoothly instead of jumping
   -------------------------------------------- */
function setupSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            var target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}


/* --------------------------------------------
   3. ENERGY SAVINGS CALCULATOR
   Reads user input values and calculates
   daily, monthly, annual consumption and savings
   -------------------------------------------- */
function setupCalculator() {
    // Only run on the calculator page
    var applianceSelect = document.getElementById('applianceType');
    if (!applianceSelect) return;

    // Listen for changes on all inputs inside the form
    var allInputs = document.querySelectorAll('#calcForm select, #calcForm input');
    allInputs.forEach(function(input) {
        input.addEventListener('input', calculateResult);
    });

    // Run once on page load to show default values
    calculateResult();
}

function calculateResult() {
    // Read values from input fields
    var appliance = document.getElementById('applianceType').value;
    var starRating = parseInt(document.getElementById('starRating').value);
    var hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value) || 0;
    var ratePerUnit = parseFloat(document.getElementById('unitCost').value) || 7;

    // Base wattage for each appliance type (in Watts)
    var wattsTable = {
        'ac': 1500,
        'fridge': 150,
        'washer': 500,
        'fan': 75,
        'tv': 100,
        'bulb': 10
    };

    var baseWatts = wattsTable[appliance] || 150;

    // Higher star rating = less electricity used
    // Each extra star saves about 7% compared to 1-star
    var savingFactor = 1 - ((starRating - 1) * 0.07);
    var actualWatts = baseWatts * savingFactor;

    // Calculate units (kWh)
    var dailyKwh   = (actualWatts * hoursPerDay) / 1000;
    var monthlyKwh = dailyKwh * 30;
    var annualKwh  = dailyKwh * 365;

    // Calculate cost in Rupees
    var monthlyCost = monthlyKwh * ratePerUnit;
    var annualCost  = annualKwh  * ratePerUnit;

    // Calculate savings compared to 1-star (no saving factor)
    var worstCaseAnnual = (baseWatts * hoursPerDay / 1000) * 365;
    var annualSavings = (worstCaseAnnual - annualKwh) * ratePerUnit;
    if (annualSavings < 0) annualSavings = 0;

    // Show results in the result box
    document.getElementById('resDaily').textContent   = dailyKwh.toFixed(2) + ' kWh';
    document.getElementById('resMonthly').textContent = monthlyKwh.toFixed(1) + ' kWh  (Rs. ' + monthlyCost.toFixed(0) + ')';
    document.getElementById('resAnnual').textContent  = annualKwh.toFixed(0)  + ' kWh  (Rs. ' + annualCost.toFixed(0) + ')';
    document.getElementById('resSavings').textContent = 'Rs. ' + annualSavings.toFixed(0) + ' / year';
}


/* --------------------------------------------
   4. PRODUCT FILTER
   Filters product cards based on type and star rating
   -------------------------------------------- */
function setupProductFilter() {
    var typeSelect = document.getElementById('filterType');
    var ratingRadios = document.querySelectorAll('input[name="ratingFilter"]');
    var allCards = document.querySelectorAll('.product-card');

    if (!typeSelect || allCards.length === 0) return;

    // Listen for changes on type dropdown
    typeSelect.addEventListener('change', applyFilter);

    // Listen for changes on all radio buttons
    ratingRadios.forEach(function(radio) {
        radio.addEventListener('change', applyFilter);
    });
}

function applyFilter() {
    var selectedType = document.getElementById('filterType').value;

    // Find which radio is currently selected
    var selectedRating = 'all';
    var ratingRadios = document.querySelectorAll('input[name="ratingFilter"]');
    ratingRadios.forEach(function(r) {
        if (r.checked) {
            selectedRating = r.value;
        }
    });

    // Show or hide each card based on its data attributes
    var allCards = document.querySelectorAll('.product-card');
    allCards.forEach(function(card) {
        var cardType   = card.getAttribute('data-type');
        var cardRating = card.getAttribute('data-rating');

        var typeMatch   = (selectedType === 'all' || cardType === selectedType);
        var ratingMatch = (selectedRating === 'all' || cardRating === selectedRating);

        if (typeMatch && ratingMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}


/* --------------------------------------------
   5. COMPARE TABLE
   Updates the comparison table when user
   changes the dropdown selections
   -------------------------------------------- */

// Product data stored as a simple object
var productData = {
    'ac_5star': {
        name:     'EcoCool Inverter AC 1.5T',
        type:     'Air Conditioner',
        power:    '950 W',
        annual:   '855 kWh',
        cost:     'Rs. 5,985',
        savings:  'Rs. 2,100 vs 1-star',
        subsidy:  'EESL: Rs. 3,000',
        exchange: 'Rs. 5,000 off old AC'
    },
    'ac_3star': {
        name:     'CoolBreeze AC 1.5T',
        type:     'Air Conditioner',
        power:    '1200 W',
        annual:   '1,080 kWh',
        cost:     'Rs. 7,560',
        savings:  'Rs. 630 vs 1-star',
        subsidy:  'None',
        exchange: 'Rs. 3,000 off old AC'
    },
    'fridge_5star': {
        name:     'GreenFrost Refrigerator 300L',
        type:     'Refrigerator',
        power:    '80 W',
        annual:   '240 kWh',
        cost:     'Rs. 1,680',
        savings:  'Rs. 840 vs 1-star',
        subsidy:  'BEE: Rs. 1,500',
        exchange: 'Rs. 4,000 off old fridge'
    },
    'washer_5star': {
        name:     'AquaSave Washing Machine 7kg',
        type:     'Washing Machine',
        power:    '350 W',
        annual:   '315 kWh',
        cost:     'Rs. 2,205',
        savings:  'Rs. 630 vs 1-star',
        subsidy:  'State Govt: Rs. 2,000',
        exchange: 'Rs. 2,500 off old washer'
    },
    'fan_5star': {
        name:     'WhisperBreeze BLDC Fan',
        type:     'Ceiling Fan',
        power:    '28 W',
        annual:   '61 kWh',
        cost:     'Rs. 427',
        savings:  'Rs. 294 vs 1-star',
        subsidy:  'EESL: Rs. 500',
        exchange: 'Rs. 500 off old fan'
    }
};

function setupCompareTable() {
    var selects = document.querySelectorAll('.compare-select');
    if (selects.length === 0) return;

    selects.forEach(function(sel) {
        sel.addEventListener('change', updateCompareTable);
    });

    // Load the table on page open
    updateCompareTable();
}

function updateCompareTable() {
    var selects = document.querySelectorAll('.compare-select');

    // Loop through each column (1, 2, 3)
    selects.forEach(function(sel, index) {
        var col = index + 1; // column number 1, 2 or 3
        var key = sel.value;
        var data = productData[key] || {};

        // Update each cell in that column
        var fields = ['name', 'type', 'power', 'annual', 'cost', 'savings', 'subsidy', 'exchange'];
        fields.forEach(function(field) {
            var cell = document.getElementById('col' + col + '_' + field);
            if (cell) {
                cell.textContent = data[field] || '-';
            }
        });
    });
}


/* --------------------------------------------
   6. CONTACT FORM SUBMIT
   Prevents default submit and shows a success message
   -------------------------------------------- */
function setupContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop the page from reloading

        var name = document.getElementById('cName').value.trim();

        if (name === '') {
            alert('Please enter your name.');
            return;
        }

        alert('Thank you, ' + name + '! Your enquiry has been submitted. We will get back to you within 24 hours.');
        form.reset();
    });
}


/* --------------------------------------------
   7. FADE-IN ON SCROLL
   Cards appear with a fade-up animation
   when they come into view
   -------------------------------------------- */
function setupFadeIn() {
    // Select all cards and feature boxes
    var elements = document.querySelectorAll('.card, .feature-box, .stat-box');

    // IntersectionObserver watches when an element enters the screen
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Stop watching after it fades in
            }
        });
    }, { threshold: 0.12 });

    elements.forEach(function(el) {
        observer.observe(el);
    });
}
