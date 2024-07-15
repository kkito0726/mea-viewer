from db import db, ma
from marshmallow import fields


class ShowDetectionImage(db.Model):
    __tablename__ = "show_detection_images"
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


class ShowDetectionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShowDetectionImage
