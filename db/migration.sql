DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    prep_time VARCHAR(255),
    cook_time VARCHAR(255),
    ingredients TEXT,
    directions TEXT
);
