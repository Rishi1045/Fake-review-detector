from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time

# Configure Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,1080")

# Initialize WebDriver
driver = webdriver.Chrome(options=chrome_options)

# Function to scrape only user reviews
def scrape_reviews(product_url):
    driver.get(product_url)
    time.sleep(5)  # Allow page to load

    reviews = []

    try:
        # ✅ Refined XPath to extract **only user reviews**
        review_elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, '//div[contains(@class, "t-ZTKy")]'))
        )

        for review in review_elements:
            reviews.append(review.text.strip())  # Extract and clean text

    except Exception as e:
        print(f"❌ Error loading reviews: {e}")

    return reviews

# Example usage
if __name__ == "__main__":
    product_link = "https://www.flipkart.com/boat-airdopes-131-bluetooth-headset/product-reviews/itm63eaf8c589b2b?pid=ACCFSDGXX3S6DVBG"
    extracted_reviews = scrape_reviews(product_link)

    if extracted_reviews:
        print("\n🔹 Scraped Reviews:")
        for i, review in enumerate(extracted_reviews, 1):
            print(f"{i}. {review}")

        # Save to CSV
        df = pd.DataFrame({"Reviews": extracted_reviews})
        df.to_csv("flipkart_reviews.csv", index=False, encoding="utf-8")
        print("\n✅ Reviews saved to flipkart_reviews.csv")

    else:
        print("❌ No reviews found.")

    driver.quit()  # Close browser
