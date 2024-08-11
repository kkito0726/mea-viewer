CREATE TABLE show_all_images (
    id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    ch INTEGER
    image_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE show_single_images (
    id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    ch INTEGER
    image_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE show_detection_images (
    id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    ch INTEGER
    image_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE raster_plot_images (
    id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    ch INTEGER
    image_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE draw2d_images (
    id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    ch INTEGER
    image_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE draw3d_images (
    id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    ch INTEGER
    image_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);