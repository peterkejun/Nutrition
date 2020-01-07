import flask
from flask import request, jsonify
import pandas as pd

app = flask.Flask(__name__)
app.config['Debug'] = True

food_name_df = pd.read_csv('dataset/FOOD NAME.csv', encoding="utf-8")
nutrition_amount_df = pd.read_csv('dataset/NUTRIENT AMOUNT.csv', encoding='utf-8')
nutrition_name_df = pd.read_csv('dataset/NUTRIENT NAME.csv', encoding='utf-8').sort_values('NutrientID')
food_group_df = pd.read_csv('dataset/FOOD GROUP.csv', encoding="utf-8")


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
    if 'id' in request.args:
        _id = request.args['id']
        if _id.isdigit():
            _id = int(_id)
        else:
            return ""
    else:
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
    if 'id' in request.args:
        _id = request.args['id']
        if _id.isdigit():
            _id = int(_id)
        else:
            return ""
    else:
        return ""
    m = _row_of_id(_id, food_name_df, 'FoodID')
    if m == -1:
        return ""
    return "<h1>{}</h1>".format(food_name_df['FoodGroupID'][m])


@app.route('/group_name_of_id', methods = ['Get'])
def group_name_of_id():
    if 'id' in request.args:
        _id = request.args['id']
        if _id.isdigit():
            _id = int(_id)
        else:
            return ""
    else:
        return ""
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
    if 'id' in request.args:
        _id = request.args['id']
        if _id.isdigit():
            _id = int(_id)
        else:
            return ""
    else:
        return ""
    m = _row_of_id(_id, nutrition_amount_df, 'FoodID')
    while m > 0:
        if nutrition_amount_df['FoodID'][m] == nutrition_amount_df['FoodID'][m - 1]:
            m -= 1
        else:
            break
    nutrition_info = []
    while m < nutrition_amount_df['FoodID'].count():
        name_en, name_fr = nutrition_name_of_id(nutrition_amount_df['NutrientID'][m], 'all')
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


# find name of nutrition for id and language
def nutrition_name_of_id(_id, lang):
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
