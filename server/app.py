from flask import Flask
from controller.health_controller import health
from controller.figure_controller import figure
from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(health)
app.register_blueprint(figure)
CORS(app)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
