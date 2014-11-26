
CREATE TABLE IF NOT EXISTS tbl_graphV (
  id    SERIAL PRIMARY KEY,
  name  varchar(64) NOT NULL
);

INSERT INTO cfg_table(key) VALUES ('/tables/tbl_graphV');
