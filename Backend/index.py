import flask
from flask import request, jsonify
from flask_cors import CORS
import pandas as pd


app = flask.Flask(__name__)
CORS(app)
app.config['Debug'] = True

# load datasets
food_name_df = pd.read_csv('Backend/dataset/FOOD NAME.csv', encoding="utf-8")
nutrition_amount_df = pd.read_csv('Backend/dataset/NUTRIENT AMOUNT.csv', encoding='utf-8')
nutrition_name_df = pd.read_csv('Backend/dataset/NUTRIENT NAME.csv', encoding='utf-8').sort_values('NutrientID')
food_group_df = pd.read_csv('Backend/dataset/FOOD GROUP.csv', encoding="utf-8")
nutrition_name_df_sorted_by_name = nutrition_name_df.sort_values('NutrientName')


@app.route('/', methods=['Get'])
def home():
    return "<p>{}</p>".format(food_name_df.head())


@app.route('/food_names', methods=['Get'])
def food_names():
    if 'lang' in request.args:
        lang = request.args['lang']
        if lang == 'en':
            names = ""
            for i in food_name_df['FoodDescription']:
                names += "<h1>{}</h1>".format(i)
            return names
        elif lang == 'fr':
            names = ""
            for i in food_name_df['FoodDescriptionF']:
                names += "<h1>{}</h1>".format(i)
            return names
    names = ""
    for i in range(0, food_name_df['FoodDescription'].count()):
        names += "<h1>{} : {}</h1>".format(food_name_df['FoodDescription'][i], food_name_df['FoodDescriptionF'][i])
    return names


@app.route('/food_name_of_id', methods=['Get'])
def food_name_of_id():
    _id = _id_of_request(request)
    if _id == -1:
        return ""
    m = _row_of_id(_id, food_name_df, 'FoodID')
    if m == -1:
        return ""
    if 'lang' in request.args:
        lang = request.args['lang']
        if lang == 'en':
            return "<h1>{}</h1>".format(food_name_df['FoodDescription'][m])
        elif lang == 'fr':
            return "<h1>{}</h1>".format(food_name_df['FoodDescriptionF'][m])
    return "<h1>{} : {}</h1>".format(food_name_df['FoodDescription'][m], food_name_df['FoodDescriptionF'][m])


@app.route('/food_group_of_id', methods=['Get'])
def food_group_of_id():
    _id = _id_of_request(request)
    if _id == -1:
        return ""
    m = _row_of_id(_id, food_name_df, 'FoodID')
    if m == -1:
        return ""
    return "<h1>{}</h1>".format(food_name_df['FoodGroupID'][m])


@app.route('/all_nutrients_names_and_ids', methods=['Get'])
def all_nutrients_names_and_ids():
    result = {}
    for m in range(len(nutrition_name_df_sorted_by_name['NutrientName'])):
        result[int(nutrition_name_df_sorted_by_name['NutrientID'][m])] = nutrition_name_df_sorted_by_name['NutrientName'][m]
    return jsonify(result)


@app.route('/group_name_of_id', methods = ['Get'])
def group_name_of_id():
    _id = _id_of_request(request)
    if _id == -1:
        return jsonify({})
    m = _row_of_id(_id, food_group_df, 'FoodGroupID')
    if 'lang' in request.args:
        lang = request.args['lang']
        if lang == 'en':
            return "<h1>{}</h1>".format(food_group_df['FoodGroupName'][m])
        elif lang == 'fr':
            return "<h1>{}</h1>".format(food_group_df['FoodGroupNameF'][m])
    return "<h1>{} : {}</h1>".format(food_group_df['FoodGroupName'][m], food_group_df['FoodGroupNameF'][m])


