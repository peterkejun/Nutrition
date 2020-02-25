# Flask
import flask
from flask import request, jsonify, make_response, session
from flask_cors import CORS, cross_origin
# GraphQL
from flask_graphql import GraphQLView
from models import db_session as nutr_session
from schema import schema as graphql_schema
# Authentication and DynamoDB
import boto3
import Auth
from models import auth_session, UserAuthTable
# Util
import time

# DynamoDB (Users)
dynamodb = boto3.resource('dynamodb', endpoint_url='https://dynamodb.us-east-2.amazonaws.com')
user_table = dynamodb.Table('Users')

# Flask
app = flask.Flask(__name__)
CORS(app, supports_credentials=True)
app.debug = True
app.secret_key = 'very_secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nutrition.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config.update(Auth.mail_settings)
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        '/graphql',
        schema=graphql_schema,
        graphiql=True
    )
)
Auth.mail.init_app(app)


# home URL
@app.route('/', methods=['Get'])
def home():
    return "Welcome to python backend for Nutrition!"


@app.route('/sign_in', methods=['POST'])
def sign_in():
    data = request.json
    # check if email is provided
    if 'email' not in data or 'password' not in data:
        return make_response('Invalid Login Information', 401)
    # sign user in if and only if user exists and passwords match
    user = get_user(email=data['email'])
    user_auth = auth_session.query(UserAuthTable).filter(UserAuthTable.email == data['email']).first()
    if user_auth is not None and user_auth.status == 'verified':
        return make_response('Already Signed In', 200)
    elif user is not None and Auth.hash_password(data['password']) == user['password']:
        new_user_auth = UserAuthTable(email=data['email'],
                                      status='not verified',
                                      activeSince=time.time(),
                                      expireAt=time.time() + 60 * 5,
                                      OTP=Auth.send_verification_email([data['email']]))
        auth_session.add(new_user_auth)
        auth_session.flush()
        return make_response('Verification Email Sent', 200)
    elif user is None:
        return make_response('User Does Not Exist', 401)
    else:
        return make_response('Incorrect Email or Password', 401)


@app.route('/verify_sign_in', methods=['POST'])
def verify_sign_in():
    # check if user is already logged in
    data = request.json
    if 'email' not in data or 'OTP' not in data:
        print(1)
        return make_response('Invalid Verification Information', 401)
    user_auth = auth_session.query(UserAuthTable).filter(UserAuthTable.email == data['email']).first()
    if user_auth is None:
        print(2)
        return make_response('Verification Without Login', 401)
    if user_auth.status == 'verified':
        return make_response('Already Verified', 200)
    elif user_auth.status == 'not verified':
        # verification successful
        current = time.time()
        if user_auth.OTP == data['OTP'] and current - user_auth.activeSince < user_auth.expireAt:
            user_auth.status = 'verified'
            user_auth.activeSince = current
            user_auth.expireAt = current + 10 * 60
            auth_session.flush()
            return make_response('Verification Successful', 200)
        elif user_auth.OTP != data['OTP']:
            auth_session.delete(user_auth)
            auth_session.flush()
            print(2)
            return make_response('Incorrect OTP', 401)
        else:
            auth_session.delete(user_auth)
            auth_session.flush()
            print(4)
            return make_response('OTP Expired', 401)
    return make_response('Verification Unavailable', 400)


@app.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.json
    # check if credentials meet requirements
    validity, val_response = Auth.validate_email_password(data['email'], data['password'])
    if not validity:
        return make_response('Invalid Email', 401) if val_response == 'email invalid' \
            else make_response('Invalid Password', 401)
    # add user to DynamoDB if and only if email does not exist
    user = get_user(email=data['email'])
    if user is None:
        user_table.put_item(
            Item={
                'email': data['email'],
                'password': Auth.hash_password(data['password'])
            }
        )
        return make_response('Signup Success', 201)
    else:
        return make_response('User Already Exists', 409)


@app.route('/sign_out', methods=['POST'])
def sign_out():
    # clear session data
    data = request.json
    if 'email' not in data:
        return make_response('Invalid Logout Information', 401)
    user_auth = UserAuthTable.query.filter(UserAuthTable.email == data['email']).one()
    if user_auth is None:
        return make_response('User Is Not Logged In', 401)
    auth_session.delete(user_auth)
    auth_session.flush()
    return make_response('Logout Successful', 200)


# return array of nutrients user had [{id, symbol, unit, name_en, name_fr}]
@app.route('/user_nutrition_history', methods=['Post'])
def user_nutrition_history():
    data = request.json
    if 'type' not in data or 'localId' not in data:
        return 'error: insufficient info', 404
    if data['type'] == 'day':
        if 'date' not in data:
            return "error: insufficient info", 404
        history = user_db.child('nutrition_history').child(data['localId']).child(data['date']).get()
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


@app.teardown_appcontext
def shutdown_session(exception=None):
    nutr_session.remove()


def get_user(email):
    item = user_table.get_item(
        Key={
            'email': email
        }
    )
    if 'Item' not in item:
        return None
    return item['Item']


app.run()
