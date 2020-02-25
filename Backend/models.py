from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer, ForeignKey, MetaData, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker, relationship, backref



# User Auth
auth_engine = create_engine('sqlite:///user_auth.db', convert_unicode=True)
auth_session = scoped_session(sessionmaker(autocommit=True,
                                           autoflush=False,
                                           bind=auth_engine))
AuthBase = declarative_base()
AuthBase.query = auth_session.query_property()


class UserAuthTable(AuthBase):
    """user auth table in user_auth database"""
    __tablename__ = 'Auth'

    email = Column(String, primary_key=True)
    status = Column(String)
    activeSince = Column(Integer)
    expireAt = Column(Integer)
    OTP = Column(String, nullable=True)


# Nutrition
nutr_engine = create_engine('sqlite:///nutrition.sqlite', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=nutr_engine))
NutrBase = declarative_base()
NutrBase.query = db_session.query_property()


class ConversionFactor(NutrBase):
    """conversion factor model"""
    __tablename__ = 'conversion_factor'

    ConvFactorID = Column(Integer, primary_key=True)
    FoodID = Column(String, ForeignKey('food_name.FoodID'))
    MeasureID = Column(String)
    ConversionFactorValue = Column(String)
    ConvFactorDateOfEntry = Column(String)

    measure_name = relationship('MeasureName', backref=backref('ConversionFactor', uselist=True, cascade='delete,all'))


class FoodGroup(NutrBase):
    """food group model"""
    __tablename__ = 'food_group'

    FoodGroupID = Column(String, ForeignKey('food_name.FoodGroupID'), primary_key=True)
    FoodGroupCode = Column(String)
    FoodGroupName = Column(String)
    FoodGroupNameF = Column(String)
    FoodGroupIconIndex = Column(Integer)


class FoodName(NutrBase):
    """food name model"""

    __tablename__ = 'food_name'

    FoodID = Column(String, primary_key=True)
    FoodCode = Column(String)
    FoodGroupID = Column(String)
    FoodSourceID = Column(String)
    FoodDescription = Column(String)
    FoodDescriptionF = Column(String)
    FoodDateOfEntry = Column(String)
    FoodDateOfPublication = Column(String)
    CountryCode = Column(String)
    ScientificName = Column(String)

    nutrient_amounts = relationship('NutrientAmount', backref=backref('FoodName', uselist=True, cascade='delete,all'))
    food_source = relationship('FoodSource', backref=backref('FoodName', uselist=True, cascade='delete,all'))
    food_group = relationship('FoodGroup', backref=backref('FoodName', uselist=True, cascade='delete,all'))
    yield_amount = relationship('YieldAmount', backref=backref('FoodName', uselist=True, cascade='delete,all'))
    refuse_amount = relationship('RefuseAmount', backref=backref('FoodName', uselist=True, cascade='delete,all'))
    conversion_factor = relationship('ConversionFactor', backref=backref('FoodName', uselist=True, cascade='delete,all'))


class FoodSource(NutrBase):
    """food source model"""
    __tablename__ = 'food_source'

    FoodSourceID = Column(String, ForeignKey('food_name.FoodSourceID'), primary_key=True)
    FoodSourceCode = Column(String)
    FoodSourceDescription = Column(String)
    FoodSourceDescriptionF = Column(String)


class MeasureName(NutrBase):
    """measure name model"""
    __tablename__ = 'measure_name'

    MeasureID = Column(String, ForeignKey('conversion_factor.MeasureID'), primary_key=True)
    MeasureDescription = Column(String)
    MeasureDescriptionF = Column(String)


class NutrientAmount(NutrBase):
    """nutrient amount model"""
    __tablename__ = 'nutrient_amount'

    AmountID = Column(Integer, primary_key=True)
    FoodID = Column(String, ForeignKey('food_name.FoodID'))
    NutrientID = Column(String)
    NutrientValue = Column(String)
    StandardError = Column(String)
    NumberOfObservations = Column(String)
    NutrientSourceID = Column(String)
    NutrientDateOfEntry = Column(String)

    nutrient_name = relationship('NutrientName', backref=backref('NutrientAmount', uselist=True, cascade='delete,all'))
    nutrient_source = relationship('NutrientSource')


class NutrientName(NutrBase):
    """nutrient name model"""

    __tablename__ = 'nutrient_name'

    NutrientID = Column(String, ForeignKey('nutrient_amount.NutrientID'), primary_key=True)
    NutrientCode = Column(String)
    NutrientSymbol = Column(String)
    NutrientUnit = Column(String)
    NutrientName = Column(String)
    NutrientNameF = Column(String)
    Tagname = Column(String)
    NutrientDecimals = Column(String)


class NutrientSource(NutrBase):
    """nutrient source model"""
    __tablename__ = 'nutrient_source'

    NutrientSourceID = Column(String, ForeignKey('nutrient_amount.NutrientSourceID'), primary_key=True)
    NutrientSourceCode = Column(String)
    NutrientSourceDescription = Column(String)
    NutrientSourceDescriptionF = Column(String)


class RefuseAmount(NutrBase):
    """refuse amount model"""
    __tablename__ = 'refuse_amount'

    FoodID = Column(String, ForeignKey('food_name.FoodID'), primary_key=True)
    RefuseID = Column(String)
    RefuseAmount = Column(String)
    RefuseDateOfEntry = Column(String)

    refuse_name = relationship('RefuseName', backref=backref('RefuseAmount', uselist=True, cascade='delete,all'))


class RefuseName(NutrBase):
    """refuse name model"""
    __tablename__ = 'refuse_name'

    RefuseID = Column(String, ForeignKey('refuse_amount.RefuseID'), primary_key=True)
    RefuseDescription = Column(String)
    RefuseDescriptionF = Column(String)


class YieldAmount(NutrBase):
    """yield amount model"""
    __tablename__ = 'yield_amount'

    YieldAmountID = Column(Integer, primary_key=True)
    FoodID = Column(String, ForeignKey('food_name.FoodID'))
    YieldID = Column(String)
    YieldAmount = Column(String)
    YieldDateOfEntry = Column(String)

    yield_name = relationship('YieldName', backref=backref('YieldAmount', uselist=True, cascade='delete,all'))


class YieldName(NutrBase):
    """yield name model"""
    __tablename__ = 'yield_name'

    YieldID = Column(String, ForeignKey('yield_amount.YieldID'), primary_key=True)
    YieldDescription = Column(String)
    YieldDescriptionF = Column(String)