var config = require('../config.js');
var pg = require('pg').native;

exports.updateTileStatus = function(req, res) {
  var id = req.params.id;
  var sid = req.params.stat;
  pg.connect(config.connString, function(err, client, done){
    if(err) {
      console.error('error fetching client from pool', err);
      res.send({"result":"fail", "detail":err});
      return;
    }

    var sqlCmd = "UPDATE  tbl_item i SET status = $2 WHERE i.itemId=$1";

    client.query(sqlCmd, [id, sid], function(err, result) {
      // call done to release client back to pool
      done();

      if(err) {
        console.error('run query error', err);
        res.send({"result":"fail", "detail":err});
      } else {
        res.send({"result":"success"});
      }
    });
  });
}
