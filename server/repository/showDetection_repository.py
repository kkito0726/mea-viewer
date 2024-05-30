from ..model.ShowDetectionImage import ShowDetectionImage, ShowDetectionSchema


def save_image(image: str, filename: str):
    showDetectionImage = ShowDetectionImage(
        image=image, filename=filename
    ).create_image()
    return ShowDetectionSchema().jsonify(showDetectionImage)


def get_all_images():
    images = ShowDetectionImage.get_all_images()
    return ShowDetectionSchema().jsonify(images)


def delete_image(image_id: int) -> bool:
    return ShowDetectionImage.delete_image_by_id(image_id)
