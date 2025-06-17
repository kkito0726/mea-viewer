from flask import Flask
from flask_cors import CORS

import db
from config import config

from controller.figure_controller import figure
from controller.health_controller import health

app = Flask(__name__)

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
    app.run(host="0.0.0.0", port=5001)
