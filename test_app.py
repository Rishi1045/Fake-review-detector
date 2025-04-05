"""
Simple test script to verify the backend functionality.
"""

import os
from scraper import scrape_reviews_to_csv, convert_to_review_url
from prediction_model import predict_fake_reviews
import pandas as pd

def test_review_workflow():
    """
    Test the complete workflow from scraping to prediction
    """
    # Test URL - Flipkart product with reviews
    test_url = "https://www.flipkart.com/boat-airdopes-131-bluetooth-headset/product-reviews/itm63eaf8c589b2b?pid=ACCFSDGXX3S6DVBG"
    
    print(f"Testing with URL: {test_url}")
    
    # Convert URL if needed
    if "flipkart.com" in test_url:
        test_url = convert_to_review_url(test_url)
        print(f"Converted URL: {test_url}")
    
    # Test scraping
    print("\nTesting scraper...")
    scrape_success = scrape_reviews_to_csv(test_url, "test_reviews.csv")
    
    if not scrape_success:
        print("❌ Scraping failed")
        return False
    
    if not os.path.exists("test_reviews.csv"):
        print("❌ CSV file was not created")
        return False
    
    # Load scraped data
    scraped_data = pd.read_csv("test_reviews.csv")
    print(f"✅ Successfully scraped {len(scraped_data)} reviews")
    
    # Test prediction model
    print("\nTesting prediction model...")
    predict_success = predict_fake_reviews("test_reviews.csv", "test_real_reviews.csv")
    
    if not predict_success:
        print("❌ Prediction failed")
        return False
    
    if not os.path.exists("test_real_reviews.csv"):
        print("❌ Prediction result file was not created")
        return False
    
    # Load prediction results
    real_reviews = pd.read_csv("test_real_reviews.csv")
    print(f"✅ Found {len(real_reviews)} authentic reviews")
    
    # Clean up test files
    try:
        os.remove("test_reviews.csv")
        os.remove("test_real_reviews.csv")
        print("\n✅ Cleanup successful")
    except:
        print("\n⚠️ Could not clean up test files")
    
    return True

if __name__ == "__main__":
    print("Starting test of Fake Review Detector workflow\n")
    result = test_review_workflow()
    
    if result:
        print("\n✅ All tests passed successfully!")
    else:
        print("\n❌ Tests failed") 