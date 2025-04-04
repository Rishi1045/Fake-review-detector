from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import csv
import re
import os

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
        review_blocks = driver.find_elements(By.CLASS_NAME, "EKFha-")
        
        if not review_blocks:
            print("No reviews found on Flipkart.")
            return reviews
            
        for idx, block in enumerate(review_blocks, start=1):
            # Rating
            try:
                rating = block.find_element(By.CLASS_NAME, "XQDdHH").text.strip()
            except:
                rating = "No Rating"

            # Review Title
            try:
                title = block.find_element(By.CLASS_NAME, "z9E0IG").text.strip()
            except:
                title = "No Title"

            # Review Description
            try:
                body = block.find_element(By.CSS_SELECTOR, ".ZmyHeo").text.strip()
            except:
                body = "No Review Text"
                
            reviews.append({
                "index": idx,
                "rating": rating,
                "title": title,
                "description": body
            })
    except Exception as e:
        print(f"Error scraping Flipkart reviews: {e}")
    
    return reviews

def scrape_reviews_to_csv(product_url, output_file="flipkart_reviews.csv"):
    """Scrape reviews from the provided URL and save to CSV"""
    # Set up Selenium with Chrome
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--headless=new")  # This hides the Chrome window
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(options=options)
    
    try:
        # Detect platform
        platform = detect_ecommerce_platform(product_url)
        
        # Navigate to the product URL
        driver.get(product_url)
        time.sleep(5)  # Give page time to load
        
        # Scrape reviews based on the platform
        if platform == "flipkart":
            reviews = scrape_flipkart_reviews(driver, product_url)
        else:
            # For now, we'll use the flipkart scraper for all platforms
            # In a real-world scenario, you'd implement platform-specific scrapers
            reviews = scrape_flipkart_reviews(driver, product_url)
        
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
