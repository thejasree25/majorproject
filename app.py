from flask import Flask, request, jsonify
from helper import preprocessing, vectorizer, get_prediction

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("comment")

    preprocessed_txt = preprocessing(text)
    vectorized_txt = vectorizer(preprocessed_txt)
    prediction = get_prediction(vectorized_txt)

    return jsonify({"sentiment": prediction})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
