CREATE TABLE IF NOT EXISTS tbl_file (
  fileId      SERIAL PRIMARY KEY,
  accessLink  text NOT NULL,
  createAt    timestamp WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);
