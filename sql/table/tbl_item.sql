CREATE TABLE IF NOT EXISTS tbl_item (
  itemId      SERIAL PRIMARY KEY,
  typeId      smallint,
  itemName    varchar(64) NOT NULL,
  itemDetail  text,
  thumbnail   smallint
);
