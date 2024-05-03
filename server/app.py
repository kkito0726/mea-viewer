from flask import Flask, request, jsonify
from flask_cors import CORS
from lib.plot import showAll
from pyMEA.MEA import MEA

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "Hello Flask!!"

@app.route("/showAll", methods=["POST"])
def plot_showAll():
    start = int(request.json["start"] - 1)
    if start < 0:
        start = 0
    end = int(request.json["end"] + 1)
    data = MEA(request.json["hed_path"], start, end)
    image = showAll(
        data,
        request.json["start"],
        request.json["end"],
        request.json["volt_min"],
        request.json["volt_max"],
        dpi=request.json["dpi"]
    )

    return jsonify({"imgSrc": image})
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)