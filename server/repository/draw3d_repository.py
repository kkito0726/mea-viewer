from model.Draw3dImage import Draw3dImage, Draw3dImageSchema


class Draw3dRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        draw3dImage = Draw3dImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return Draw3dImageSchema().dump(draw3dImage.serialize())

    @staticmethod
    def get_images(file_name):
        images = Draw3dImage.get_images_by_file_name(file_name)
        return images

    @staticmethod
    def delete_image(image_url: str):
        return Draw3dImage.delete_image_by_url(image_url)

    @staticmethod
    def delete_all_image(file_name):
        return Draw3dImage.delete_all(file_name)
