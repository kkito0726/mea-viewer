from marshmallow import fields

from db import db, ma


class RasterPlotImage(db.Model):
    __tablename__ = "raster_plot_images"
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


class RasterPlotImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RasterPlotImage
