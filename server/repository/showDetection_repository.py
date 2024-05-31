from model.ShowDetectionImage import ShowDetectionImage, ShowDetectionSchema


def save_image(image_url: str, filename: str):
    showDetectionImage = ShowDetectionImage(
        image_url=image_url, filename=filename
    ).create_image()
    return ShowDetectionSchema().jsonify(showDetectionImage)


def get_images(file_name):
    images = ShowDetectionImage.get_images_by_file_name(file_name)
    return ShowDetectionSchema().jsonify(images)


def delete_image(image_id: int) -> bool:
    return ShowDetectionImage.delete_image_by_id(image_id)
