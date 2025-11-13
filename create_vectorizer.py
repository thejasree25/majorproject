import pickle
from sklearn.feature_extraction.text import CountVectorizer

print("🔧 Creating new vectorizer...")

# Some basic training data (you can customize it later)
texts = [
    "food is good",
    "service was bad",
    "ambience is excellent",
    "worst experience",
    "amazing food and friendly staff",
    "poor hygiene and cold food"
]

# Fit the CountVectorizer
cv = CountVectorizer()
cv.fit(texts)

# Save it as pickle
with open('static/model/vectorizer.pickle', 'wb') as f:
    pickle.dump(cv, f)

print("✅ vectorizer.pickle created successfully at static/model/vectorizer.pickle")
