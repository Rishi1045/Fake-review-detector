from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
import os
from scraper import scrape_reviews_to_csv, convert_to_review_url, detect_ecommerce_platform
from prediction_model import predict_fake_reviews

app = Flask(__name__, static_folder=".", static_url_path="", template_folder="templates")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/debug")
def debug():
    return send_file('debug.html')

@app.route("/analyze", methods=["POST"])
def analyze():
    print("Analyze endpoint called")
    try:
        # Get URL from the request
        data = request.get_json()
        print(f"Received data: {data}")
        
        product_url = data.get("url")
        
        if not product_url:
            return jsonify({"error": "No URL provided"}), 400
        
        print(f"Analyzing URL: {product_url}")
        
        # Check if Flipkart URL and convert if needed
        platform = detect_ecommerce_platform(product_url)
        if platform == "flipkart":
            product_url = convert_to_review_url(product_url)
        
        # Scrape reviews and save to CSV
        scrape_success = scrape_reviews_to_csv(product_url, "flipkart_reviews.csv")
        
        if not scrape_success:
            return jsonify({"error": "Failed to scrape reviews"}), 500
        
        # Run prediction model
        predict_success = predict_fake_reviews("flipkart_reviews.csv", "real_flipkart_reviews.csv")
        
        if not predict_success:
            return jsonify({"error": "Failed to process reviews"}), 500
        
        # Read results from the CSV file
        if os.path.exists("real_flipkart_reviews.csv"):
            real_reviews = pd.read_csv("real_flipkart_reviews.csv")
            
            if real_reviews.empty:
                return jsonify({
                    "success": True,
                    "average_rating": 0,
                    "reviews": [],
                    "total_reviews": 0
                })
            
            # Prepare results for frontend
            review_data = []
            for _, row in real_reviews.iterrows():
                review_data.append({
                    "rating": row.get("Rating", "N/A"),
                    "title": row.get("Review Title", "No Title"),
                    "description": row.get("Description", "No Description")
                })
            
            # Calculate average rating
            try:
                # Convert ratings to numeric values, ignoring non-numeric ratings
                ratings = []
                for r in review_data:
                    try:
                        # For Flipkart, ratings are like "5★" or "4★"
                        rating_str = r.get("rating", "0")
                        if isinstance(rating_str, str):
                            # Extract the numeric part
                            rating_value = float(rating_str.split('★')[0])
                            ratings.append(rating_value)
                    except:
                        continue
                
                avg_rating = sum(ratings) / len(ratings) if ratings else 0
            except Exception as e:
                print(f"Error calculating average rating: {e}")
                avg_rating = 0
            
            return jsonify({
                "success": True,
                "average_rating": round(avg_rating, 1),
                "reviews": review_data,
                "total_reviews": len(review_data)
            })
        else:
            return jsonify({"error": "No reviews found"}), 404
    
    except Exception as e:
        print(f"Error in analyze endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3000) 
