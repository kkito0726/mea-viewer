from flask import Blueprint, jsonify
from service.rasterPlot_service import RasterPlotService
from service.mino_service import MinioService


rasterPlot_crud = Blueprint("rasterPlot_crud", __name__)


@rasterPlot_crud.route("/crud/rasterPlot/<file_name>", methods=["GET"])
def get_images(file_name):
    return RasterPlotService.select(file_name)


@rasterPlot_crud.route("/crud/rasterPlot", methods=["DELETE"])
def delete_image():
    MinioService.delete()
    RasterPlotService.delete()
    return jsonify({"message": "Resource deleted successfully"}), 200


@rasterPlot_crud.route("/crud/rasterPlot/all", methods=["DELETE"])
def delete_all_images():
    MinioService.delete_all()
    RasterPlotService.delete_all()
    return jsonify({"message": "Resource deleted successfully"}), 200
