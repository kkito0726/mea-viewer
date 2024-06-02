from flask import Blueprint, jsonify
from service.showSingle_service import ShowSingleService
from service.mino_service import MinioService


showSingle_crud = Blueprint("showSingle_crud", __name__)


@showSingle_crud.route("/crud/showSingle/<file_name>", methods=["GET"])
def get_images(file_name):
    return ShowSingleService.select(file_name)


@showSingle_crud.route("/crud/showSingle", methods=["DELETE"])
def delete_image():
    MinioService.delete()
    ShowSingleService.delete()
    return jsonify({"message": "Resource deleted successfully"}), 200


@showSingle_crud.route("/crud/showSingle/all", methods=["DELETE"])
def delete_all_images():
    MinioService.delete_all()
    ShowSingleService.delete_all()
    return jsonify({"message": "Resource deleted successfully"}), 200
