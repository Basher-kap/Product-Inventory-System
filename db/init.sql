-- db/init.sql

CREATE TABLE IF NOT EXISTS users (
    id       SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name  VARCHAR(100) DEFAULT '',
    middle_name VARCHAR(100) DEFAULT '',
    last_name   VARCHAR(100) DEFAULT '',
    address     TEXT         DEFAULT '',
    email       VARCHAR(255) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS products (
    id            SERIAL PRIMARY KEY,
    product_code  VARCHAR(50)      NOT NULL UNIQUE,
    product_name  VARCHAR(255)     NOT NULL,
    quantity      INTEGER          NOT NULL DEFAULT 0,
    unit_price    NUMERIC(10,2)    NOT NULL DEFAULT 0,
    product_image TEXT             DEFAULT ''
);

CREATE TABLE IF NOT EXISTS cart_items (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100)     NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    product_code  VARCHAR(50)      NOT NULL,
    product_name  VARCHAR(255)     NOT NULL,
    unit_price    NUMERIC(10,2)    NOT NULL,
    product_image TEXT             DEFAULT '',
    quantity      INTEGER          NOT NULL DEFAULT 1,
    UNIQUE(username, product_code)
);