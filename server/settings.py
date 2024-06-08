import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path)


MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD")
MYSQL_ROOT_USER = os.environ.get("MYSQL_ROOT_USER")
MYSQL_DB = os.environ.get("MYSQL_DB")
if os.getenv("FLASK_ENV") == "docker":
    MYSQL_HOST = os.environ.get("MYSQL_HOST")
else:
    MYSQL_HOST = os.environ.get("MYSQL_LOCALHOST")

MINIO_ACCESS_KEY = os.environ.get("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.environ.get("MINIO_SECRET_KEY")
if os.getenv("FLASK_ENV") == "docker":
    MINIO_HOST = os.environ.get("MINIO_HOST")
else:
    MINIO_HOST = os.environ.get("MINIO_LOCALHOST")
