import json

from db import db
from model.Draw3dImage import Draw3dImage, Draw3dImageSchema


class Draw3dRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        draw3dImage = Draw3dImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return Draw3dImageSchema().dump(draw3dImage.serialize())

    @staticmethod
    def get_images(file_name):
        images = Draw3dImage.query.filter_by(file_name=file_name).all()
        image_list = [image.serialize() for image in images]
        return json.dumps(image_list)

    @staticmethod
    def delete_image(image_url: str):
        db.session.query(Draw3dImage).filter_by(image_url=image_url).delete()
        db.session.commit()

    @staticmethod
    def delete_all_image(file_name):
        db.session.query(Draw3dImage).filter_by(file_name=file_name).delete()
        db.session.commit()
