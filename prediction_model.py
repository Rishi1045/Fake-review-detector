# predict_real_reviews.py

import pandas as pd
import joblib
import sklearn
import os
import sys

def predict_fake_reviews(input_file='flipkart_reviews.csv', output_file='real_flipkart_reviews.csv'):
    """
    Process the reviews and identify which ones are real/fake
    
    Args:
        input_file (str): Path to the CSV file containing scraped reviews
        output_file (str): Path to save the filtered real reviews
        
    Returns:
        bool: True if processing was successful, False otherwise
    """
    try:
        # Check if input file exists
        if not os.path.exists(input_file):
            print(f"❌ Input file {input_file} not found")
            return False
            
        # Load the scraped reviews
        df = pd.read_csv(input_file)
        df = df.dropna(subset=['Description'])
        
        if df.empty:
            print("❌ No reviews found in the input file")
            return False
        
        # Load trained model and vectorizer
        model = joblib.load('fake_review_model.pkl')
        tfidf = joblib.load('tfidf_vectorizer.pkl')
        
        # Transform text and predict
        X = tfidf.transform(df['Description'])
        df['predicted_label'] = model.predict(X)
        
        # Filter only real reviews (assuming "CG" = real)
        real_reviews = df[df['predicted_label'] == "CG"]
        
        # Save results
        real_reviews.to_csv(output_file, index=False)
        
        print(f"✅ Found {len(real_reviews)} real reviews out of {len(df)} total")
        print(f"✅ Real reviews saved to '{output_file}'")
        
        return True
    
    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        return False

# For direct command-line use
if __name__ == "__main__":
    # Check if input/output files are provided as command-line arguments
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'flipkart_reviews.csv'
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'real_flipkart_reviews.csv'
    
    predict_fake_reviews(input_file, output_file)
