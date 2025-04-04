from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import csv
import re

def convert_to_review_url(product_url):
    # Replace /p/ with /product-reviews/
    product_url = product_url.replace("/p/", "/product-reviews/")
    
    # Trim everything after marketplace=FLIPKART (if extra params exist)
    match = re.search(r"(.*marketplace=FLIPKART)", product_url)
    return match.group(1) if match else product_url

def scrape_reviews_to_csv(product_url, output_file="flipkart_reviews.csv"):
    # Set up Selenium with Chrome
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--headless=new")  # This hides the Chrome window
    driver = webdriver.Chrome(options=options)
    driver.get(product_url)
    time.sleep(5)  # Give page time to load

    # Open CSV file for writing
    with open(output_file, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Sr No.", "Rating", "Review Title", "Description"])

        try:
            review_blocks = driver.find_elements(By.CLASS_NAME, "EKFha-")

            if not review_blocks:
                print("❌ No reviews found.")
                return

            print("✅ Scraped Reviews:\n")

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
                    body = block.find_element(By.CSS_SELECTOR, ".ZmyHeo div > div").text.strip()
                except:
                    body = "No Review Text"

                print(f"{idx}. ⭐ {rating} - {title}\n{body}\n")
                writer.writerow([idx, rating, title, body])

        except Exception as e:
            print(f"❌ Error scraping reviews: {e}")

    driver.quit()
    print(f"📁 Data saved to {output_file}")

# Example usage





product_link = "https://www.flipkart.com/boat-airdopes-131-bluetooth-headset/product-reviews/itm63eaf8c589b2b?pid=ACCFSDGXX3S6DVBG"

final_link = convert_to_review_url(product_link)
extracted_reviews = scrape_reviews_to_csv(final_link)
