# Fake Review Detection System

This application integrates web scraping with AI-based fake review detection to help users identify authentic product reviews.

## Features

- Scrapes product reviews from e-commerce websites (Currently supports Flipkart)
- Uses machine learning(ML) and natural language processing(NLP) to detect and filter out fake reviews
- Does Sentimental Analysis
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

## Demo

<img width="1440" alt="Screenshot 2025-04-05 at 8 42 29 AM" src="https://github.com/user-attachments/assets/bd2e0eb5-deda-49f8-bd6a-295d269622e6" />

<img width="1440" alt="Screenshot 2025-04-05 at 8 44 45 AM" src="https://github.com/user-attachments/assets/32b00f2d-ddd4-408b-a8c5-c701d8eb1a99" />

<img width="1440" alt="Screenshot 2025-04-05 at 8 45 02 AM" src="https://github.com/user-attachments/assets/3311f93e-29ee-4548-81a5-0e98e9c3928f" />

<img width="1440" alt="Screenshot 2025-04-05 at 8 45 17 AM" src="https://github.com/user-attachments/assets/41344f9e-29fa-458d-8fb4-5127b2692071" />

<img width="1440" alt="Screenshot 2025-04-05 at 8 45 36 AM" src="https://github.com/user-attachments/assets/fd657791-8cfe-4bd8-b5e9-fd7ddbb05bb4" />

<img width="1440" alt="Screenshot 2025-04-05 at 8 45 51 AM" src="https://github.com/user-attachments/assets/39a9fab6-9854-4f9a-a139-aa62ef0c7f36" />
