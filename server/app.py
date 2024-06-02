from flask import Flask
from controller.health_controller import health
from controller.figure_controller import figure
from controller.showDetection_crud_controller import showDetection_crud
from controller.rasterPlot_crud_controller import rasterPlot_crud
from controller.showAll_crud_controller import showAll_crud
from controller.draw2d_crud_controller import draw_2d_crud
from flask_cors import CORS
from config import config
import db
import os
from migration import migration
from model import models


app = Flask(__name__)

# Controller読み込み
app.register_blueprint(health)
app.register_blueprint(figure)
app.register_blueprint(showDetection_crud)
app.register_blueprint(showAll_crud)
app.register_blueprint(rasterPlot_crud)
app.register_blueprint(draw_2d_crud)

# DB読み込み
app.config.from_object(config.Config)
db.init_db(app)
db.init_ma(app)
db.init_seeder(app)

CORS(app)


if __name__ == "__main__":
    if not os.path.exists("./migrations"):
        migration.initialize_migration()
    migration.exec_migration()
    migration.exec_seed()

    app.run(host="0.0.0.0", port=5001)
