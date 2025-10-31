import numpy as np
import pandas as pd
import re
import string
import pickle
from nltk.stem import PorterStemmer

ps = PorterStemmer()

# ------------------ MODEL LOADING ------------------
print("🔄 Loading model...")
with open('static/model/model.pickle', 'rb') as f:
    model = pickle.load(f)
print("✅ Model loaded successfully")

print("🔄 Loading stopwords...")
with open('static/model/corpora/stopwords/english', 'r') as file:
    sw = file.read().splitlines()
print(f"✅ {len(sw)} stopwords loaded")

print("🔄 Loading vocabulary tokens...")
vocab = pd.read_csv('static/model/vocabulary.txt', header=None)
tokens = vocab[0].tolist()
print(f"✅ {len(tokens)} tokens loaded")

# ------------------ HELPER FUNCTIONS ------------------

def remove_punctuations(text):
    return ''.join(c for c in text if c not in string.punctuation)

def preprocessing(text):
    """Clean and preprocess the input text."""
    print("📝 Preprocessing text...")
    data = pd.DataFrame([text], columns=['tweet'])
    data["tweet"] = data["tweet"].apply(lambda x: " ".join(x.lower() for x in x.split()))
    data["tweet"] = data["tweet"].apply(lambda x: re.sub(r'https?://\S+|www\.\S+', '', x))  # remove links
    data["tweet"] = data["tweet"].apply(remove_punctuations)
    data["tweet"] = data["tweet"].str.replace(r'\d+', '', regex=True)
    data["tweet"] = data["tweet"].apply(lambda x: " ".join(x for x in x.split() if x not in sw))
    data["tweet"] = data["tweet"].apply(lambda x: " ".join(ps.stem(x) for x in x.split()))
    print(f"✅ Preprocessed text: {data['tweet'][0]}")
    return data["tweet"]

def vectorizer(ds):
    """Convert preprocessed text into binary vector format."""
    print("🔢 Vectorizing text...")
    vectorized_lst = []
    for sentence in ds:
        sentence_lst = np.zeros(len(tokens))
        for i in range(len(tokens)):
            if tokens[i] in sentence.split():
                sentence_lst[i] = 1
        vectorized_lst.append(sentence_lst)
    vectorized_lst_new = np.asarray(vectorized_lst, dtype=np.float32)
    print(f"✅ Vectorized shape: {vectorized_lst_new.shape}")
    return vectorized_lst_new


def get_prediction(vectorized_text, raw_text=None):
    """Predict sentiment using model + rule-based override."""
    print("🔮 Predicting sentiment...")

    # ✅ Step 1: Manual rule-based override
    if raw_text:
        text = raw_text.lower()
        positive_words = ["good", "great", "excellent", "nice", "amazing", "happy", "love", "wonderful", "awesome"]
        negative_words = ["bad", "worst", "ugly", "hate", "terrible", "poor", "awful", "sad", "disgusting"]

        if any(word in text for word in negative_words):
            print("⚠️ Found strong negative keyword — overriding to 'negative'")
            return "negative"
        elif any(word in text for word in positive_words):
            print("💚 Found strong positive keyword — overriding to 'positive'")
            return "positive"

    # ✅ Step 2: Use ML model if no rule matched
    prediction = model.predict(vectorized_text)
    sentiment = 'negative' if prediction == 1 else 'positive'
    print(f"✅ ML Prediction: {sentiment}")
    return sentiment

# ------------------ TEST ------------------
if __name__ == "__main__":
    test_texts = [
        "This is a bad product",
        "I love this item, it's amazing",
        "The movie was okay",
        "Worst experience ever",
        "Not too good not too bad"
    ]
    for txt in test_texts:
        preprocessed = preprocessing(txt)
        vectorized = vectorizer(preprocessed)
        result = get_prediction(vectorized, txt)
        print(f"\nFinal sentiment for '{txt}': {result}")
