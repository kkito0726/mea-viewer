FROM gradle:jdk21 AS build

ARG BUILD_DIR=/home/build

COPY ./backend/figure-management ${BUILD_DIR}/figure-management
COPY ./backend/generateJooq ${BUILD_DIR}/generateJooq
COPY ./backend/build.gradle ${BUILD_DIR}
COPY ./backend/settings.gradle ${BUILD_DIR}

WORKDIR ${BUILD_DIR}

RUN gradle figure-management:build

FROM openjdk:21

RUN mkdir /app

COPY --from=build "/home/build/figure-management/build/libs/*.jar" /app/app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]