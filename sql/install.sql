-- use \d <table> to show tables schema
-- use \dt to list tables in db
-- use \i <script> to run script

DROP TABLE IF EXISTS tbl_graphE;
DROP TABLE IF EXISTS tbl_graphV CASCADE;
DROP TABLE IF EXISTS tbl_item;
DROP TABLE IF EXISTS tbl_file;

DROP TABLE IF EXISTS cfg_table;
CREATE TABLE cfg_table (
  key     varchar(256) PRIMARY KEY NOT NULL,
  value   text
);


-- group all delta scripts order by date
\i sql/table/2014-10-5.sql
\i sql/data/2014-10-5.sql
\i sql/table/2014-11-25.sql
\i sql/data/2014-11-25.sql
