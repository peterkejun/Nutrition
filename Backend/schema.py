from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
import graphene
from graphene import relay
from .models import db_session, ModelNutrientName, ModelFoodName


class NutrientName(SQLAlchemyObjectType):
    class Meta:
        model = ModelNutrientName
        interfaces = (relay.Node,)


class NutrientNameConnection(relay.Connection):
    class Meta:
        node = NutrientName


class FoodName(SQLAlchemyObjectType):
    class Meta:
        model = ModelFoodName
        interfaces = (relay.Node,)


class FoodNameConnection(relay.Connection):
    class Meta:
        node = FoodName


class Query(graphene.ObjectType):
    """Query Object for GraphQL API"""

    node = graphene.relay.node.Field()
    all_nutrient_names = SQLAlchemyConnectionField(NutrientNameConnection)
    all_food_names = SQLAlchemyConnectionField(FoodNameConnection)


schema = graphene.Schema(query=Query)