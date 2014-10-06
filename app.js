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

app.get('/tile/:id', function(req, res, next) {
  var tid = req.params.id;
  pg.connect(config.connString, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var sqlCmd = " \
      SELECT  itemName AS name, accessLink AS link \
      FROM    tbl_item LEFT OUTER JOIN tbl_file \
      ON      tbl_item.thumbnail = tbl_file.fileId \
      WHERE   typeId=1 AND itemId=$1";
    client.query(sqlCmd, [tid], function(err, result) {
      done();
      if(err) {
        console.error('error run query', err);
        res.send(err);
      } else {
        console.log(result.rows);
        //res.send(result.rows);
        if(result.rows.length > 0) {
          var item = result.rows[0];
          res.render('tile', { 
            title:'tile page', itemName: item.name,
            imgurl: item.link
          });
        } else {
          res.send('No such item ' + tid);
        }
      }
    });
  });
});

var server = app.listen(app.get('port'), function(){
  console.log('Server listening on port ' + server.address().port);
});
