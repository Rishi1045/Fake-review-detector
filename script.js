// Wrap all code in a DOMContentLoaded event handler to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

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

    if (contactForm) {
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
    }

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
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

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
    const analyzeBtn = document.querySelector('.analyze-btn');

    console.log('URL input element found:', urlInput !== null);
    console.log('Analyze button element found:', analyzeBtn !== null);

    if (urlInput) {
        urlInput.addEventListener('input', () => {
            const isValidUrl = urlInput.value.trim() !== '' && 
                            (urlInput.value.startsWith('http://') || 
                            urlInput.value.startsWith('https://'));
            
            if (analyzeBtn) {
                analyzeBtn.disabled = !isValidUrl;
                
                if (isValidUrl) {
                    analyzeBtn.classList.remove('disabled');
                } else {
                    analyzeBtn.classList.add('disabled');
                }
            }
        });
    }

    // Analyze button click handler
    if (analyzeBtn) {
        console.log('Adding click event listener to analyze button');
        
        analyzeBtn.addEventListener('click', async () => {
            console.log('Analyze button clicked');
            
            if (!urlInput || urlInput.value.trim() === '') {
                alert('Please enter a product URL');
                return;
            }
            
            // Add loading animation
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            analyzeBtn.disabled = true;
            
            try {
                console.log('Sending URL to backend:', urlInput.value.trim());
                
                // Send URL to backend for analysis
                const response = await fetch('/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: urlInput.value.trim() }),
                });
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Error response:', errorData);
                    throw new Error(errorData.error || `Server returned ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Response data:', data);
                
                // Display results
                displayResults(data);
                
                // Show results section
                const resultsSection = document.getElementById('results');
                if (resultsSection) {
                    resultsSection.style.display = 'block';
                    
                    // Scroll to results
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                }
                
            } catch (error) {
                console.error('Error during analysis:', error);
                alert('Error analyzing reviews: ' + error.message);
            } finally {
                // Reset button
                analyzeBtn.innerHTML = 'Analyze';
                analyzeBtn.disabled = false;
            }
        });
        
        console.log('Click event listener added to analyze button');
    } else {
        console.error('Analyze button not found in the DOM');
    }

    // Function to display analysis results
    function displayResults(data) {
        // Update average rating
        document.querySelector('.rating-value').textContent = data.average_rating;
        
        // Update total reviews count
        document.querySelector('.review-count').textContent = data.total_reviews;
        
        // Update star rating display
        updateStarRating(data.average_rating);
        
        // Clear previous reviews
        const reviewList = document.querySelector('.review-list');
        reviewList.innerHTML = '';
        
        // Add reviews to the list
        if (data.reviews && data.reviews.length > 0) {
            data.reviews.forEach(review => {
                const reviewEl = document.createElement('div');
                reviewEl.className = 'review-item';
                reviewEl.innerHTML = `
                    <div class="review-header">
                        <div class="review-rating">
                            <span>${review.rating}</span>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>${review.title}</h4>
                    </div>
                    <div class="review-content">
                        <p>${review.description}</p>
                    </div>
                `;
                reviewList.appendChild(reviewEl);
            });
        } else {
            reviewList.innerHTML = '<p class="no-reviews">No authentic reviews found.</p>';
        }
    }

    // Function to update star rating display
    function updateStarRating(rating) {
        const stars = document.querySelectorAll('.rating-stars i');
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        stars.forEach((star, index) => {
            if (index < fullStars) {
                star.className = 'fas fa-star';
            } else if (index === fullStars && hasHalfStar) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
        });
    }

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrollPosition = window.scrollY;
        
        if (hero && scrollPosition < hero.offsetHeight) {
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
    
    console.log('All event listeners and animations initialized');
});
