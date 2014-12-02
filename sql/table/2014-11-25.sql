-- create table graphV
CREATE TABLE IF NOT EXISTS tbl_graphV (
  id    SERIAL PRIMARY KEY,
  name  varchar(64) NOT NULL
);
INSERT INTO cfg_table(key) VALUES ('/tables/tbl_graphV');

-- create table graphE
CREATE TABLE IF NOT EXISTS tbl_graphE (
  source  int references tbl_graphV(id), 
  sink    int references tbl_graphV(id) 
);
INSERT INTO cfg_table(key) VALUES ('/tables/tbl_graphE');

-- alter table item
ALTER TABLE tbl_item ADD COLUMN status smallint DEFAULT 0;
UPDATE tbl_item SET (status) = (1) WHERE itemid = 3;

