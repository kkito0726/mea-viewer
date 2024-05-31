from model.ShowDetectionImage import ShowDetectionImage, ShowDetectionSchema


def save_image(image_url: str, filename: str):
    showDetectionImage = ShowDetectionImage(
        image_url=image_url, filename=filename
    ).create_image()
    return ShowDetectionSchema().jsonify(showDetectionImage)


def get_images(file_name):
    images = ShowDetectionImage.get_images_by_file_name(file_name)
    return ShowDetectionSchema().jsonify(images)


def delete_image(id: int):
    ShowDetectionImage.delete_image_by_id(id)


def delete_all_image(file_name):
    ShowDetectionImage.delete_all_image(file_name)
