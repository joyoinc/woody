var config = require('../config.js');
var pg = require('pg');

exports.getTile = function(req, res) {
  var itemid = req.params.id;
  pg.connect(config.connConfig, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var sqlCmd = " \
      SELECT  i.itemName AS name, f.accessLink AS link, v.name AS workstat, nxt.nextid AS nextstatid, nxt.nextname AS nextstatname \
      FROM    tbl_item i  \
              LEFT OUTER JOIN tbl_file f ON (i.thumbnail = f.fileId)  \
              LEFT OUTER JOIN tbl_graphV v ON (i.status = v.id)  \
              LEFT OUTER JOIN ( \
                SELECT  e.source AS vid, v.id AS nextid, v.name AS nextname \
                FROM    tbl_graphE e \
                        JOIN  tbl_graphV v ON(v.id = e.sink) \
              ) nxt ON (nxt.vid = i.status)  \
      WHERE   i.typeId=1 AND i.itemId=$1 \
    ";

    client.query(sqlCmd, [itemid], function(err, result) {
      done();
      if(err) {
        console.error('error run query', err);
        res.send(err);
      } else {
        console.log(result.rows);
        if(result.rows.length > 0) {
          var item = result.rows[0];
          var nextstats = [];
          for(var i=0; i<result.rows.length; i++) {
            nextstats.push({id:result.rows[i].nextstatid, name:result.rows[i].nextstatname});
          }
          res.render('tile', { 
            title:'tile page',
            itemid: itemid,
            itemName: item.name,
            imgurl: item.link,
            currentstat: item.workstat,
            nextstats: nextstats
          });
        } else {
          res.send('No such item ' + itemid);
        }
      }
    });
  });
}
