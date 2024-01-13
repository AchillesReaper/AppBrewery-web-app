CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    country_code CHAR(2),
    country_name VARCHAR(100)
)

-- import data from `countries.csv` --

CREATE TABLE members(
    id SERIAL PRIMARY KEY,
    name VARCHAR(15) UNIQUE not NULL,
    color VARCHAR(15)
);

-- update family member --
INSERT INTO members (name, color)
VALUES ('Angela', 'teal'), ('Jack', 'powderblue');

SELECT * FROM members


-- new table containing all family member --
CREATE TABLE visited_countries_family(
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    members_id INTEGER REFERENCES members(id)
);

INSERT INTO visited_countries_family (country_code, members_id)
VALUES ('FR', 1), ('GB', 1), ('CA', 2), ('FR', 2 );

SELECT *
FROM visited_countries_family
JOIN members
ON members.id = members_id;