import re
import string
import pickle
import numpy as np
from nltk.stem import PorterStemmer

ps = PorterStemmer()

print("🔄 Loading vectorizer...")
with open('static/model/vectorizer.pickle', 'rb') as f:
    cv = pickle.load(f)
print("✅ Vectorizer loaded successfully")

print("🔄 Loading model...")
with open('static/model/model.pickle', 'rb') as f:
    model = pickle.load(f)
print("✅ Model loaded successfully")

def preprocessing(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)
    text = " ".join(ps.stem(word) for word in text.split())
    return text

def vectorizer(text):
    return cv.transform([text])

def get_prediction(vectorized_text, raw_text=None):
    """Predict sentiment using model + rule-based override."""
    print("🔮 Predicting sentiment...")

    if raw_text:
        text = raw_text.lower()
        positive_words = ["good", "great", "excellent", "nice", "amazing", "happy", "love", "wonderful", "awesome"]
        negative_words = ["bad", "worst", "ugly", "hate", "terrible", "poor", "awful", "sad", "disgusting"]
        neutral_words = ["ok", "fine", "average", "normal", "neutral"]

        if any(word in text for word in negative_words):
            print("⚠️ Found strong negative keyword — overriding to 'negative'")
            return "negative"
        elif any(word in text for word in positive_words):
            print("💚 Found strong positive keyword — overriding to 'positive'")
            return "positive"
        elif any(word in text for word in neutral_words):
            print("💙 Found neutral keyword — overriding to 'neutral'")
            return "neutral"

    prediction = model.predict(vectorized_text)
    sentiment = 'negative' if prediction == 1 else 'positive'
    print(f"✅ ML Prediction: {sentiment}")
    return sentiment
