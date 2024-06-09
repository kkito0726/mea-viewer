from model.Draw2dImage import Draw2dImage, Draw2dImageSchema
import json
from db import db


class Draw2dRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        draw2dImage = Draw2dImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return Draw2dImageSchema().dump(draw2dImage.serialize())

    @staticmethod
    def get_images(file_name: str) -> str:
        images = Draw2dImage.query.filter_by(file_name=file_name).all()
        image_list = [image.serialize() for image in images]
        return json.dumps(image_list)

    @staticmethod
    def delete_image(image_url: str) -> str:
        db.session.query(Draw2dImage).filter_by(image_url=image_url).delete()
        db.session.commit()

    @staticmethod
    def delete_all_image(file_name: str) -> str:
        db.session.query(Draw2dImage).filter_by(file_name=file_name).delete()
        db.session.commit()
