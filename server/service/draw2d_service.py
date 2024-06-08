from repository.draw2d_repository import Draw2dRepository
from flask import request
import json


class Draw2dService:
    @staticmethod
    def inserts(image_urls: list[str], file_name: str):
        return [
            Draw2dRepository.save_image(image_url, file_name)
            for image_url in image_urls
        ]

    @staticmethod
    def select(filename: str):
        return Draw2dRepository.get_images(filename)

    @staticmethod
    def delete():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        Draw2dRepository.delete_image(json_data["image_url"])

    @staticmethod
    def delete_all():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        Draw2dRepository.delete_all_image(json_data["file_name"])
