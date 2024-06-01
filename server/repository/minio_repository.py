from s3 import minio_client
from datetime import datetime
from urllib.parse import urlparse

BUCKET_NAME = "plot-figure"


def save_image(file_type, image_buf, file_name):
    ensure_bucket_exists(BUCKET_NAME)

    now = str(datetime.today()).replace(" ", "-")
    obj_name = f"images/{file_type}/{file_name}_{file_type}_{now}.png"
    minio_client.put_object(
        BUCKET_NAME,
        obj_name,
        image_buf,
        length=image_buf.getbuffer().nbytes,
        content_type="image/png",
    )

    image_url = f"http://localhost:9000/{BUCKET_NAME}/{obj_name}"
    return image_url


# ファイルを削除する関数
def delete_file(url):
    bucket_name, object_name = extract_bucket_and_object(url)
    try:
        minio_client.remove_object(bucket_name, object_name)
        print(f"Object {object_name} removed successfully from bucket {bucket_name}")
    except Exception as e:
        print(f"Error removing object: {e}")


# バケット内の指定されたディレクトリの全てのオブジェクトを削除する関数
def delete_objects_in_directory(directory):
    try:
        objects = minio_client.list_objects(
            BUCKET_NAME, prefix=directory, recursive=True
        )
        for obj in objects:
            minio_client.remove_object(BUCKET_NAME, obj.object_name)
    except Exception as e:
        print(f"Error deleting objects: {e}")


def ensure_bucket_exists(bucket_name):
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)


def extract_bucket_and_object(url):
    parsed_url = urlparse(url)
    if parsed_url.scheme != "http" and parsed_url.scheme != "https":
        raise ValueError(
            "Invalid URL scheme. Only 'http' and 'https' schemes are supported."
        )

    parts = parsed_url.path.split("/", 2)
    if len(parts) < 3:
        raise ValueError("Invalid URL format. Bucket name and object name are missing.")

    bucket_name = parts[1]
    object_name = parts[2]

    return bucket_name, object_name
