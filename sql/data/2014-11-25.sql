INSERT INTO tbl_graphV(name) VALUES
('系统保留态1'),
('系统保留态2'),
('系统保留态3'),
('系统保留态4'),
('系统保留态5'),
('系统保留态6'),
('系统保留态7'),
('系统保留态8'),
('系统保留态9'),
('未命名态1'),
('未命名态2');

UPDATE tbl_graphV SET (name) = ('初始态') WHERE id = 1;
UPDATE tbl_graphV SET (name) = ('终止态') WHERE id = 2;

INSERT INTO tbl_graphE(source, sink) VALUES
(1, 10),
(1, 2),
(10, 11),
(11, 2),
(2, 1);

UPDATE tbl_item SET (status) = (1) WHERE itemid = 3;
