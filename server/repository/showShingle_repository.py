from model.ShowShingleImage import ShowSingleImage, ShowSingleImageSchema


class ShowSingleRepository:
    @staticmethod
    def save_image(ch: int, image_url: str, file_name: str):
        showShingleImage = ShowSingleImage(
            ch=ch, image_url=image_url, file_name=file_name
        ).create_image()
        return ShowSingleImageSchema().dump(showShingleImage.serialize())

    @staticmethod
    def get_images(file_name):
        images = ShowSingleImage.get_images_by_file_name(file_name)
        return images

    @staticmethod
    def delete_image(image_url: str):
        return ShowSingleImage.delete_image_by_url(image_url)

    @staticmethod
    def delete_all_image(file_name):
        return ShowSingleImage.delete_all(file_name)
