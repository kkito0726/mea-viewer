from model.PlotPeaksImage import PlotPeaksImage, PlotPeaksImageSchema


class PlotPeaksRepository:
    @staticmethod
    def save_image(ch: int, image_url: str, file_name: str):
        plotPeaksImage = PlotPeaksImage(
            ch=ch, image_url=image_url, file_name=file_name
        ).create_image()
        return PlotPeaksImageSchema().dump(plotPeaksImage.serialize())
