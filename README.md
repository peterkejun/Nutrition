# Nutrition
A nutrition website that keeps track of user's nutrition consumption and provides better options of diet, powered by nutrition database from [Health Canada](https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/nutrient-data.html). 

## Current Features
### [GraphQL](https://graphql.org/) Server API
* Frontend queries nutrition info through HTTP endpoint
* GraphQL schema aligned with nutrition [SQLite 3](https://www.sqlite.org/index.html) database

### User Authentication
* Secures user password crypographically using [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hashing function
* Stores user information (authentication, nutrition history, etc) in [DynamoDB](https://aws.amazon.com/dynamodb/?sc_channel=PS&sc_campaign=acquisition_CA&sc_publisher=google&sc_medium=dynamodb_hv_b&sc_content=dynamodb_e&sc_detail=dynamodb&sc_category=dynamodb&sc_segment=73324893296&sc_matchtype=e&sc_country=CA&s_kwcid=AL!4422!3!73324893296!e!!g!!dynamodb&ef_id=CjwKCAiAhc7yBRAdEiwAplGxXyR0XFZXyHneV6RUd7qsRX7j3LuqgtkGa5w3DBL2o-oDEFQQWNI-nRoC1bYQAvD_BwE:G:s) on AWS
* Enforces 2-step authentication using email verfication under [STMP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)

### User Interface
* Draws user nutrition history with HTML canvas and animates with JS animation frame
* Uses [Bootstrap](https://getbootstrap.com/) components for responsive layout

## Stack
### In Use
#### Backend
* Flask (Python) [ℹ](https://flask.palletsprojects.com/en/1.1.x/)
* SQLAlchemy [ℹ](https://www.sqlalchemy.org/)
* Graphene [ℹ](https://graphene-python.org/)
* SQLite3 [ℹ](https://www.sqlite.org/index.html)
* DynamoDB [ℹ](https://aws.amazon.com/dynamodb/?sc_channel=PS&sc_campaign=acquisition_CA&sc_publisher=google&sc_medium=dynamodb_hv_b&sc_content=dynamodb_e&sc_detail=dynamodb&sc_category=dynamodb&sc_segment=73324893296&sc_matchtype=e&sc_country=CA&s_kwcid=AL!4422!3!73324893296!e!!g!!dynamodb&ef_id=CjwKCAiAhc7yBRAdEiwAplGxXyR0XFZXyHneV6RUd7qsRX7j3LuqgtkGa5w3DBL2o-oDEFQQWNI-nRoC1bYQAvD_BwE:G:s)
#### Frontend
* React [ℹ](https://reactjs.org/)
* Bootstrap [ℹ](https://getbootstrap.com/)
### To Be Added
* Redux [ℹ](https://redux.js.org/)
* Machine Learning

