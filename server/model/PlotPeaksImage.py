from db import db, ma


class PlotPeaksImage(db.Model):
    __tablename__ = "plot_peaks_images"
    id = db.Column(db.Integer, primary_key=True)
    ch = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)

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


class PlotPeaksImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlotPeaksImage
