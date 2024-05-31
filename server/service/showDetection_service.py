from repository.showDetection_repository import save_image, get_images, delete_image


def insert(image_url: str, filename: str):
    return save_image(image_url, filename)


def select(filename: str):
    return get_images(filename)


def delete(id: int):
    return delete_image(id)
