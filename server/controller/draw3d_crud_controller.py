from flask import Blueprint, jsonify

from service.draw3d_service import Draw3dService
from service.mino_service import MinioService

draw_3d_crud = Blueprint("draw_3d_crud", __name__)


@draw_3d_crud.route("/crud/draw3d/<file_name>", methods=["GET"])
def get_images(file_name):
    return Draw3dService.select(file_name)


@draw_3d_crud.route("/crud/draw3d", methods=["DELETE"])
def delete_image():
    MinioService.delete()
    Draw3dService.delete()
    return jsonify({"message": "Resource deleted successfully"}), 200


@draw_3d_crud.route("/crud/draw3d/all", methods=["DELETE"])
def delete_all_images():
    MinioService.delete_all()
    Draw3dService.delete_all()
    return jsonify({"message": "Resource deleted successfully"}), 200
