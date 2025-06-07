import json

from db import db
from model.ShowShingleImage import ShowSingleImage, ShowSingleImageSchema


class ShowSingleRepository:
    @staticmethod
    def save_image(ch: int, image_url: str, file_name: str):
        showShingleImage = ShowSingleImage(
            ch=ch, image_url=image_url, file_name=file_name
        ).create_image()
        return ShowSingleImageSchema().dump(showShingleImage.serialize())

    @staticmethod
    def get_images(file_name):
        images = ShowSingleImage.query.filter_by(file_name=file_name).all()
        image_list = [image.serialize() for image in images]
        return json.dumps(image_list)

    @staticmethod
    def delete_image(image_url: str):
        db.session.query(ShowSingleImage).filter_by(image_url=image_url).delete()
        db.session.commit()

    @staticmethod
    def delete_all_image(file_name):
        db.session.query(ShowSingleImage).filter_by(file_name=file_name).delete()
        db.session.commit()
