from flask import Blueprint, jsonify
from service.fig_service import (
    showAllService,
    showSingleService,
    showDetectionService,
    rasterPlotService,
    draw_2d_service,
    draw_3d_service,
)
from service.mino_service import MinioService
from service.showDetection_service import ShowDetectionService
from service.showAll_service import ShowAllService
from service.rasterPlot_service import RasterPlotService
from service.draw2d_service import Draw2dService
from enums.FigType import FigType

figure = Blueprint("figure", __name__)


@figure.route("/showAll", methods=["POST"])
def plot_showAll():
    img_buf, file_name = showAllService()
    img_url = MinioService.save(FigType.SHOW_ALL.value, img_buf, file_name)
    img_response = ShowAllService.insert(img_url, file_name)
    return img_response


@figure.route("/showSingle", methods=["POST"])
def show_single():
    images, chs = showSingleService()
    return jsonify({"imgSrc": images, "chs": chs})


@figure.route("/showDetection", methods=["POST"])
def show_detection():
    img_buf, file_name = showDetectionService()
    img_url = MinioService.save(FigType.SHOW_DETECTION.value, img_buf, file_name)
    img_response = ShowDetectionService.insert(img_url, file_name)
    return img_response


@figure.route("/rasterPlot", methods=["POST"])
def raster_plot():
    img_buf, file_name = rasterPlotService()
    img_url = MinioService.save(FigType.RASTER_PLOT.value, img_buf, file_name)
    img_response = RasterPlotService.insert(img_url, file_name)
    return img_response


@figure.route("/draw2d", methods=["POST"])
def draw2d():
    image_bufs, file_name = draw_2d_service()
    image_urls = MinioService.saves(FigType.DRAW_2D.value, image_bufs, file_name)
    image_responses = Draw2dService.inserts(image_urls, file_name)
    print(image_responses)
    return jsonify(image_responses), 200


@figure.route("/draw3d", methods=["POST"])
def drae3d():
    images = draw_3d_service()
    return jsonify({"imgSrc": images})
