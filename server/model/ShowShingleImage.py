from db import db, ma
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp
from marshmallow import fields


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


class ShowSingleImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShowSingleImage

    # `created_at` フィールドを除外する
    created_at = fields.DateTime(dump_only=True)