@app.route('/nutrition_info_of_food_id', methods=['Get'])
def nutrition_info_of_food_id():
    _id = _id_of_request(request)
    if _id == -1:
        return jsonify([])
    m = _row_of_id(_id, nutrition_amount_df, 'FoodID')
    while m > 0:
        if nutrition_amount_df['FoodID'][m] == nutrition_amount_df['FoodID'][m - 1]:
            m -= 1
        else:
            break
    nutrition_info = []
    while m < nutrition_amount_df['FoodID'].count():
        name_en, name_fr = _nutrition_name_of_id(nutrition_amount_df['NutrientID'][m], 'all')
        nutrient = {'NutrientID': int(nutrition_amount_df['NutrientID'][m]),
                    'NutrientName': name_en,
                    'NutrientNameF': name_fr,
                    'NutrientValue': nutrition_amount_df['NutrientValue'][m]}
        nutrition_info.append(nutrient)
        if nutrition_amount_df['FoodID'][m] != nutrition_amount_df['FoodID'][m + 1]:
            break
        else:
            m += 1
    return jsonify(nutrition_info)


@app.route('/nutrients_matching_prefix_of', methods=['Get'])
def nutrients_matching_prefix_of():
    if 'prefix' in request.args and len(request.args['prefix']) > 0:
        _prefix = request.args['prefix']
    else:
        return jsonify({})
    # binary search of first letter
    df = nutrition_name_df_sorted_by_name
    low = 0
    count = df['NutrientName'].count()
    high = count - 1
    m_found = False
    m = 0
    while high >= low:
        m = (low + high) // 2
        if ord(df['NutrientName'].iloc[m][0]) == ord(_prefix[0]):
            m_found = True
            break
        elif ord(df['NutrientName'].iloc[m][0]) < ord(_prefix[0]):
            low = m + 1
        elif ord(df['NutrientName'].iloc[m][0]) > ord(_prefix[0]):
            high = m - 1
    if not m_found:
        return jsonify({})
    low = m
    high = m + 1
    result = {}
    while low >= 0 and df['NutrientName'].iloc[low][0] == _prefix[0]:
        if df['NutrientName'].iloc[low].startswith(_prefix):
            result[int(df['NutrientID'].iloc[low])] = df['NutrientName'].iloc[low]
        low -= 1
    while high < count and df['NutrientName'].iloc[high][0] == _prefix[0]:
        if df['NutrientName'].iloc[high].startswith(_prefix):
            result[int(df['NutrientID'].iloc[high])] = df['NutrientName'].iloc[high]
        high += 1
    return jsonify(result)


@app.route('/nutrients_names_of_ids', methods=['Post'])
def nutrients_names_of_ids():
    data = request.get_json()
    names = {}
    for _s_id in data:
        _id = int(_s_id)
        names[_s_id] = _nutrition_name_of_id(_id, 'en')
    if not names:
        return ""
    return jsonify(names)


@app.route('/nutrient_name_and_unit_of_ids', methods=['Post'])
def nutrient_name_and_unit_of_id():
    data = request.get_json()
    result = {}
    for _id in map(lambda x: int(x), data):
        m = _row_of_id(_id, nutrition_name_df, 'NutrientID')
        if m != -1:
            result[_id] = {
                'name': nutrition_name_df['NutrientName'][m],
                'unit': nutrition_name_df['NutrientUnit'][m]
            }
    return jsonify(result)


def _id_of_request(req):
    if 'id' in req.args:
        _id = req.args['id']
        if _id.isdigit():
            _id = int(_id)
            return _id
        else:
            return -1
    else:
        return -1


# find name of nutrition for id and language
def _nutrition_name_of_id(_id, lang):
    m = _row_of_id(_id, nutrition_name_df, 'NutrientID')
    if m == -1:
        return ""
    if lang == 'en':
        return nutrition_name_df['NutrientName'][m]
    elif lang == 'fr':
        return nutrition_name_df['NutrientNameF'][m]
    else:
        return nutrition_name_df['NutrientName'][m], nutrition_name_df['NutrientNameF'][m]


# binary search for id
def _row_of_id(_id, df, column_name):
    low = 0
    high = df[column_name].count() - 1
    while high >= low:
        m = (low + high) // 2
        if df[column_name].iloc[m] == _id:
            return m
        elif df[column_name].iloc[m] < _id:
            low = m + 1
        elif df[column_name].iloc[m] > _id:
            high = m - 1
    return -1


app.run()
