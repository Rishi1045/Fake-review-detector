// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current FAQ item
        item.classList.toggle('active');
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Here you would typically send the data to your server
    console.log('Form submitted:', formData);
    
    // Show success message (in a real app, do this after successful submission)
    alert('Thank you for your message! We\'ll get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Add active class to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
            document.querySelector(`.mobile-menu a[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.remove('active');
            document.querySelector(`.mobile-menu a[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
});

// Add glassmorphism effect on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.9)';
        navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    }
});

// URL Input Validation and Animation
const urlInput = document.querySelector('.url-input');
const analyzeBtn = document.querySelector('.search-box .btn');

urlInput.addEventListener('input', () => {
    const isValidUrl = urlInput.value.trim() !== '' && 
                      (urlInput.value.startsWith('http://') || 
                       urlInput.value.startsWith('https://'));
    
    analyzeBtn.disabled = !isValidUrl;
    
    if (isValidUrl) {
        analyzeBtn.classList.remove('disabled');
    } else {
        analyzeBtn.classList.add('disabled');
    }
});

// Analyze button click handler
analyzeBtn.addEventListener('click', () => {
    if (urlInput.value.trim() === '') {
        alert('Please enter a product URL');
        return;
    }
    
    // Add loading animation
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    analyzeBtn.disabled = true;
    
    // Simulate analysis (in a real app, you would send to server)
    setTimeout(() => {
        // Reset button
        analyzeBtn.innerHTML = 'Analyze';
        analyzeBtn.disabled = false;
        
        // Show success message
        alert(`Analysis complete for: ${urlInput.value}`);
    }, 2000);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition < hero.offsetHeight) {
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

// Add animation to feature cards on scroll
const featureCards = document.querySelectorAll('.feature-card');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
});