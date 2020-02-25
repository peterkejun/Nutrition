from models import \
    ConversionFactor as ConvFactorModel, FoodGroup as FoodGroupModel, FoodName as FoodNameModel, \
    FoodSource as FoodSourceModel, MeasureName as MeasureNameModel, NutrientAmount as NutrientAmountModel, \
    NutrientName as NutrientNameModel, NutrientSource as NutrientSourceModel, RefuseAmount as RefuseAmountModel, \
    RefuseName as RefuseNameModel, YieldAmount as YieldAmountModel, YieldName as YieldNameModel
import graphene
from graphene import relay, Field
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField


class ConversionFactor(SQLAlchemyObjectType):
    class Meta:
        model = ConvFactorModel


class FoodGroup(SQLAlchemyObjectType):
    class Meta:
        model = FoodGroupModel


class FoodName(SQLAlchemyObjectType):
    class Meta:
        model = FoodNameModel
        # interfaces = (relay.Node,)


class FoodSource(SQLAlchemyObjectType):
    class Meta:
        model = FoodSourceModel


class MeasureName(SQLAlchemyObjectType):
    class Meta:
        model = MeasureNameModel


class NutrientAmount(SQLAlchemyObjectType):
    class Meta:
        model = NutrientAmountModel


class NutrientName(SQLAlchemyObjectType):
    class Meta:
        model = NutrientNameModel
        # interfaces = (relay.Node,)


class NutrientSource(SQLAlchemyObjectType):
    class Meta:
        model = NutrientSourceModel


class RefuseAmount(SQLAlchemyObjectType):
    class Meta:
        model = RefuseAmountModel


class RefuseName(SQLAlchemyObjectType):
    class Meta:
        model = RefuseNameModel


class YieldAmount(SQLAlchemyObjectType):
    class Meta:
        model = YieldAmountModel


class YieldName(SQLAlchemyObjectType):
    class Meta:
        model = YieldNameModel


class Query(graphene.ObjectType):
    # node = relay.Node.Field()

    # nutrients
    all_nutrients = graphene.List(NutrientName)
    nutrient_by_id = Field(NutrientName, id=graphene.String(required=True))

    def resolve_all_nutrients(self, info):
        return NutrientName.get_query(info).all()

    def resolve_nutrient_by_id(self, info, id):
        return NutrientName.get_query(info).filter(NutrientNameModel.NutrientID == id).first()

    # food
    all_food = graphene.List(FoodName)
    food_by_id = Field(FoodName, id=graphene.String(required=True))
    food_name_like = graphene.List(FoodName, name=graphene.String(required=True))

    def resolve_all_food(self, info):
        return FoodName.get_query(info).all()

    def resolve_food_by_id(self, info, id):
        return FoodName.get_query(info).filter(FoodNameModel.FoodID == id).first()

    def resolve_food_name_like(self, info, name):
        prefix_results = FoodName.get_query(info).filter(FoodNameModel.FoodDescription.like(name + '%'))\
            .order_by(FoodNameModel.FoodDescription.asc())
        # contain_results = FoodName.get_query(info).filter(FoodNameModel.FoodDescription.like('%' + name + '%'))\
        #     .order_by(FoodNameModel.FoodDescription.asc())
        # suffix_results = FoodName.get_query(info).filter(FoodNameModel.FoodDescription.like('%' + name))\
        #     .order_by(FoodNameModel.FoodDescription.asc())
        return prefix_results

    # food groups
    all_food_groups = graphene.List(FoodGroup)

    def resolve_all_food_groups(self, info):
        return FoodGroup.get_query(info).order_by(FoodGroupModel.FoodGroupName.asc()).all()




schema = graphene.Schema(query=Query, types=[ConversionFactor, FoodGroup, FoodName, FoodSource, MeasureName,
                                             NutrientAmount, NutrientName, NutrientSource, RefuseAmount, RefuseName,
                                             YieldAmount, YieldName])
