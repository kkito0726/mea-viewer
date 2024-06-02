from model.Draw2dImage import Draw2dImage, Draw2dImageSchema


class Draw2dRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        draw2dImage = Draw2dImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return Draw2dImageSchema().dump(draw2dImage.serialize())

    @staticmethod
    def get_images(file_name):
        images = Draw2dImage.get_images_by_file_name(file_name)
        return images

    @staticmethod
    def delete_image(image_url: str):
        return Draw2dImage.delete_image_by_url(image_url)

    @staticmethod
    def delete_all_image(file_name):
        return Draw2dImage.delete_all(file_name)
