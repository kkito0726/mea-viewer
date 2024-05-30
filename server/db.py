from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_seeder import FlaskSeeder

db = SQLAlchemy()
ma = Marshmallow()
seeder = FlaskSeeder()


def init_db(app):
    db.init_app(app)
    Migrate(app, db)


def init_ma(app):
    ma.init_app(app)


def init_seeder(app):
    seeder.init_app(app, db)


from model.ShowAllImage import ShowAllImage
from model.ShowShingleImage import ShowSingleImage
from model.ShowDetectionImage import ShowDetectionImage
from model.RasterPlotImage import RasterPlotImage
from model.Draw2dImage import Draw2dImage
from model.Draw3dImage import Draw3dImage
