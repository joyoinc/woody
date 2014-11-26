CREATE TABLE IF NOT EXISTS tbl_file (
  fileId      serial PRIMARY KEY,
  accessLink  text NOT NULL,
  createAt    timestamp WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

INSERT INTO cfg_table(key) VALUES ('/tables/tbl_file');
