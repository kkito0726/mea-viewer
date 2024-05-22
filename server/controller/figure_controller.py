from flask import Blueprint, jsonify
from service.service import (
    showAllService,
    showSingleService,
    showDetectionService,
    rasterPlotService,
    draw_2d_service,
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


@figure.route("/rasterPlot", methods=["POST"])
def raster_plot():
    image = rasterPlotService()
    return jsonify({"imgSrc": [image]})


@figure.route("/draw2d", methods=["POST"])
def draw2d():
    images = draw_2d_service()
    return jsonify({"imgSrc": images})
