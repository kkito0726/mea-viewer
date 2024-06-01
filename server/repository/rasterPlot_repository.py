from model.RasterPlotImage import RasterPlotImage, RasterPlotImageSchema


class RasterPlotRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        rasterPlotImage = RasterPlotImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return RasterPlotImageSchema().jsonify(rasterPlotImage)

    @staticmethod
    def get_images(file_name):
        images = RasterPlotImage.get_images_by_file_name(file_name)
        return images

    @staticmethod
    def delete_image(image_url: str):
        return RasterPlotImage.delete_image_by_url(image_url)

    @staticmethod
    def delete_all_image(file_name):
        return RasterPlotImage.delete_all(file_name)
