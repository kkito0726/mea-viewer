from db import db, ma
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp
from marshmallow import fields


class RasterPlotImage(db.Model):
    __tablename__ = "rasterPlot_image"
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
        return RasterPlotImage.query.get(image_id)

    @staticmethod
    def get_all_images():
        return RasterPlotImage.query.all()

    def delete_image(self):
        db.session.delete(self)
        db.session.commit()


class RasterPlotImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RasterPlotImage

    # `created_at` フィールドを除外する
    created_at = fields.DateTime(dump_only=True)
