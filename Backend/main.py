import pyrebase
import flask
import pandas as pd
from flask import request, jsonify
from flask_cors import CORS

firebaseConfig = {
    'apiKey': "AIzaSyBgIHPqBmY7nYJqBkv_2jI1aTMxUWTo75g",
    'authDomain': "nutrition-e0519.firebaseapp.com",
    'databaseURL': "https://nutrition-e0519.firebaseio.com",
    'projectId': "nutrition-e0519",
    'storageBucket': "nutrition-e0519.appspot.com",
    'messagingSenderId': "68103152267",
    'appId': "1:68103152267:web:6783160d9527c0fdc22a8e",
    'measurementId': "G-JJ0458Z4XR",
    'serviceAccount': './nutrition-e0519-firebase-adminsdk-fiuta-a7cd2e30ef.json'
}

firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth = firebase.auth()

app = flask.Flask(__name__)
CORS(app)
app.config['Debug'] = True


class Doc:
    def __init__(self):
        self.food_name_df = pd.read_csv('./dataset/FOOD NAME.csv', encoding="utf-8")
        self.nutrition_amount_df = pd.read_csv('./dataset/NUTRIENT AMOUNT.csv', encoding='utf-8')
        self.nutrition_name_df = pd.read_csv('./dataset/NUTRIENT NAME.csv', encoding='utf-8').sort_values('NutrientID')
        self.food_group_df = pd.read_csv('./dataset/FOOD GROUP.csv', encoding="utf-8")
        self.nutrition_name_df_sorted_by_name = self.nutrition_name_df.sort_values('NutrientName')

    # return dict of nutrient info {id, symbol, unit, name_en, name_fr}
    def nutrient_info(self, _id):
        low = 0
        high = len(self.nutrition_name_df_sorted_by_name.index) - 1
        row = -1
        while high >= low:
            m = (low + high) // 2
            if self.nutrition_name_df['NutrientID'].iloc[m] == _id:
                row = m
                break
            elif self.nutrition_name_df['NutrientID'].iloc[m] < _id:
                low = m + 1
            elif self.nutrition_name_df['NutrientID'].iloc[m] > _id:
                high = m - 1
        if row == -1:
            return -1
        return {
            'id': _id,
            'symbol': self.nutrition_name_df['NutrientSymbol'].iloc[row],
            'unit': self.nutrition_name_df['NutrientUnit'].iloc[row],
            'name_en': self.nutrition_name_df['NutrientName'].iloc[row],
            'name_fr': self.nutrition_name_df['NutrientNameF'].iloc[row]
        }

    # return array of id and name of all nutrients [{id, name_en, name_fr}]
    def ids_and_names(self, serializable=False):
        result = []
        for i in range(len(self.nutrition_name_df_sorted_by_name['NutrientName'])):
            result.append({
                'id': int(self.nutrition_name_df_sorted_by_name['NutrientID'][i]) if serializable
                else self.nutrition_name_df_sorted_by_name['NutrientID'][i],
                'name_en': self.nutrition_name_df_sorted_by_name['NutrientName'][i],
                'name_fr': self.nutrition_name_df_sorted_by_name['NutrientNameF'][i],
            })
        return result


doc = Doc()


# id, name_en, name_fr, symbol, unit,
class Nutrient:
    def __init__(self, _id):
        self.id = _id
        self.info = doc.nutrient_info(_id)
        if self.info == -1:
            self.valid = False
        else:
            self.valid = True

    def json(self):
        if not self.valid:
            return -1
        return self.info


# home URL
@app.route('/', methods=['Get'])
def home():
    return "Welcome to python backend for Nutrition"


@app.route('/sign_in', methods=['Post'])
def sign_in():
    data = request.json
    if 'email' not in data or 'password' not in data:
        return 'error: insufficient info', 404
    user = auth.sign_in_with_email_and_password(data['email'], data['password'])
    user['displayName'] = db.child('users').child(user['localId']).child('display_name').get().val()
    return user


@app.route('/sign_up', methods=['Post'])
def sign_up():
    data = request.json
    if 'email' not in data or 'password' not in data or 'display_name' not in data:
        return 'error: insufficient info', 404
    user = auth.create_user_with_email_and_password(data['email'], data['password'])
    db.child('users').child(user['localId']).set({
        'display_name': data['display_name'],
        'email': data['email']
    })
    user['display_name'] = data['display_name']
    return jsonify(user)


@app.route('/current_user', methods=['Get'])
def current_user():
    user = auth.current_user
    return user


# return array of nutrients user had [{id, symbol, unit, name_en, name_fr}]
@app.route('/user_nutrition_history', methods=['Post'])
def user_nutrition_history():
    data = request.json
    if 'type' not in data or 'localId' not in data:
        return 'error: insufficient info', 404
    if data['type'] == 'day':
        if 'date' not in data:
            return "error: insufficient info", 404
        history = db.child('nutrition_history').child(data['localId']).child(data['date']).get()
        result = dict(history.val())
        for _id in result:
            nutrient = Nutrient(int(_id))
            if nutrient.valid:
                result[_id] = {
                    'amount': result[_id],
                    'info': nutrient.json()
                }
        return jsonify(result)
    elif data['type'] == 'range':
        if 'start_date' not in data or 'end_date' not in data:
            return 'error: insufficient info', 404


# return info of multiple nutrients {{id, symbol, unit, name_en, name_fr}}
@app.route('/nutrients_info', methods=['Post'])
def nutrients_info():
    data = request.get_json()
    if 'ids' not in data:
        return 'error: no nutrient ids', 403
    result = {}
    for _id in data['ids']:
        try:
            _id_i = int(_id)
            nutrient = Nutrient(_id)
            if nutrient.valid:
                result[_id_i] = nutrient.json()
        except ValueError:
            continue
    return jsonify(result)


# return id and name of all nutrients [{id, name_en, name_fr}]
@app.route('/all_nutrient_ids_and_names', methods=['Get'])
def all_nutrients_ids_and_names():
    return jsonify(doc.ids_and_names(serializable=True))


app.run()
