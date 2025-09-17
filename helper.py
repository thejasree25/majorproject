import numpy as np
import pandas as pd
import re
import string
import pickle
from nltk.stem import PorterStemmer

ps = PorterStemmer()

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

def remove_punctuations(text):
    return ''.join(c for c in text if c not in string.punctuation)

def preprocessing(text):
    print("📝 Preprocessing text...")
    data = pd.DataFrame([text], columns=['tweet'])
    data["tweet"] = data["tweet"].apply(lambda x: " ".join(x.lower() for x in x.split()))
    data["tweet"] = data['tweet'].apply(lambda x: " ".join(re.sub(r'^https?:\/\/.*[\r\n]*', '', x, flags=re.MULTILINE) for x in x.split()))
    data["tweet"] = data["tweet"].apply(remove_punctuations)
    data["tweet"] = data['tweet'].str.replace(r'\d+', '', regex=True)
    data["tweet"] = data["tweet"].apply(lambda x: " ".join(x for x in x.split() if x not in sw))
    data["tweet"] = data["tweet"].apply(lambda x: " ".join(ps.stem(x) for x in x.split()))
    print(f"✅ Preprocessed text: {data['tweet'][0]}")
    return data["tweet"]

def vectorizer(ds):
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

def get_prediction(vectorized_text):
    print("🔮 Predicting sentiment...")
    prediction = model.predict(vectorized_text)
    sentiment = 'negative' if prediction == 1 else 'positive'
    print(f"✅ Prediction: {sentiment}")
    return sentiment

# Example usage
if __name__ == "__main__":
    test_text = "I love this product! It's amazing."
    preprocessed = preprocessing(test_text)
    vectorized = vectorizer(preprocessed)
    result = get_prediction(vectorized)
    print(f"\nFinal sentiment for '{test_text}': {result}")
