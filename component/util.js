exports.format = function(){
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    s = s.replace(reg, arguments[i + 1]);
  }
  return s;
}

exports.escapes = function(){
  // escape chars: \ $ ' "
  var s = arguments[0];
  s = s.replace(/[\\$'"]/g, "\\$&");
  return s;
}

exports.pgStr = function(){
  // double '
  var s = arguments[0];
  s = s.replace(/[']/g, "''");
  return s;
}
