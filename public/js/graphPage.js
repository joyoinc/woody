
(function(){

  // ctor 
  // param (vertexId, [configs])
  var GraphVertex = function(vertexId) { 
    var default_config = {
      label : "default_Label",
      color : createjs.Graphics.getRGB(Math.random()*0xFFFFFF),
      pos : {x:0,y:0}
    }
    var configs = {};
    if(arguments[arguments.length-1]) configs = arguments[arguments.length-1];
    for(var idx in default_config)
      if(typeof configs[idx] == 'undefined') configs[idx] = default_config[idx];

    this.set({
      configs: configs,
      vertexId: vertexId,
      cursor: "pointer",
      alpha: 0.382,
      name: "wfGraph_vertex"
    });

    this.initialize(); 
  }

  var p = GraphVertex.prototype = new createjs.Container(); // inherit from Container

  p.background;
  p.width;
  p.height;

  GraphVertex.prototype.Container_initialize = p.initialize;

  GraphVertex.prototype.initialize = function() {
    this.Container_initialize();

    this.addChild(new createjs.Shape(), new createjs.Text);
    this.paint();
  }

  p.paint = function() {
    var text = this.getChildAt(1);
    text.set({
      text: this.configs.label,
      font: "20px Arial",
      color: "#000",
      textBaseline: "top",
      textAlign: "center",
      y: -10
    });

    var width = text.getMeasuredWidth()+30;
    var height = text.getMeasuredHeight()+20;

    var background = this.getChildAt(0);
    background.graphics.clear().beginFill(this.configs.color)
    .drawRoundRect(0-width/2,0-height/2,width,height,10);

    this.set({
      x: this.configs.pos.x,
      y: this.configs.pos.y
    });
  }

  p.toString = function () {
    return String.format("({0})", this.configs.label);
  }

  p.dragHandler = function(evt) {
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
  }

  p.dropHandler = function(evt) {
    stage.children.forEach(function(elem){
      if(elem.name=="wfGraph_edge") {
        elem.paint();
      }
    });
  }

  window.GraphVertex = GraphVertex;
}());

(function(){

  // ctor 
  // param (sourceGraphVertex, sinkGraphVertex, [configs])
  var GraphEdge = function(sourceVertex, sinkVertex) {
    var default_config = {
      color : "#00f"
    }
    var configs = {};
    if(arguments[arguments.length-1]) configs = arguments[arguments.length-1];
    for(var idx in default_config)
      if(typeof configs[idx] == 'undefined') configs[idx] = default_config[idx];

    this.set({
      sourceVertex: sourceVertex,
      sinkVertex: sinkVertex,
      configs: configs,
      cursor: "pointer",
      alpha: 0.382,
      name: "wfGraph_edge"
    });

    this.initialize(); 

  }

  var p = GraphEdge.prototype = new createjs.Container(); // inherit from Container

  GraphEdge.prototype.Container_initialize = p.initialize;

  GraphEdge.prototype.initialize = function() {
    this.Container_initialize();

    this.addChild(new createjs.Shape());
    this.paint();
  }

  p.toString = function () {
    return String.format("{0}->{1}", 
      this.sourceVertex.configs.label,
      this.sinkVertex.configs.label);
  }

  p.paint = function() {
    var arrow = this.getChildAt(0);

    var startX = this.sourceVertex.x;
    var startY = this.sourceVertex.y;
    var endX = this.sinkVertex.x;
    var endY = this.sinkVertex.y;
    var diffX = endX - startX;
    var diffY = endY - startY;
    var radian = Math.atan2(diffY , diffX);
    var len = Math.sqrt(diffY*diffY + diffX*diffX);

    arrow.graphics.clear().s(this.configs.color)
    .mt(0,0).lt(-len,0)
    .mt(-len/2,0).lt(-len/2-5,5)
    .mt(-len/2,0).lt(-len/2-5,-5);
    var degree = radian / Math.PI * 180;
    arrow.rotation = degree;

    this.set({
      x: endX,
      y: endY
    });
  }

  window.GraphEdge = GraphEdge;
}());

function highlightTargetHandler(evt) {
  evt.currentTarget.set({alpha:0.618});
}

function delightTargetHandler(evt) {
  evt.currentTarget.set({alpha:0.382});
}

function removeEdgeHandler(evt) {
  var edge = evt.currentTarget;
  console.log('remove edge ' + edge.toString());
  stage.removeChild(edge);
}

function startDrawEdgeHandler (evt) {
  sourceVertex = evt.currentTarget;
  stage.addChild(new createjs.Shape().set({
    x: evt.currentTarget.x,
    y: evt.currentTarget.y,
    graphics: new createjs.Graphics().s("#f00").dc(0,0,10),
    name: "tmpEdge"
  }));
  stage.addEventListener("stagemousemove", tmpDrawEdgeHandler);
  stage.addEventListener("stagemouseup", endDrawEdgeHandler);
}

function tmpDrawEdgeHandler (evt) {
  var connection = stage.getChildByName("tmpEdge");
  connection.graphics.clear().s('#0f0').mt(0,0)
  .lt(stage.mouseX-connection.x, stage.mouseY-connection.y);
}

