from flask import Blueprint, jsonify
from service.showDetection_service import ShowDetectionService
from service.mino_service import MinioService


showDetection_crud = Blueprint("showDetection_crud", __name__)


@showDetection_crud.route("/crud/showDetection/<file_name>", methods=["GET"])
def get_images(file_name):
    return ShowDetectionService.select(file_name)


@showDetection_crud.route("/crud/showDetection", methods=["DELETE"])
def delete_image():
    MinioService.delete()
    ShowDetectionService.delete()
    return jsonify({"message": "Resource deleted successfully"}), 200


@showDetection_crud.route("/crud/showDetection/all", methods=["DELETE"])
def delete_all_images():
    MinioService.delete_all()
    ShowDetectionService.delete_all()
    return jsonify({"message": "Resource deleted successfully"}), 200
