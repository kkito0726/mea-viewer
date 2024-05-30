from flask import Flask
from controller.health_controller import health
from controller.figure_controller import figure
from flask_cors import CORS
from config import config
import db
import os
from migration import migration
from model.ShowAllImage import ShowAllImage


app = Flask(__name__)

# Controller読み込み
app.register_blueprint(health)
app.register_blueprint(figure)

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
