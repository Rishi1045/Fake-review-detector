from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import csv
import re
import os

def is_valid_product_url(url):
    """Check if URL is a product page rather than a search page or category page"""
    # Checks for search pages
    if "/search?" in url:
        return False
    
    # For Flipkart, product pages usually contain product-reviews or /p/ path
    if "flipkart.com" in url:
        return "/p/" in url or "/product-reviews/" in url or "pid=" in url
    
    # For Amazon, product pages usually contain /dp/ path
    if "amazon" in url:
        return "/dp/" in url
        
    # For non-specific cases, assume it's valid
    return True

def convert_to_review_url(product_url):
    # Replace /p/ with /product-reviews/
    if '/p/' in product_url:
        product_url = product_url.replace("/p/", "/product-reviews/")
    
    # Trim everything after marketplace=FLIPKART (if extra params exist)
    match = re.search(r"(.*marketplace=FLIPKART)", product_url)
    return match.group(1) if match else product_url

def detect_ecommerce_platform(url):
    """Detect which e-commerce platform the URL belongs to"""
    if "flipkart.com" in url:
        return "flipkart"
    elif "amazon" in url:
        return "amazon"
    elif "ebay" in url:
        return "ebay"
    else:
        return "unknown"

def scrape_flipkart_reviews(driver, product_url):
    """Scrape reviews from Flipkart"""
    reviews = []
    
    try:
        # Check if we landed on a search page or error page
        if "/search?" in driver.current_url or "error?" in driver.current_url:
            print("URL redirected to a search or error page. Not a valid product page.")
            return reviews
            
        # Try with different selectors for review blocks
        review_blocks = driver.find_elements(By.CLASS_NAME, "EKFha-")
        
        if not review_blocks:
            # Try alternative selectors as Flipkart sometimes changes their class names
            review_blocks = driver.find_elements(By.CSS_SELECTOR, ".t-ZTKy")
            
            if not review_blocks:
                print("No reviews found on Flipkart.")
                
                # Save page source for debugging (optional)
                with open("page_source.html", "w", encoding="utf-8") as f:
                    f.write(driver.page_source)
                print("Saved page source to page_source.html for debugging")
                
                return reviews
            
        for idx, block in enumerate(review_blocks, start=1):
            review_data = {"index": idx, "rating": "No Rating", "title": "No Title", "description": "No Review Text"}
            
            # Try different approaches to get the rating
            try:
                # Try several different CSS selectors for the rating
                selectors = [
                    By.CLASS_NAME, "XQDdHH",
                    By.CSS_SELECTOR, "[data-testid='rating-label']",
                    By.CSS_SELECTOR, "._1lRcqv ._3LWZlK",  # Common Flipkart rating selector
                    By.CSS_SELECTOR, "._3LWZlK",          # Another common Flipkart rating
                    By.CSS_SELECTOR, ".GVF6M",           # Yet another selector
                    By.CSS_SELECTOR, "div[id^='review-rating']"  # Generic selector pattern
                ]
                
                # Try each selector pair
                for i in range(0, len(selectors), 2):
                    try:
                        selector_type = selectors[i]
                        selector_value = selectors[i+1]
                        rating_element = block.find_element(selector_type, selector_value)
                        if rating_element:
                            rating_text = rating_element.text.strip()
                            if rating_text:
                                review_data["rating"] = rating_text
                                print(f"Found rating '{rating_text}' using selector: {selector_value}")
                                break
                    except:
                        continue
                
                # If no rating found yet, try to find any number between 1-5 in the review block
                if review_data["rating"] == "No Rating":
                    try:
                        block_text = block.text
                        # Look for patterns like "5★", "Rated 4", "Rating: 3", etc.
                        rating_patterns = [
                            r'(\d)[★\*]',                    # 5★
                            r'[Rr]at\w+\s*:?\s*(\d)',        # Rating: 4, Rated: 3
                            r'^(\d)[^\d]',                   # Starts with a digit
                            r'(\d)(\.\d)?\s*out of\s*\d'     # 4.5 out of 5
                        ]
                        
                        for pattern in rating_patterns:
                            match = re.search(pattern, block_text)
                            if match:
                                rating_num = match.group(1)
                                if 1 <= int(rating_num) <= 5:
                                    review_data["rating"] = rating_num
                                    print(f"Extracted rating '{rating_num}' using regex")
                                    break
                    except Exception as e:
                        print(f"Error extracting rating via text analysis: {e}")
            except Exception as e:
                print(f"Error in rating extraction: {e}")

            # Try different approaches to get the title
            try:
                title_element = block.find_element(By.CLASS_NAME, "z9E0IG")
                if title_element:
                    review_data["title"] = title_element.text.strip()
            except:
                try:
                    # Alternative selector
                    title_element = block.find_element(By.CSS_SELECTOR, "[data-testid='review-title']")
                    if title_element:
                        review_data["title"] = title_element.text.strip()
                except:
                    pass  # Use default "No Title"

            # Try different approaches to get the review body
            try:
                body_element = block.find_element(By.CSS_SELECTOR, ".ZmyHeo")
                if body_element:
                    review_data["description"] = body_element.text.strip()
            except:
                try:
                    # Alternative selector
                    body_element = block.find_element(By.CSS_SELECTOR, "[data-testid='review-description']")
                    if body_element:
                        review_data["description"] = body_element.text.strip()
                except:
                    pass  # Use default "No Review Text"
                
            reviews.append(review_data)
    except Exception as e:
        print(f"Error scraping Flipkart reviews: {e}")
    
    return reviews

