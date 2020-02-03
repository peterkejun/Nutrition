from models import FoodName as FoodNameModel, NutrientName as NutrientNameModel
import graphene
from graphene import relay, Field
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField


class NutrientName(SQLAlchemyObjectType):
    class Meta:
        model = NutrientNameModel
        interfaces = (relay.Node,)

    def appears_in_Food(self):
        


class FoodName(SQLAlchemyObjectType):
    class Meta:
        model = FoodNameModel
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    node = relay.Node.Field()

    # nutrients
    all_nutrients = graphene.List(NutrientName)
    nutrient_by_id = Field(NutrientName, id=graphene.String(required=True))

    def resolve_all_nutrients(self, info):
        return NutrientName.get_query(info).all()

    def resolve_nutrient_by_id(self, info, id):
        return NutrientName.get_query(info).filter(NutrientNameModel.NutrientID == id).first()

    # food
    all_food = SQLAlchemyConnectionField(FoodName)


schema = graphene.Schema(query=Query, types=[NutrientName, FoodName])