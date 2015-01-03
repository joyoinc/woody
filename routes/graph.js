var config = require('../config.js');
var pg = require('pg');
var util = require('../component/util.js');

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
  var edges = req.param('edges');
  var vertexes = req.param('vertexes');

  var sqlInsertEdges = "";
  for(var i=0; i<edges.length; i++) {
    if(i==0) {
      sqlInsertEdges += "INSERT INTO tbl_graphE(source, sink) VALUES ";
    }
    var edge = edges[i];
    var str = util.format("({0}, {1}){2}", edge.source, edge.sink,
      i==edges.length-1 ? ";":",");
    sqlInsertEdges += str;
  }
  //res.send(sqlInsertEdges);
  var sqlInsertVertexes = "INSERT INTO tbl_graphV(id, name, posx, posy) VALUES ";
  for(var i=0; i<vertexes.length; i++) {
    var vertex = vertexes[i];
    var str = util.format("({0}, '{1}', {2}, {3}){4}", vertex.id,
      util.pgStr(vertex.name), vertex.posx, vertex.posy,
      i==vertexes.length-1 ? ";":",");
    sqlInsertVertexes += str;
  }
  //res.send(sqlInsertVertexes); return

  var cb = function(err, done) {
    if(err) {
      res.send({"result":"fail", "detail":err});
    } else {
      res.send({"result":"success"});
    }
    done(err);
  }
  var rollback = function(client, done) {
    client.query('ROLLBACK', function(err) {
      return cb(err, done);
    });
  }
  var commit = function(client, done) {
    client.query('COMMIT', function(err) {
      return cb(err, done);
    });
  }

  pg.connect(config.connConfig, function(err, client, done){
    if(err) {
      return cb(err, done);
    }

    client.query('BEGIN', function(err){
      if(err) return rollback(client, done);
      process.nextTick(function(){
        client.query("DELETE FROM tbl_graphE", function(err){
          if(err) return rollback(client, done);
          client.query("DELETE FROM tbl_graphV", function(err){
            if(err) return rollback(client, done);
            client.query(sqlInsertVertexes, function(err){
              if(err) return rollback(client, done);
                client.query(sqlInsertEdges, function(err){
                if(err) return rollback(client, done);
                return commit(client, done);
              });
            });
          });
        });
      });
    });
  });
}

