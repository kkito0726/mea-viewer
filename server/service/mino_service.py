import json

from flask import request

from model.FigImage import FigImage
from model.FigImageData import FigImageData
from repository.minio_repository import MinioRepository


class MinioService:
    @staticmethod
    def save(file_type, image_buf, file_name):
        return MinioRepository.save_image(file_type, image_buf, file_name)

    @staticmethod
    def saves(fig_image_data_list: list[FigImageData]):
        return [
            FigImage(
                ch=data.ch,
                fig_type=data.fig_type.value,
                image_url=MinioRepository.save_image(
                    data.fig_type.value, data.image_buf, data.filename
                ),
                file_name=data.filename,
            )
            for data in fig_image_data_list
        ]

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
