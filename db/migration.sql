DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS recipes;


CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    image_link VARCHAR(255)
);



-- CREATE TABLE recipes (
--     id SERIAL PRIMARY KEY,
--     imgage varchar,
--     name varchar
-- )