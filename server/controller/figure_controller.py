from flask import Blueprint, jsonify
from service.service import (
    showAllService,
    showSingleService,
    showDetectionService,
    rasterPlotService,
    draw_2d_service,
    draw_3d_service,
)
from service import mino_service, showDetection_service
from enums.FigType import FigType

figure = Blueprint("figure", __name__)


@figure.route("/showAll", methods=["POST"])
def plot_showAll():
    image = showAllService()
    return jsonify({"imgSrc": [image]})


@figure.route("/showSingle", methods=["POST"])
def show_single():
    images, chs = showSingleService()
    return jsonify({"imgSrc": images, "chs": chs})


@figure.route("/showDetection", methods=["POST"])
def show_detection():
    img_buf, filename = showDetectionService()
    img_url = mino_service.save(FigType.SHOW_DETECTION, img_buf)
    img_response = showDetection_service.insert(img_url, filename)
    return img_response


@figure.route("/rasterPlot", methods=["POST"])
def raster_plot():
    image = rasterPlotService()
    return jsonify({"imgSrc": [image]})


@figure.route("/draw2d", methods=["POST"])
def draw2d():
    images = draw_2d_service()
    return jsonify({"imgSrc": images})


@figure.route("/draw3d", methods=["POST"])
def drae3d():
    images = draw_3d_service()
    return jsonify({"imgSrc": images})
