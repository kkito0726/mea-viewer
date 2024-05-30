from db import db, ma
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp
from marshmallow import fields


class ShowDetectionImage(db.Model):
    __tablename__ = "showDetection_image"
    id = db.Column(db.Integer, primary_key=True)
    image_data = db.Column(db.Text, nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(
        Timestamp, server_default=current_timestamp(), nullable=False
    )

    def create_image(self):
        db.session.add(self)
        db.session.commit()
        return self

    @staticmethod
    def get_image(image_id):
        return ShowDetectionImage.query.get(image_id)

    @staticmethod
    def get_all_images():
        return ShowDetectionImage.query.all()

    @staticmethod
    def delete_image_by_id(image_id):
        image = ShowDetectionImage.query.get(image_id)
        if image:
            db.session.delete(image)
            db.session.commit()
            return True
        return False

    def delete_image(self):
        db.session.delete(self)
        db.session.commit()


class ShowDetectionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShowDetectionImage

    # `created_at` フィールドを除外する
    created_at = fields.DateTime(dump_only=True)
