from flask import Blueprint, jsonify
from service.showAll_service import ShowAllService
from service.mino_service import MinioService


showAll_crud = Blueprint("showAll_crud", __name__)


@showAll_crud.route("/crud/showAll/<file_name>", methods=["GET"])
def get_images(file_name):
    return ShowAllService.select(file_name)


@showAll_crud.route("/crud/showAll", methods=["DELETE"])
def delete_image():
    MinioService.delete()
    ShowAllService.delete()
    return jsonify({"message": "Resource deleted successfully"}), 200


@showAll_crud.route("/crud/showAll/all", methods=["DELETE"])
def delete_all_images():
    MinioService.delete_all()
    ShowAllService.delete_all()
    return jsonify({"message": "Resource deleted successfully"}), 200
