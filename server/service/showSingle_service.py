import json

from flask import request

from repository.showShingle_repository import ShowSingleRepository


class ShowSingleService:
    @staticmethod
    def inserts(chs: int, image_urls: list[str], file_name: str):
        return [
            ShowSingleRepository.save_image(ch, image_url, file_name)
            for ch, image_url in zip(chs, image_urls)
        ]

    @staticmethod
    def select(filename: str):
        return ShowSingleRepository.get_images(filename)

    @staticmethod
    def delete():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        ShowSingleRepository.delete_image(json_data["image_url"])

    @staticmethod
    def delete_all():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        ShowSingleRepository.delete_all_image(json_data["file_name"])
