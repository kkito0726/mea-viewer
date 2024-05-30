from db import db, ma
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp
from marshmallow import fields


class ShowSingleImage(db.Model):
    __tablename__ = "showSingle_image"
    id = db.Column(db.Integer, primary_key=True)
    ch = db.Column(db.Integer, nullable=False)
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
        return ShowSingleImage.query.get(image_id)

    @staticmethod
    def get_all_images():
        return ShowSingleImage.query.all()

    def delete_image(self):
        db.session.delete(self)
        db.session.commit()


class ShowSingleImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShowSingleImage

    # `created_at` フィールドを除外する
    created_at = fields.DateTime(dump_only=True)
