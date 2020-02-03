from sqlalchemy import *
from sqlalchemy import Column, String
from sqlalchemy.orm import scoped_session, sessionmaker, relationship, backref
from sqlalchemy.ext.declarative import declarative_base


engine = create_engine('sqlite:///nutrition.sqlite')
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


class ModelFoodName(Base):
    """food name model"""

    __tablename__ = 'food_name'

    id = Column('FoodID', String, primary_key=True)
    code = Column('FoodCode', String)
    group_id = Column('FoodGroupID', String)
    source_id = Column('FoodSourceID', String)
    description_en = Column('FoodDescription', String)
    description_fr = Column('FoodDescriptionF', String)
    date_of_entry = Column('FoodDateOfEntry', String)
    date_of_publication = Column('FoodDateOfPublication', String)
    country_code = Column('CountryCode', String)
    scientific_name = Column('ScientificName', String)


class ModelNutrientName(Base):
    """nutrient name model"""

    __tablename__ = 'nutrient_name'

    id = Column('NutrientID', String, primary_key=True)
    code = Column('NutrientCode', String)
    symbol = Column('NutrientSymbol', String)
    unit = Column('NutrientUnit', String)
    name_en = Column('NutrientName', String)
    name_fr = Column('NutrientNameF', String)
    tagname = Column('Tagname', String)
    decimals = Column('NutrientDecimals', String)

    foodList = relationship(ModelFoodName, backref='nutrient_names')