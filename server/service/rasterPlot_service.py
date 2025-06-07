import json

from flask import request

from repository.rasterPlot_repository import RasterPlotRepository


class RasterPlotService:
    @staticmethod
    def insert(image_url: str, file_name: str):
        return RasterPlotRepository.save_image(image_url, file_name)

    @staticmethod
    def select(filename: str):
        return RasterPlotRepository.get_images(filename)

    @staticmethod
    def delete():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        RasterPlotRepository.delete_image(json_data["image_url"])

    @staticmethod
    def delete_all():
        json_data = request.get_data()
        if json_data:
            json_data = json.loads(json_data)
        RasterPlotRepository.delete_all_image(json_data["file_name"])
