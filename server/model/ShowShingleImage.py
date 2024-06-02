from db import db, ma
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp
from marshmallow import fields
import json


class ShowSingleImage(db.Model):
    __tablename__ = "show_single_image"
    id = db.Column(db.Integer, primary_key=True)
    ch = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(
        Timestamp, server_default=current_timestamp(), nullable=False
    )

    def serialize(self):
        return {
            "id": self.id,
            "ch": self.ch,
            "image_url": self.image_url,
            "file_name": self.file_name,
        }

    def create_image(self):
        db.session.add(self)
        db.session.commit()
        return self

    @staticmethod
    def get_images_by_file_name(file_name):
        images = ShowSingleImage.query.filter_by(file_name=file_name).all()
        image_list = [image.serialize() for image in images]
        return json.dumps(image_list)

    @staticmethod
    def delete_image_by_url(url):
        db.session.query(ShowSingleImage).filter_by(image_url=url).delete()
        db.session.commit()

    @staticmethod
    def delete_all(file_name):
        db.session.query(ShowSingleImage).filter_by(file_name=file_name).delete()
        db.session.commit()


class ShowSingleImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShowSingleImage

    # `created_at` フィールドを除外する
    created_at = fields.DateTime(dump_only=True)
