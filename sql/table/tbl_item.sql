CREATE TABLE IF NOT EXISTS tbl_item (
  itemId      serial PRIMARY KEY,
  typeId      smallint,
  itemName    varchar(64) NOT NULL,
  itemDetail  text,
  thumbnail   smallint
);

INSERT INTO cfg_table(key) VALUES ('/tables/tbl_item');
