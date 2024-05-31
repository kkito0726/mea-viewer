from db import db, ma
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp
from marshmallow import fields


class Draw2dImage(db.Model):
    __tablename__ = "draw2d_image"
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
    def get_image(image_id):
        return Draw2dImage.query.get(image_id)

    @staticmethod
    def get_all_images():
        return Draw2dImage.query.all()

    def delete_image(self):
        db.session.delete(self)
        db.session.commit()


class Draw2dImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Draw2dImage

    # `created_at` フィールドを除外する
    created_at = fields.DateTime(dump_only=True)
