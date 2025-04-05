# Fake Review Detection System

This application integrates web scraping with AI-based fake review detection to help users identify authentic product reviews.

## Features

- Scrapes product reviews from e-commerce websites (Currently supports Flipkart)
- Uses machine learning to detect and filter out fake reviews
- Displays only authentic reviews with ratings and details
- Simple and intuitive user interface

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Chrome browser (for the Selenium web scraping)
- ChromeDriver (will be automatically downloaded)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install the required dependencies
   ```
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the Flask server
   ```
   python app.py
   ```

2. Open your web browser and navigate to
   ```
   http://127.0.0.1:5000
   ```

3. Enter a product URL in the search box and click "Analyze"

## How It Works

1. The user submits a product URL through the web interface
2. The backend scrapes all reviews for the product
3. The machine learning model processes the reviews and filters out fake ones
4. The frontend displays only authentic reviews along with an average rating

## Project Structure

- `app.py` - Flask application that serves as the backend
- `scraper.py` - Web scraping module that extracts reviews from e-commerce sites
- `prediction_model.py` - ML model interface that identifies fake reviews
- `templates/index.html` - Frontend HTML template
- `style.css` - CSS styling for the frontend
- `script.js` - Frontend JavaScript logic
- `fake_review_model.pkl` - Trained machine learning model
- `tfidf_vectorizer.pkl` - TF-IDF vectorizer for text processing

## Limitations

- Currently best supports Flipkart product pages
- Limited support for other e-commerce platforms
- Web scraping is dependent on the website's HTML structure and may break if the site changes 