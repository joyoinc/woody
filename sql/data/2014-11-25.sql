INSERT INTO tbl_graphV(name) VALUES ('系统保留态1');
INSERT INTO tbl_graphV(name) VALUES ('系统保留态2');
INSERT INTO tbl_graphV(name) VALUES ('系统保留态3');
INSERT INTO tbl_graphV(name) VALUES ('系统保留态4');
INSERT INTO tbl_graphV(name) VALUES ('系统保留态5');
INSERT INTO tbl_graphV(name) VALUES ('系统保留态6');
INSERT INTO tbl_graphV(name) VALUES ('系统保留态7');
INSERT INTO tbl_graphV(name) VALUES ('系统保留态8');
INSERT INTO tbl_graphV(name) VALUES ('系统保留态9');
INSERT INTO tbl_graphV(name) VALUES ('未命名态1');
INSERT INTO tbl_graphV(name) VALUES ('未命名态2');

UPDATE tbl_graphV SET (name) = ('初始态') WHERE id = 1;
UPDATE tbl_graphV SET (name) = ('终止态') WHERE id = 2;

INSERT INTO tbl_graphE(source, sink) VALUES (1, 10);
INSERT INTO tbl_graphE(source, sink) VALUES (1, 2);
INSERT INTO tbl_graphE(source, sink) VALUES (10, 11);
INSERT INTO tbl_graphE(source, sink) VALUES (11, 2);
INSERT INTO tbl_graphE(source, sink) VALUES (2, 1);
