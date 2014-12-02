-- create table file
CREATE TABLE IF NOT EXISTS tbl_file (
  fileId      serial PRIMARY KEY,
  accessLink  text NOT NULL,
  createAt    timestamp WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);
INSERT INTO cfg_table(key) VALUES ('/tables/tbl_file');

-- create table item
CREATE TABLE IF NOT EXISTS tbl_item (
  itemId      serial PRIMARY KEY,
  typeId      smallint,
  itemName    varchar(64) NOT NULL,
  itemDetail  text,
  thumbnail   smallint
);

INSERT INTO cfg_table(key) VALUES ('/tables/tbl_item');
