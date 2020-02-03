from sqlalchemy import create_engine
from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine('sqlite:///nutrition.sqlite', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


class FoodName(Base):
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


class NutrientName(Base):
    """nutrient name model"""

    __tablename__ = 'nutrient_name'

    NutrientID = Column(String, primary_key=True)
    NutrientCode = Column(String)
    NutrientSymbol = Column(String)
    NutrientUnit = Column(String)
    NutrientName = Column(String)
    NutrientNameF = Column(String)
    Tagname = Column(String)
    NutrientDecimals = Column(String)
