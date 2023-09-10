import pickle
from flask import Flask, jsonify, request
import json
from util import Predictor, Tonal
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_FILE_NAME = "model_v1.pk"
TONAL_MODEL_FILE_NAME = "tonal_model.pk"

model = None
predictor = None
tonal_model = None

def load_model():
    _model, _tonal_model = None, None
    print("Loading the model...")
    with open('./models/' + MODEL_FILE_NAME, 'rb') as f:
        model = pickle.load(f)
        print("The model has been loaded...")
        _model = model
    with open('./models/' + TONAL_MODEL_FILE_NAME, 'rb') as f:
        model = pickle.load(f)
        print("The tonal analyst model has been loaded...doing predictions now...")
        _tonal_model = model
    return _model, _tonal_model

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['fileInput']

        file_contents = file.read()

        try:
            test_json = json.loads(file_contents)
        except json.JSONDecodeError as e:
            return f'Ошибка при переводе в JSON: {str(e)}', 400
        
        text = test_json
    except Exception as e:
        raise e

    if not text:
        return "400"
    else:
        predictions = predictor.get_results(text)
        responses = jsonify(predictions)
        responses.status_code = 200

        return responses

@app.route('/hist', methods=['POST'])
def hist():
    try:
        test_json = request.get_json()
        text = test_json
    except Exception as e:
        raise e

    if not text:
        return "400"
    else:
        predictions = predictor.get_results(text)["hist"]

        responses = jsonify(predictions)
        responses.status_code = 200

        return responses
    
@app.route('/points', methods=['POST'])
def points():
    try:
        test_json = request.get_json()
        text = test_json
    except Exception as e:
        raise e

    if not text:
        return "400"
    else:
        predictions = predictor.get_results(text)["points"]

        responses = jsonify(predictions)
        responses.status_code = 200

        return responses
    
@app.route('/bubbles', methods=['POST'])
def bubbles():
    try:
        test_json = request.get_json()
        text = test_json
    except Exception as e:
        raise e

    if not text:
        return "400"
    else:
        predictions = predictor.get_results(text)["bubbles"]

        responses = jsonify(predictions)
        responses.status_code = 200

        return responses
    
@app.route('/json', methods=['POST'])
def get_json():
    try:
        test_json = request.get_json()
        text = test_json
    except Exception as e:
        raise e

    if not text:
        return "400"
    else:
        predictions = predictor.build_final_json(text)

        responses = jsonify(predictions)
        responses.status_code = 200

        return responses

if __name__ == '__main__':
    model, tonal_model = load_model()
    tonal_analyst = Tonal(tonal_model)
    predictor = Predictor(model, tonal_analyst)
    app.run(debug=True)
