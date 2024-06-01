import settings


class SystemConfig:
    # Flask
    DEBUG = True

    # SQLAlchemy
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://{user}:{password}@{host}/{db}?charset=utf8mb4".format(
            **{
                "user": settings.MYSQL_ROOT_USER,
                "password": settings.MYSQL_PASSWORD,
                "host": settings.MYSQL_HOST,
                "db": settings.MYSQL_DB,
            }
        )
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False  # Print executed SQL


Config = SystemConfig
