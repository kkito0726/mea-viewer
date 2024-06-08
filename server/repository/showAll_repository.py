from model.ShowAllImage import ShowAllImage, ShowAllImageSchema


class ShowAllRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        showAllImage = ShowAllImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return ShowAllImageSchema().jsonify(showAllImage)

    @staticmethod
    def get_images(file_name):
        images = ShowAllImage.get_images_by_file_name(file_name)
        return images

    @staticmethod
    def delete_image(image_url: str):
        return ShowAllImage.delete_image_by_url(image_url)

    @staticmethod
    def delete_all_image(file_name):
        return ShowAllImage.delete_all(file_name)
