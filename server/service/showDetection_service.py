from repository.showDetection_repository import (
    save_image,
    get_images,
    delete_image,
    delete_all_image,
)


def insert(image_url: str, filename: str):
    return save_image(image_url, filename)


def select(filename: str):
    return get_images(filename)


def delete(id: int):
    delete_image(id)


def delete_all(file_name):
    delete_all_image(file_name)
