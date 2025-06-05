from marshmallow import fields

from db import db, ma


class Draw2dImage(db.Model):
    __tablename__ = "draw2d_images"
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


class Draw2dImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Draw2dImage
