from graphene_sqlalchemy import SQLAlchemyObjectType
from Backend.models import ModelFoodName, ModelNutrientName
import graphene


# nutrient name
class NutrientNameAttributes:
    id = graphene.String(description='id of the nutrient')
    code = graphene.String(description='code of the nutrient')
    symbol = graphene.String(description='symbol of the nutrient')
    unit = graphene.String(description='unit of the nutrient')
    name_en = graphene.String(description='English name of the nutrient')
    name_fr = graphene.String(description='French name of the nutrient')
    tagname = graphene.String(description='tag name of the nutrient')
    decimals = graphene.String(description='decimals of the nutrient')


class NutrientName(SQLAlchemyObjectType, NutrientNameAttributes):
    """Nutrient Name Node"""

    class Meta:
        model = ModelNutrientName
        interfaces = (graphene.relay.Node,)


# food name
class FoodNameAttributes:
    id = graphene.String(description='id of the food')
    code = graphene.String(description='code of the food')
    group_id = graphene.String(description='group id of the food')
    source_id = graphene.String(description='source id of the food')
    description_en = graphene.String(description='English description of the food')
    description_fr = graphene.String(description='French description of the food')
    date_of_entry = graphene.String(description='date of entry of the food')
    date_of_publication = graphene.String(description='date of description of the food')
    country_code = graphene.String(description='country code of the food')
    scientific_name = graphene.String(description='scientific name of the food')


class FoodName(SQLAlchemyObjectType, FoodNameAttributes):
    """Food Name Node"""

    class Meta:
        model = ModelFoodName
        interfaces = (graphene.relay.Node,)