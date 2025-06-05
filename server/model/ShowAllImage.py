from marshmallow import fields
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp

from db import db, ma


class ShowAllImage(db.Model):
    __tablename__ = "show_all_images"
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "file_name": self.file_name,
        }

    def create_image(self):
        db.session.add(self)
        db.session.commit()
        return self


class ShowAllImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShowAllImage
