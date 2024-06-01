from repository.minio_repository import (
    save_image,
    delete_file,
    delete_objects_in_directory,
)
from flask import request
import json


class MinioService:
    @staticmethod
    def save(file_type, image_buf, file_name):
        return save_image(file_type, image_buf, file_name)

    @staticmethod
    def delete():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        print(json_data)
        delete_file(json_data["image_url"])

    @staticmethod
    def delete_all():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        delete_objects_in_directory(json_data["directory"])
