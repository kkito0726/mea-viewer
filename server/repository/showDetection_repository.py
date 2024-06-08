from model.ShowDetectionImage import ShowDetectionImage, ShowDetectionSchema


class ShowDetectionRepository:
    @staticmethod
    def save_image(image_url: str, file_name: str):
        showDetectionImage = ShowDetectionImage(
            image_url=image_url, file_name=file_name
        ).create_image()
        return ShowDetectionSchema().jsonify(showDetectionImage)

    @staticmethod
    def get_images(file_name):
        images = ShowDetectionImage.get_images_by_file_name(file_name)
        return images

    @staticmethod
    def delete_image(image_url: str):
        return ShowDetectionImage.delete_image_by_url(image_url)

    @staticmethod
    def delete_all_image(file_name):
        return ShowDetectionImage.delete_all(file_name)
