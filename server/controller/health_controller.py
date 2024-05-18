from flask import Blueprint

health = Blueprint("health", __name__)


@health.route("/")
def index():
    return "Hello Flask!!"
