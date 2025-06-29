from datetime import datetime

from db import db, ma
from sqlalchemy import DateTime


class FigImage(db.Model):
    __tablename__ = "fig_images"

    id = db.Column(db.Integer, primary_key=True)
    ch = db.Column(db.Integer, nullable=True)
    fig_type = db.Column(db.String(20), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(DateTime, default=datetime.now)
    updated_at = db.Column(DateTime, default=datetime.now, onupdate=datetime.now)

    def serialize(self):
        return {
            "id": self.id,
            "ch": self.ch,
            "fig_type": self.fig_type,
            "image_url": self.image_url,
            "file_name": self.file_name,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    def create_image(self):
        db.session.add(self)
        db.session.commit()
        return self


class FigImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = FigImage
