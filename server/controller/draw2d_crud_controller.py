from flask import Blueprint, jsonify

from service.draw2d_service import Draw2dService
from service.mino_service import MinioService

draw_2d_crud = Blueprint("draw_2d_crud", __name__)


@draw_2d_crud.route("/crud/draw2d/<file_name>", methods=["GET"])
def get_images(file_name):
    return Draw2dService.select(file_name)


@draw_2d_crud.route("/crud/draw2d", methods=["DELETE"])
def delete_image():
    MinioService.delete()
    Draw2dService.delete()
    return jsonify({"message": "Resource deleted successfully"}), 200


@draw_2d_crud.route("/crud/draw2d/all", methods=["DELETE"])
def delete_all_images():
    MinioService.delete_all()
    Draw2dService.delete_all()
    return jsonify({"message": "Resource deleted successfully"}), 200
