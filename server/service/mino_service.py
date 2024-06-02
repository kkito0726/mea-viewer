from repository.minio_repository import MinioRepository
from flask import request
import json


class MinioService:
    @staticmethod
    def save(file_type, image_buf, file_name):
        return MinioRepository.save_image(file_type, image_buf, file_name)

    @staticmethod
    def saves(file_type, image_bufs, file_name):
        image_urls = [
            MinioRepository.save_image(file_type, image_buf, file_name)
            for image_buf in image_bufs
        ]
        return image_urls

    @staticmethod
    def delete():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        MinioRepository.delete_file(json_data["image_url"])

    @staticmethod
    def delete_all():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        MinioRepository.delete_objects_in_directory(json_data["directory"])
