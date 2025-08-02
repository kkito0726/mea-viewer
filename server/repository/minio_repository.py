from datetime import datetime
from urllib.parse import urlparse

from s3 import minio_client
from server.enums.FigType import FigType

BUCKET_NAME = "plot-figure"


class MinioRepository:
    @staticmethod
    def save_image(fig_type: FigType, image_buf, file_name):
        ensure_bucket_exists(BUCKET_NAME)

        now = str(datetime.today()).replace(" ", "-")
        name_path = f"images/{fig_type.value}/{file_name}_{fig_type.value}_{now}"
        if fig_type in fig_type.image_fig_type_list:
            obj_name = name_path + ".png"
        else:
            obj_name = name_path + ".gif"

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
    @staticmethod
    def delete_file(url):
        bucket_name, object_name = extract_bucket_and_object(url)
        try:
            minio_client.remove_object(bucket_name, object_name)
        except Exception as e:
            print(f"Error removing object: {e}")

    # バケット内の指定されたディレクトリの全てのオブジェクトを削除する関数
    @staticmethod
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
