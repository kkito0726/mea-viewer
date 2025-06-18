from model.FigImage import FigImage, FigImageSchema


class FigImageRepository:
    @staticmethod
    def insert(fig_image: FigImage):
        res = fig_image.create_image()
        return FigImageSchema().dump(res.serialize())
