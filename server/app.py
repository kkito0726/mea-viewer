from flask import Flask, jsonify
from flask_cors import CORS
from service.service import showAllService, showSingleService
import webbrowser
import numpy as np
from flask import request
from lib.plot import showSingle
from model.form_value import FormValue
import json

CLIENT_URL = "https://mea-viewer.vercel.app/"

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return "Hello Flask!!"


@app.route("/showAll", methods=["POST"])
def plot_showAll():
    image = showAllService()
    return jsonify({"imgSrc": image})


@app.route("/showSingle", methods=["POST"])
def show_single():
    image = showSingleService()
    return jsonify({"imgSrc": image})


if __name__ == "__main__":
    # webbrowser.open(CLIENT_URL)
    app.run(host="0.0.0.0", port=5001)
