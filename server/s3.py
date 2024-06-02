from minio import Minio

minio_client = Minio(
    "minio:9000", access_key="minio_admin", secret_key="minio_pass", secure=False
)
