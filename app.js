// to do
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


app.get('/', function(req, res) {
  res.render('index', {title:'Hey', message:'hi there!'
  });
});

app.get('/tile/:id', function(req, res, next) {
  var tid = req.params.id;
  res.render('tile', {title:'tile page', text1:'图案1',
    imgurl: thumbnails[tid]
  });
});

var server = app.listen(app.get('port'), function(){
  console.log('Server listening on port ' + server.address().port);
});
