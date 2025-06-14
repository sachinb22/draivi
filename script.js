document.addEventListener("DOMContentLoaded", function () {

  // Navbar Scroll Behavior
let lastScrollPosition = 0;
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar.offsetHeight;

window.addEventListener('scroll', function() {
  const currentScrollPosition = window.pageYOffset;
  
  if (currentScrollPosition <= 100) {
    // At top of page
    navbar.classList.remove('scrolled');
    navbar.classList.remove('hidden');
  } else {
    navbar.classList.add('scrolled');
    
    // Scroll direction detection
    if (currentScrollPosition > lastScrollPosition) {
      // Scrolling down
      if (currentScrollPosition > navbarHeight) {
        navbar.classList.add('hidden');
      }
    } else {
      // Scrolling up
      navbar.classList.remove('hidden');
    }
  }
  
  lastScrollPosition = currentScrollPosition;
});


  // Mobile Menu Toggle
  const hamburger = document.getElementById("hamburger");
  const sideDrawer = document.getElementById("sideDrawer");
  const closeDrawer = document.getElementById("closeDrawer");

  hamburger.addEventListener("click", function () {
    sideDrawer.classList.add("open");
  });

  closeDrawer.addEventListener("click", function () {
    sideDrawer.classList.remove("open");
  });

  // Close drawer when clicking outside
  sideDrawer.addEventListener("click", function (e) {
    if (e.target === sideDrawer) {
      sideDrawer.classList.remove("open");
    }
  });

  // Loan Application Form
const loanForm = document.getElementById("loanForm");
const loanAmount = document.getElementById("loanAmount");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const consent = document.getElementById("consent");
const consentError = document.getElementById('consentError');

// Generate loan amount options
for (let i = 1000; i <= 20000; i += 1000) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `€${i.toLocaleString()}`;
  loanAmount.appendChild(option);
}

// Initialize with first loan amount
if (loanAmount.options.length > 1) {
  loanAmount.selectedIndex = 1;
  updatePaymentEstimate();
}

// Calculate monthly payment (5% interest over 1 year)
function calculateMonthlyPayment(amount, years = 1, annualRate = 0.05) {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;
  return (
    (amount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
  );
}

// Update payment estimate
function updatePaymentEstimate() {
  const amount = parseFloat(loanAmount.value);
  if (!isNaN(amount)) {
    const monthlyPayment = calculateMonthlyPayment(amount);
    document.getElementById("estimatedAmount").textContent =
      monthlyPayment.toFixed(2);
  }
}

// Validation functions
function validateFullName() {
  const value = fullName.value.trim();
  const regex = /^[a-zA-ZäöåÄÖÅ\s-]+$/;

  if (!value) {
    showError(fullNameError, "Full name is required");
    return false;
  }

  if (!regex.test(value)) {
    showError(fullNameError, "Only letters and hyphens allowed");
    return false;
  }

  if (value.length < 3) {
    showError(fullNameError, "Name must be at least 3 characters");
    return false;
  }

  hideError(fullNameError);
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    showError(emailError, "Email is required");
    return false;
  }

  if (!regex.test(value)) {
    showError(emailError, "Please enter a valid email");
    return false;
  }

  hideError(emailError);
  return true;
}

function validatePhone() {
  const value = phone.value.trim();
  const regex = /^(\+358|0)\s?(\d{2,3})\s?(\d{5,7})$/;

  if (!value) {
    showError(phoneError, "Phone number is required");
    return false;
  }

  if (!regex.test(value)) {
    showError(phoneError, "Please enter a valid Finnish number");
    return false;
  }

  hideError(phoneError);
  return true;
}

function validateLoanAmount() {
  if (loanAmount.value === "Select amount" || !loanAmount.value) {
    showError(loanAmountError, "Please select a loan amount");
    return false;
  }
  hideError(loanAmountError);
  return true;
}

function validateConsent() {
  if (!consent.checked) {
    showError(consentError, "You must agree to the terms and conditions");
    const checkboxWrapper = consent.closest('.checkbox-group');
    if (checkboxWrapper) {
      checkboxWrapper.classList.add('has-error');
    }
    return false;
  }
  hideError(consentError);
  const checkboxWrapper = consent.closest('.checkbox-group');
  if (checkboxWrapper) {
    checkboxWrapper.classList.remove('has-error');
  }
  return true;
}

// Helper functions
function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
  
  const input = element.previousElementSibling;
  if (input) {
    if (input.type === 'checkbox') {
      const wrapper = input.closest('.checkbox-group');
      if (wrapper) {
        wrapper.classList.add('has-error');
      }
    } else {
      input.classList.add('has-error');
    }
  }
}

function hideError(element) {
  element.textContent = "";
  element.style.display = "none";
  
  const input = element.previousElementSibling;
  if (input) {
    if (input.type === 'checkbox') {
      const wrapper = input.closest('.checkbox-group');
      if (wrapper) {
        wrapper.classList.remove('has-error');
      }
    } else {
      input.classList.remove('has-error');
    }
  }
}

