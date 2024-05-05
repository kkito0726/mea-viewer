from flask import Flask, jsonify
from flask_cors import CORS
from service.service import showAllService
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
    # POSTされたファイルデータを取得
    files = request.files.values()
    arrays = np.array([np.frombuffer(file.read(), dtype=np.float32) for file in files])
    x, y = arrays[0], arrays[1]

    json_data = request.form.get("jsonData")
    if json_data:
        json_data = json.loads(json_data)  # JSON文字列をPython辞書に変換
    value = FormValue(
        json_data["hed_path"],
        json_data["start"],
        json_data["end"],
        json_data["volt_min"],
        json_data["volt_max"],
        json_data["x_ratio"],
        json_data["y_ratio"],
        json_data["dpi"],
    )
    image = showSingle(
        x,
        y,
        value.start,
        value.end,
        value.volt_min,
        value.volt_max,
        (value.x_ratio, value.y_ratio),
        value.dpi,
    )

    return jsonify({"imgSrc": image})


if __name__ == "__main__":
    # webbrowser.open(CLIENT_URL)
    app.run(port=5001)
