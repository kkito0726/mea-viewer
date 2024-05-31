from db import db, ma
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp
from marshmallow import fields


class ShowDetectionImage(db.Model):
    __tablename__ = "showDetection_image"
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(
        Timestamp, server_default=current_timestamp(), nullable=False
    )

    def create_image(self):
        db.session.add(self)
        db.session.commit()
        return self

    @staticmethod
    def get_images_by_file_name(file_name):
        return ShowDetectionImage.query.filter_by(file_name=file_name).all()

    @staticmethod
    def delete_image_by_id(id):
        ShowDetectionImage.query.filter_by(id=id).delete()

    @staticmethod
    def delete_all(file_name):
        return ShowDetectionImage.query.filter_by(file_name=file_name).delete()


class ShowDetectionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShowDetectionImage

    # `created_at` フィールドを除外する
    created_at = fields.DateTime(dump_only=True)
