import json

from db import db
from model.ShowDetectionImage import ShowDetectionImage, ShowDetectionSchema


class ShowDetectionRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        showDetectionImage = ShowDetectionImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return ShowDetectionSchema().jsonify(showDetectionImage)

    @staticmethod
    def get_images(file_name: str) -> str:
        images = ShowDetectionImage.query.filter_by(file_name=file_name).all()
        image_list = [image.serialize() for image in images]
        return json.dumps(image_list)

    @staticmethod
    def delete_image(image_url: str):
        db.session.query(ShowDetectionImage).filter_by(image_url=image_url).delete()
        db.session.commit()

    @staticmethod
    def delete_all_image(file_name):
        db.session.query(ShowDetectionImage).filter_by(file_name=file_name).delete()
        db.session.commit()
