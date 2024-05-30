import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path)


MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD")
MYSQL_ROOT_USER = os.environ.get("MYSQL_ROOT_USER")
MYSQL_HOST = os.environ.get("MYSQL_HOST")
MYSQL_DB = os.environ.get("MYSQL_DB")
