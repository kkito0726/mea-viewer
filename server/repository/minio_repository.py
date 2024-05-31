from s3 import minio_client
from datetime import datetime

BUCKET_NAME = "plot_figure"


def save_image(file_type, image_buf):
    ensure_bucket_exists(BUCKET_NAME)

    now = str(datetime.today()).replace(" ", "-")
    obj_name = f"images/{file_type}/{file_type}_{now}.png"
    minio_client.put_object(
        BUCKET_NAME,
        obj_name,
        image_buf,
        length=image_buf.getbuffer().nbytes,
        content_type="image/png",
    )

    image_url = f"http://localhost:9000/{BUCKET_NAME}/{obj_name}"
    return image_url


def ensure_bucket_exists(bucket_name):
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