// Event listeners for real-time validation
loanAmount.addEventListener("change", function () {
  validateLoanAmount();
  updatePaymentEstimate();
});

// Form submission
loanForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validate all fields
  const isNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isAmountValid = validateLoanAmount();
  const isConsentValid = validateConsent();

  if (isNameValid && isEmailValid && isPhoneValid && isAmountValid && isConsentValid) {
    // If Form is valid - showing  success alert and submit
    alert("Form submitted successfully! We'll contact you soon.");

    
    
    // here we will submit the form data to backend
    const formData = {
      loanAmount: loanAmount.value,
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      consent: consent.checked
    };
    console.log('Form data:', formData);
    loanForm.reset();
    
    // Optional: Reset form after submission
    // loanForm.reset();
    // loanAmount.selectedIndex = 1;
    // updatePaymentEstimate();
  } else {
    // Focus on first invalid field
    const firstInvalid = loanForm.querySelector(".has-error, [aria-invalid='true']");
    if (firstInvalid) firstInvalid.focus();
  }
});

  // Countdown Timer
// Set target date based on URL parameter
const urlParams = new URLSearchParams(window.location.search);
const counterType = urlParams.get('counter');

let targetDate;
let targetLabel;

if (counterType === 'newyear') {
  targetDate = new Date('December 31, 2025 23:59:59').getTime();
  targetLabel = "New Year's Eve, December 31, 2025";
} else {
  // Default to Midsummer Eve
  targetDate = new Date('June 20, 2025 23:59:59').getTime();
  targetLabel = "Midsummer Eve, June 20, 2025";
}

// Update the target date label
document.getElementById('target-date-label').textContent = targetLabel;

// Update the countdown every second
const countdown = setInterval(function() {
  const now = new Date().getTime();
  const distance = targetDate - now;
  
  // Time calculations
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  // Display the result
  document.getElementById('days').textContent = days.toString().padStart(2, '0');
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  
  // If the countdown is finished
  if (distance < 0) {
    clearInterval(countdown);
    document.querySelector('.countdown-container').innerHTML = 
      '<div class="countdown-ended">The offer has expired</div>';
  }
}, 1000);


const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevButton = document.querySelector('.testimonial-nav .prev');
  const nextButton = document.querySelector('.testimonial-nav .next');
  const currentCounter = document.querySelector('.counter .current');
  const totalCounter = document.querySelector('.counter .total');
  let currentIndex = 1;
  const totalTestimonials = testimonialCards.length;

  // Set total testimonials counter
  totalCounter.textContent = totalTestimonials;

  // Update active testimonial
  function updateTestimonial(index) {
    testimonialCards.forEach(card => {
      card.classList.remove('active');
      if (parseInt(card.dataset.index) === index) {
        card.classList.add('active');
      }
    });

    currentCounter.textContent = index;
    
    // Update button states
    prevButton.disabled = index === 1;
    nextButton.disabled = index === totalTestimonials;
  }

  // Next testimonial
  nextButton.addEventListener('click', function() {
    if (currentIndex < totalTestimonials) {
      currentIndex++;
      updateTestimonial(currentIndex);
    }
  });

  // Previous testimonial
  prevButton.addEventListener('click', function() {
    if (currentIndex > 1) {
      currentIndex--;
      updateTestimonial(currentIndex);
    }
  });

  // Initialize
  updateTestimonial(currentIndex);

  // Auto-rotate testimonials (optional)
  let autoRotate = setInterval(() => {
    if (currentIndex < totalTestimonials) {
      currentIndex++;
    } else {
      currentIndex = 1;
    }
    updateTestimonial(currentIndex);
  }, 5000);

  // Pause auto-rotate on hover
  const cardsContainer = document.querySelector('.testimonial-cards');
  cardsContainer.addEventListener('mouseenter', () => {
    clearInterval(autoRotate);
  });
  cardsContainer.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => {
      if (currentIndex < totalTestimonials) {
        currentIndex++;
      } else {
        currentIndex = 1;
      }
      updateTestimonial(currentIndex);
    }, 5000);
  });


  //Faq section 
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      // Toggle aria-expanded attribute
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle the answer visibility
      const answer = this.nextElementSibling;
      answer.setAttribute('aria-hidden', isExpanded);
      
      // Close other open FAQs
      if (!isExpanded) {
        faqQuestions.forEach(q => {
          if (q !== question && q.getAttribute('aria-expanded') === 'true') {
            q.setAttribute('aria-expanded', 'false');
            q.nextElementSibling.setAttribute('aria-hidden', 'true');
          }
        });
      }
    });
    
    // Initialize attributes
    question.setAttribute('aria-expanded', 'false');
    question.nextElementSibling.setAttribute('aria-hidden', 'true');
  });


});


