from flask import Flask
from controller.health_controller import health
from controller.figure_controller import figure
from controller.showDetection_crud_controller import showDetection_crud
from controller.rasterPlot_crud_controller import rasterPlot_crud
from controller.showAll_crud_controller import showAll_crud
from controller.showSingle_crud_controller import showSingle_crud
from controller.draw2d_crud_controller import draw_2d_crud
from controller.draw3d_crud_controller import draw_3d_crud
from flask_cors import CORS
from config import config
import db


app = Flask(__name__)

# Controller読み込み
app.register_blueprint(health)
app.register_blueprint(figure)
app.register_blueprint(showDetection_crud)
app.register_blueprint(showAll_crud)
app.register_blueprint(showSingle_crud)
app.register_blueprint(rasterPlot_crud)
app.register_blueprint(draw_2d_crud)
app.register_blueprint(draw_3d_crud)

# DB読み込み
app.config.from_object(config.Config)
db.init_db(app)


CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://localhost:4173",
                "https://mea-viewer.vercel.app",
            ]
        }
    },
)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
