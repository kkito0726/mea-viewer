from flask import Blueprint, jsonify
from service.service import (
    showAllService,
    showSingleService,
    showDetectionService,
    rasterPlotService,
)

figure = Blueprint("figure", __name__)


@figure.route("/showAll", methods=["POST"])
def plot_showAll():
    image = showAllService()
    return jsonify({"imgSrc": [image]})


@figure.route("/showSingle", methods=["POST"])
def show_single():
    image = showSingleService()
    return jsonify({"imgSrc": [image]})


@figure.route("/showDetection", methods=["POST"])
def show_detection():
    image = showDetectionService()
    return jsonify({"imgSrc": [image]})


@figure.route("/rasterPlot", methods={"POST"})
def raster_plot():
    image = rasterPlotService()
    return jsonify({"imgSrc": [image]})


