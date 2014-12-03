var config = require('../config.js');
var pg = require('pg');

exports.loadGraph = function (req, res) {
  pg.connect(config.connConfig, function(err, client, done){
    if(err) {
      console.error('error fetching client from pool', err);
      res.send({"result":"fail", "detail":err});
      return;
    }

    var sqlCmd = " \
      SELECT \
        'V'   AS type,\
        id    AS source,\
        NULL  AS sink,\
        name  AS label,\
        posX  AS posx,\
        posY  AS posy\
      FROM tbl_graphV\
      UNION\
      SELECT \
        'E'     AS type,\
        source  AS source,\
        sink    AS sink,\
        NULL    AS label,\
        NULL    AS posx,\
        NULL    AS posy\
      FROM tbl_graphE\
    ";

    client.query(sqlCmd, function(err, result) {
      // call done to release client back to pool
      done();

      if(err) {
        console.error('run query error', err);
        res.send({"result":"fail", "detail":err});
      } else {
        res.send({"result":"success", "graph":result.rows});
      }
   });
  });
}

exports.showGraph = function(req, res) {
  res.render('graph', {title:'graph demo'});
}

exports.saveGraph = function(req, res) {
  var i = Math.random() * 10 < 8;
  res.send({"result": i ? "success":"fail"});
}

