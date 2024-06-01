from repository.showDetection_repository import (
    save_image,
    get_images,
    delete_image,
    delete_all_image,
)
from flask import request
import json


class ShowDetectionService:
    @staticmethod
    def insert(image_url: str, file_name: str):
        return save_image(image_url, file_name)

    @staticmethod
    def select(filename: str):
        return get_images(filename)

    @staticmethod
    def delete():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        delete_image(json_data["image_url"])

    @staticmethod
    def delete_all():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        delete_all_image(json_data["file_name"])
