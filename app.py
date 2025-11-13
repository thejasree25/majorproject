from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from helper import preprocessing, vectorizer, get_prediction

app = Flask(__name__)
CORS(app)  # ✅ Allow access from Node & React

# ------------------ MODEL LOADING ------------------
print("🔄 Loading model...")
with open('static/model/model.pickle', 'rb') as f:
    model = pickle.load(f)
print("✅ Model loaded successfully")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("comment")

    if not text:
        return jsonify({"error": "No comment provided"}), 400

    preprocessed_txt = preprocessing(text)
    vectorized_txt = vectorizer(preprocessed_txt)

    prediction = get_prediction(vectorized_txt, text)
    return jsonify({"sentiment": prediction})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
