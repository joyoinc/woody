var config = require('./config')
// Module dependencies.
var express = require('express');
var app = express();
var pg = require('pg');

// all environments
app.set('port', process.env.PORT || 9527);

app.get('/db', function(req, res) {
  //pg.connect(config.connString, function(err, client, done){
  pg.connect(config.connConfig, function(err, client, done){
      if(err) {
        console.error(err);
        return;
      }
    client.query('SELECT * FROM cfg_table WHERE key LIKE \'/tables/tbl_%\'', function(err, result) {
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
  //pg.connect(config.connString, function(err, client, done){
  pg.connect(config.connConfig, function(err, client, done){
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
