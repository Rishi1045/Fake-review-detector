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
            
            // Validate URL format
            const url = urlInput.value.trim();
            
            // Check if URL is likely a search page
            if (url.includes('/search?') || url.includes('&q=') || url.includes('?q=')) {
                alert('The URL appears to be a search results page. Please provide a URL for a specific product with reviews.');
                return;
            }
    
    // Add loading animation
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    analyzeBtn.disabled = true;
    
            try {
                console.log('Sending URL to backend:', url);
                
                // Send URL to backend for analysis
                const response = await fetch('/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: url }),
                });
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Error response:', errorData);
                    
                    // Show specific error message
                    if (errorData.error) {
                        throw new Error(errorData.error);
                    } else {
                        throw new Error(`Server returned ${response.status}`);
                    }
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
        console.log('Displaying results with data:', data);
        
        // Update average rating
        const ratingValueElement = document.querySelector('.rating-value');
        if (ratingValueElement) {
            // Make sure we're using the correct value (data.average_rating could be 0)
            ratingValueElement.textContent = data.average_rating;
            console.log(`Setting average rating display to: ${data.average_rating}`);
        }
        
        // Update total reviews count - make sure we're using the review count, not the total_ratings
        const reviewCountElement = document.querySelector('.review-count');
        if (reviewCountElement) {
            reviewCountElement.textContent = data.total_reviews;
            console.log(`Setting review count display to: ${data.total_reviews}`);
        }
        
        // Update star rating display
        updateStarRating(data.average_rating);
        
        // Update rating distribution if available
        if (data.rating_distribution && Array.isArray(data.rating_distribution)) {
            updateRatingDistribution(data.rating_distribution);
        }
        
        // Clear previous reviews
        const reviewList = document.querySelector('.review-list');
        if (!reviewList) {
            console.error('Review list element not found');
            return;
        }
        
        reviewList.innerHTML = '';
        
        // Add reviews to the list
        if (data.reviews && data.reviews.length > 0) {
            console.log(`Displaying ${data.reviews.length} reviews`);
            
            data.reviews.forEach((review, index) => {
                console.log(`Review ${index + 1}:`, review);
                
                const reviewEl = document.createElement('div');
                reviewEl.className = 'review-item';
                
                let ratingDisplay = review.rating;
                if (typeof ratingDisplay === 'string' && !ratingDisplay.includes('★')) {
                    ratingDisplay = ratingDisplay + '★';
                }
                
                reviewEl.innerHTML = `
                    <div class="review-header">
                        <div class="review-rating">
                            <span>${ratingDisplay}</span>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>${review.title || 'No Title'}</h4>
                    </div>
                    <div class="review-content">
                        <p>${review.description || 'No description available'}</p>
                    </div>
                `;
                reviewList.appendChild(reviewEl);
            });
        } else {
            reviewList.innerHTML = '<p class="no-reviews">No authentic reviews found.</p>';
            console.log('No reviews to display');
        }
    }

    // Function to update star rating display
    function updateStarRating(rating) {
        console.log('Updating star rating with value:', rating);
        
        const stars = document.querySelectorAll('.rating-stars i');
        if (!stars || stars.length === 0) {
            console.error('Star elements not found');
            return;
        }
        
        // Convert rating to number if it's a string
        let numericRating = rating;
        if (typeof rating === 'string') {
            numericRating = parseFloat(rating) || 0;
        }
        
        // If rating is 0 but we have reviews, show half star for the first star
        const reviewCount = document.querySelector('.review-count');
        const reviewCountValue = reviewCount ? parseInt(reviewCount.textContent) : 0;
        
        if (numericRating === 0 && reviewCountValue > 0) {
            console.log('Rating is 0 but we have reviews, showing at least half star');
            numericRating = 3.0; // Default to a neutral rating
        }
        
        // Enforce range 0-5
        numericRating = Math.max(0, Math.min(5, numericRating));
        
        console.log('Using numeric rating:', numericRating);
        
        const fullStars = Math.floor(numericRating);
        const hasHalfStar = numericRating % 1 >= 0.5;
        
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

    // Function to update the rating distribution visualization
    function updateRatingDistribution(distributionData) {
        console.log('Updating rating distribution with:', distributionData);
        
        // Find the max count to normalize percentages if needed
        let maxCount = 0;
        distributionData.forEach(item => {
            if (item.count > maxCount) maxCount = item.count;
        });
        
        // Process each rating level
        distributionData.forEach(item => {
            const rating = item.rating;
            const count = item.count;
            
            // Calculate percentage based on max count if all counts are 0
            const usePercentage = item.percentage > 0 ? item.percentage : 0;
            
            // Ensure we show at least a small bar for ratings that have counts
            const displayPercentage = count > 0 ? Math.max(5, usePercentage) : 0;
            
            console.log(`Rating ${rating}: Count=${count}, Percentage=${usePercentage}%, Display=${displayPercentage}%`);
            
            // Update the progress bar width
            const progressBar = document.querySelector(`.rating-${rating}-bar`);
            if (progressBar) {
                // Set width directly
                progressBar.style.width = `${displayPercentage}%`;
                
                // Add animation class
                progressBar.classList.add('animate-bar');
                
                // Special case: if all counts are 0 but we have reviews, show equal bars
                if (maxCount === 0 && distributionData.some(d => d.count > 0)) {
                    progressBar.style.width = '20%'; // Equal distribution
                }
            } else {
                console.error(`Progress bar element for rating ${rating} not found`);
            }
            
            // Update the count
            const countElement = document.querySelector(`.rating-${rating}-count`);
            if (countElement) {
                countElement.textContent = count;
            } else {
                console.error(`Count element for rating ${rating} not found`);
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