// to do
var config = require('./config.js');
var cloudinaryImages = [
  'http://res.cloudinary.com/dehrl9peq/image/upload/v1412466618/descxcxtwaudgutnjqvr.png',
  'http://res.cloudinary.com/dehrl9peq/image/upload/v1412473296/kzc7nldt9t54oehd8ftp.png'
];
var localImages = ['/a.png', '/b.png'];
//var thumbnails = localImages;
var thumbnails = cloudinaryImages;

// Module dependencies.
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
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

var routeGraph = require('./routes/graph');
app.get('/graph', routeGraph.showGraph);
app.put('/graph', routeGraph.saveGraph);

var routeTile = require('./routes/tile');
app.get('/tile/:id', routeTile.getTile);

var routeAPI = require('./routes/_api');
app.put('/_api/updateTileStatus/:id/:stat', routeAPI.updateTileStatus);
app.get('/_api/loadGraph', routeGraph.loadGraph);

var server = app.listen(app.get('port'), function(){
  console.log('Server listening on port ' + server.address().port);
});
