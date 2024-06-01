from repository.showAll_repository import ShowAllRepository
from flask import request
import json


class ShowAllService:
    @staticmethod
    def insert(image_url: str, file_name: str):
        return ShowAllRepository.save_image(image_url, file_name)

    @staticmethod
    def select(filename: str):
        return ShowAllRepository.get_images(filename)

    @staticmethod
    def delete():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        ShowAllRepository.delete_image(json_data["image_url"])

    @staticmethod
    def delete_all():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        ShowAllRepository.delete_all_image(json_data["file_name"])
