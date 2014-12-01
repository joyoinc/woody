
exports.showGraph = function(req, res) {
  res.render('graph', {title:'graph demo'});
}

exports.saveGraph = function(req, res) {
  var i = Math.random() * 10 < 8;
  var result = {
    "message": i ? "success":"fail"
  };
  res.send(result);
}
