# predict_real_reviews.py

import pandas as pd
import joblib
import sklearn

# Load test data (make sure it has a '_text' column)
df = pd.read_csv('flipkart_reviews.csv')
df = df.dropna(subset=['Description'])

# Load trained model and vectorizer
model = joblib.load('fake_review_model.pkl')
tfidf = joblib.load('tfidf_vectorizer.pkl')

# Transform text and predict
X = tfidf.transform(df['Description'])
df['predicted_label'] = model.predict(X)

print("Sample reviews:")
print(df['Description'].tail())

# Filter only real reviews (assuming 1 = real)
real_reviews = df[df['predicted_label'] == "CG"]

# Save results
real_reviews.to_csv('real_flipkart_reviews.csv', index=False)
print("✅ Real reviews saved to 'real_flipkart_reviews.csv'")
