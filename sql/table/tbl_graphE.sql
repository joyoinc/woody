
CREATE TABLE IF NOT EXISTS tbl_graphE (
  source  int references tbl_graphV(id), 
  sink    int references tbl_graphV(id) 
);

INSERT INTO cfg_table(key) VALUES ('/tables/tbl_graphE');