def scrape_reviews_to_csv(product_url, output_file="flipkart_reviews.csv"):
    """Scrape reviews from the provided URL and save to CSV"""
    # Check URL validity first
    if not is_valid_product_url(product_url):
        print(f"❌ Not a valid product URL: {product_url}")
        print("Please provide a URL to a specific product page, not a search or category page.")
        return False
    
    # Set up Selenium with Chrome
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--headless=new")  # This hides the Chrome window
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # Add User-Agent to avoid detection as a bot
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36")
    
    driver = webdriver.Chrome(options=options)
    
    try:
        # Detect platform
        platform = detect_ecommerce_platform(product_url)
        
        # Navigate to the product URL
        driver.get(product_url)
        time.sleep(5)  # Give page time to load
        
        print(f"Loaded URL: {driver.current_url}")
        
        # Check if we were redirected to a different page
        if "/search?" in driver.current_url:
            print("❌ The URL was redirected to a search page. This is not a valid product URL.")
            return False
        
        # Scrape reviews based on the platform
        if platform == "flipkart":
            reviews = scrape_flipkart_reviews(driver, product_url)
        else:
            # For now, we'll use the flipkart scraper for all platforms
            # In a real-world scenario, you'd implement platform-specific scrapers
            reviews = scrape_flipkart_reviews(driver, product_url)
        
        if not reviews:
            print("❌ No reviews found. This might not be a product page or the product has no reviews.")
            # Create an empty CSV to avoid errors in subsequent steps
            with open(output_file, mode="w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow(["Sr No.", "Rating", "Review Title", "Description"])
            return True
        
        # Write reviews to CSV
        with open(output_file, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["Sr No.", "Rating", "Review Title", "Description"])
            
            for review in reviews:
                writer.writerow([
                    review["index"], 
                    review["rating"], 
                    review["title"], 
                    review["description"]
                ])
                
        print(f"✅ Scraped {len(reviews)} reviews and saved to {output_file}")
        return True
    except Exception as e:
        print(f"❌ Error during scraping: {e}")
        # Create an empty CSV to avoid errors in subsequent steps
        with open(output_file, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["Sr No.", "Rating", "Review Title", "Description"])
        return False
    finally:
        driver.quit()

# For direct command-line use
if __name__ == "__main__":
    # Check if the URL is provided as a command-line argument
    import sys
    
    if len(sys.argv) > 1:
        product_link = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else "flipkart_reviews.csv"
    else:
        # Use a default URL for testing
        product_link = "https://www.flipkart.com/boat-airdopes-131-bluetooth-headset/product-reviews/itm63eaf8c589b2b?pid=ACCFSDGXX3S6DVBG"
        output_file = "flipkart_reviews.csv"
    
    if "flipkart.com" in product_link:
        product_link = convert_to_review_url(product_link)
        
    scrape_reviews_to_csv(product_link, output_file)
