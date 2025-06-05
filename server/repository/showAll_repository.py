import json

from db import db
from model.ShowAllImage import ShowAllImage, ShowAllImageSchema


class ShowAllRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        showAllImage = ShowAllImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return ShowAllImageSchema().jsonify(showAllImage)

    @staticmethod
    def get_images(file_name):
        images = ShowAllImage.query.filter_by(file_name=file_name).all()
        image_list = [image.serialize() for image in images]
        return json.dumps(image_list)

    @staticmethod
    def delete_image(image_url: str):
        db.session.query(ShowAllImage).filter_by(image_url=image_url).delete()
        db.session.commit()

    @staticmethod
    def delete_all_image(file_name):
        db.session.query(ShowAllImage).filter_by(file_name=file_name).delete()
        db.session.commit()
