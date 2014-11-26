// to do
var config = require('./config.js');
var pg = require('pg').native;
var cloudinaryImages = [
  'http://res.cloudinary.com/dehrl9peq/image/upload/v1412466618/descxcxtwaudgutnjqvr.png',
  'http://res.cloudinary.com/dehrl9peq/image/upload/v1412473296/kzc7nldt9t54oehd8ftp.png'
];
var localImages = ['/a.png', '/b.png'];
//var thumbnails = localImages;
var thumbnails = cloudinaryImages;

// Module dependencies.
var express = require('express');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.set('views', './views');
app.set('view engine', 'jade');

// development only
if ('development' == app.get('env')) {
  app.locals.pretty = true;
}


// map routes
app.get('/', function(req, res) {
  console.log(config);
  res.render('index', {title:'Hey', message:'hi there!'
  });
});

app.get('/graph', function(req, res) {
  res.render('graph', {title:'graph demo'});
});

app.put('/tile/:id/:stat', function(req, res) {
  var id = req.params.id;
  var sid = req.params.stat;
  pg.connect(config.connString, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var sqlCmd = "UPDATE  tbl_item i SET status = $2 WHERE i.itemId=$1";

    client.query(sqlCmd, [id, sid], function(err, result) {
      done();
      if(err) {
        console.error('error run query', err);
        res.send(err);
      } else {
        res.send(result.rows);
      }
    });
  });
});

app.get('/tile/:id', function(req, res, next) {
  var itemid = req.params.id;
  pg.connect(config.connString, function(err, client, done){
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
      WHERE   i.typeId=1 AND i.itemId=$1";

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
});

var server = app.listen(app.get('port'), function(){
  console.log('Server listening on port ' + server.address().port);
});
