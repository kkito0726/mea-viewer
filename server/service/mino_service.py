from repository.minio_repository import save_image


def save(file_type, image_buf):
    return save_image(file_type, image_buf)
