import json

from flask import request

from repository.showDetection_repository import ShowDetectionRepository


class ShowDetectionService:
    @staticmethod
    def insert(image_url: str, file_name: str):
        return ShowDetectionRepository.save_image(image_url, file_name)

    @staticmethod
    def select(filename: str):
        return ShowDetectionRepository.get_images(filename)

    @staticmethod
    def delete():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        ShowDetectionRepository.delete_image(json_data["image_url"])

    @staticmethod
    def delete_all():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        ShowDetectionRepository.delete_all_image(json_data["file_name"])
