var config = require('./config')
// Module dependencies.
var express = require('express');
var app = express();
var pg = require('pg').native;
//var CONNSTRING = process.env.DATABASE_URL || 'postgres://ulldcqzkmyglth:480S6ABz_YURJ4ZMCPJyG5IBgr@ec2-50-17-207-54.compute-1.amazonaws.com:5432/dcu31opgd9pq74';

// all environments
app.set('port', process.env.PORT || 9527);

app.get('/db', function(req, res) {
  pg.connect(config.connString, function(err, client, done){
      if(err) {
        console.error(err);
        return;
      }
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if(err) {
        console.error(err);
        res.send(err);
      } else {
        res.send(result.rows);
      }
    });
  });
});

app.get('/db/:tableName', function(req, res) {
  pg.connect(config.connString, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var tableName = 'tbl_' + req.params.tableName;
    var sqlCmd = 'SELECT * FROM ' + tableName;
    client.query(sqlCmd, function(err, result) {
      done();
      if(err) {
        console.error(err);
        res.send(err);
      } else {
        res.send(result.rows);
      }
    });
  });
});
var server = app.listen(app.get('port'), function(){
  console.log('Server listening on port ' + server.address().port);
});