function endDrawEdgeHandler (evt) {
  var sinkVertex , targets = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
  for(var i=0; i<targets.length; i++) {
    if(targets[i].parent!=null && targets[i].parent.name=="wfGraph_vertex") {
      sinkVertex = targets[i].parent; 
      break;
    }
  }

  var connection = stage.getChildByName("tmpEdge");
  stage.removeChild(connection);
  if(sinkVertex != null) {
    var sourceId = sourceVertex.vertexId;
    var sinkId = sinkVertex.vertexId;
    if(sourceId==sinkId) {
      console.log("can't add loop " + sinkId + " to itself!");
    }
    else if(hasEdge(sourceId, sinkId)) {
      console.log(sourceId + "->" + sinkId + ": exists!");
    } else {
      var edge = drawGraphEdge(sourceId, sinkId, "#0f0");
      addEdgeModeEventHandler([edge]);
    }
  } 

  stage.removeEventListener("stagemousemove", tmpDrawEdgeHandler);
  stage.removeEventListener("stagemouseup", endDrawEdgeHandler);
}

function hasEdge(sourceId, sinkId) {
  for(var i=0; i<stage.children.length; i++) {
    var elem = stage.children[i];
    if(elem.name=="wfGraph_edge" 
      && elem.sourceVertex.vertexId==sourceId
      && elem.sinkVertex.vertexId==sinkId)
      return true;
  }
  return false;
}

function drawGraphEdge(sourceId, sinkId, color) {
  var source,sink = null;
  for(var i=0; i<stage.children.length; i++) {
    var elem = stage.children[i];
    if(elem.name=="wfGraph_vertex") {
      if(elem.vertexId == sourceId) {
        source = elem;
      }
      if(elem.vertexId == sinkId) {
        sink = elem;
      }
      if(source!=null && sink!=null) break;
    }
  }

  if(source!=null && sink!=null) {
    return stage.addChild(new GraphEdge(source, sink, {color:color}));
  }
  return null;
}

function drawGraphVertex(vertexId, label, pos) {
  return stage.addChild(new GraphVertex(vertexId, {label: label, pos:pos}));
}

function drawGraph(vertexes, edges) {
  var elem;
  for(var i=0; i<vertexes.length; i++) {
    elem = vertexes[i];
    drawGraphVertex(elem.source, elem.label,
        {x:Math.random()*600,y:Math.random()*450});
  }

  for(var i=0; i<edges.length; i++) {
    elem = edges[i];
    drawGraphEdge(elem.source, elem.sink);
  }
}

function addEdgeModeEventHandler(elems) {
  if(elems==null) {
    elems = stage.children;
  }
  elems.forEach(function(elem){
    if(elem.name=="wfGraph_vertex") {
      elem.on("mousedown", startDrawEdgeHandler);
    }
    if(elem.name=="wfGraph_edge") {
      elem.on("mouseover", highlightTargetHandler);
      elem.on("mouseout", delightTargetHandler);
      elem.on("dblclick", removeEdgeHandler);
    }
  });
}

function addVertexModeEventHandler(elems) {
  if(elems==null) {
    elems = stage.children;
  }
  elems.forEach(function(elem){
    if(elem.name=="wfGraph_vertex") {
      elem.on("pressmove", elem.dragHandler);
      elem.on("pressup", elem.dropHandler);
      elem.on("mouseover", highlightTargetHandler);
      elem.on("mouseout", delightTargetHandler);
      //elem.on("dblclick", removeEdgeHandler);
    }
  });
}

function resetButtons() {
  $('.btn.active').removeClass('active');
}

function resetEventHandler() {
  stage.children.forEach(function(elem){
    elem.removeAllEventListeners();
  });
}

$(document).ready(function(){

  $.ajax({
    url: "/_api/loadGraph",
    type: 'get'
  }).done(function(data, textStatus, jqXHR){
      if(textStatus==='success') {
        console.log(String.format("ajax call: loadGraph {0}!" , data.result));
        var vertexes = []; var edges = [];
        for(var i=0; i<data.graph.length; i++) {
          if(data.graph[i].type=='V') {
            vertexes.push(data.graph[i]);
          }
          if(data.graph[i].type=='E') {
            edges.push(data.graph[i]);
          }
        }
        drawGraph(vertexes, edges);
      }
  });

  $('.btn#save').click(function(){ 
    stage.children.forEach(function(elem){
      console.log('graph element: '+ elem.toString());
    });

    $.ajax({ url: '/graph', type: 'put' })
    .done(function(data, textStatus, jqXHR){
      if(textStatus==='success') {
        console.log(String.format("ajax call: saveGraph {0}!" , data.result));
        $('#myModal .modal-body').html(String.format("<div class='alert {1}'>{0}</div>",
          data.result, data.result=="success" ? "alert-info" : "alert-danger"));
        setTimeout(function(){
          $('#myModal .modal-body').html("");
          $('button.close').click(); 
        }, 500);
      }
    });
  });

  $('.btn#preSave').click(function(){ 
    resetEventHandler(); 
    resetButtons();
  });

  $('.btn#editEdge').click(function(){ 
    var btn = $(this);
    if($(btn).hasClass('active')) return;

    resetEventHandler();
    resetButtons();
    addEdgeModeEventHandler();
    $(btn).addClass('active');
  });

  $('.btn#editVertex').click(function(){ 
    var btn = $(this);
    if($(btn).hasClass('active')) return;

    resetEventHandler();
    resetButtons();
    addVertexModeEventHandler();
    $(btn).addClass('active');
  });
});
