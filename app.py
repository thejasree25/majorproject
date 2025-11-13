from flask import Flask, render_template, request
import pickle, re, string
from nltk.stem import PorterStemmer

app = Flask(__name__)
ps = PorterStemmer()

# Load model
with open('static/model/model.pickle', 'rb') as f:
    model = pickle.load(f)

# Example global data storage
data = {
    "positive": 0,
    "negative": 0,
    "reviews": []
}

@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    if request.method == 'POST':
        text = request.form['text']
        data['reviews'].append(text)

        # Simple example: get prediction
        pred = model.predict([text])[0]

        if pred == 'positive':
            data['positive'] += 1
        elif pred == 'negative':
            data['negative'] += 1

        prediction = pred.lower()

    return render_template('index.html', data=data, prediction=prediction)

if __name__ == '__main__':
    app.run(debug=True)
