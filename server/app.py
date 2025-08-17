import importlib.metadata
import logging

import db
from config import config
from controller.figure_controller import figure
from controller.health_controller import health
from flask import Flask
from flask_cors import CORS

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

app = Flask(__name__)
logger.info(f"PyMEA version: {importlib.metadata.version('pyMEA')}")

# Controller読み込み
app.register_blueprint(health)
app.register_blueprint(figure)

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
    print(f"PyMEA version: {importlib.metadata.version('pyMEA')}")
    app.run(host="0.0.0.0", port=5001)
