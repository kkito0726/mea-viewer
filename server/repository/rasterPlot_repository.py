from model.RasterPlotImage import RasterPlotImage, RasterPlotImageSchema
import json
from db import db


class RasterPlotRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        rasterPlotImage = RasterPlotImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return RasterPlotImageSchema().jsonify(rasterPlotImage)

    @staticmethod
    def get_images(file_name: str) -> str:
        images = RasterPlotImage.query.filter_by(file_name=file_name).all()
        image_list = [image.serialize() for image in images]
        return json.dumps(image_list)

    @staticmethod
    def delete_image(image_url: str):
        db.session.query(RasterPlotImage).filter_by(image_url=image_url).delete()
        db.session.commit()

    @staticmethod
    def delete_all_image(file_name):
        db.session.query(RasterPlotImage).filter_by(file_name=file_name).delete()
        db.session.commit()
