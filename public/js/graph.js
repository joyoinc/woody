
(function(){

  var GraphVertex = function() { 
    var default_config = {
      label : "default_Label",
      color : "#777",
      pos : {x:0,y:0},
      vertexId: 0
    }
    var configs = {};
    if(arguments[0]) configs = arguments[0];
    for(var idx in default_config)
      if(typeof configs[idx] == 'undefined') configs[idx] = default_config[idx];

    this.initialize(configs); 
  }

  var p = GraphVertex.prototype = new createjs.Container(); // inherit from Container

  p.background;
  p.width;
  p.height;
  //p.edges = [];

  GraphVertex.prototype.Container_initialize = p.initialize;

  GraphVertex.prototype.initialize = function(configs) {
    this.Container_initialize();

    this.set({
      x: configs.pos.x, 
      y: configs.pos.y,
      label: configs.label,
      vertexId: configs.vertexId,
      cursor: "pointer",
      alpha: 0.5,
      name: "wfGraph_vertex"
    });

    var text = new createjs.Text(this.label, "20px Arial", "#000");
    text.textBaseline = "top";
    text.textAlign = "center";

    this.width = text.getMeasuredWidth()+30;
    this.height = text.getMeasuredHeight()+20;

    this.background = new createjs.Shape();
    this.background.graphics.beginFill(configs.color)
    .drawRoundRect(0-this.width/2,0-this.height/2,this.width,this.height,10);

    text.y = -10;
    this.addChild(this.background,text);
  }

  p.dragHandler = function(evt) {
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
  }

  p.dropHandler = function(evt) {
    //console.log(this.edges);
  }

  p.addEdge = function(graphEdge) {
    var elem = null;
    var array = this.edges;
    if(graphEdge==null)
      return;
    for(var i=0; i<array.length; i++) {
      if(array[i]==graphEdge) {
        return;
      }
    }
    array.push(graphEdge);
  }

  window.GraphVertex = GraphVertex;
}());

(function(){

  var GraphEdge = function(sourceVertex, sinkVertex) { 
    var default_config = {
      startX: sourceVertex.x,
      startY: sourceVertex.y,
      endX: sinkVertex.x,
      endY: sinkVertex.y,
      sourceId: sourceVertex.vertexId,
      sinkId: sinkVertex.vertexId,
      color : "#00f"
    }
    var configs = {};
    if(arguments[2]) configs = arguments[2];
    for(var idx in default_config)
      if(typeof configs[idx] == 'undefined') configs[idx] = default_config[idx];

    this.initialize(configs); 

    console.log(sourceVertex.label + "->" + sinkVertex.label);
  }

  var p = GraphEdge.prototype = new createjs.Container(); // inherit from Container

  GraphEdge.prototype.Container_initialize = p.initialize;

  GraphEdge.prototype.initialize = function(configs) {
    this.Container_initialize();

    this.set({
      x: configs.endX,
      y: configs.endY,
      sourceId: configs.sourceId,
      sinkId: configs.sinkId,
      cursor: "pointer",
      alpha: 0.3,
      name: "wfGraph_edge"
    });

    var diffX = configs.endX - configs.startX;
    var diffY = configs.endY - configs.startY;
    var radian = Math.atan2(diffY , diffX);
    var len = Math.sqrt(diffY*diffY + diffX*diffX);

    var arrow = new createjs.Shape();
    arrow.graphics.s(configs.color)
    .mt(0,0).lt(-len,0)
    .mt(-len/2,0).lt(-len/2-5,5)
    .mt(-len/2,0).lt(-len/2-5,-5);
    var degree = radian / Math.PI * 180;
    arrow.rotation = degree;

    this.addChild(arrow);
  }

  window.GraphEdge = GraphEdge;
}());

function startDrawEdgeHandler (evt) {
  sourceVertex = evt.currentTarget;
  connection = new createjs.Shape().set({
x: evt.currentTarget.x,
y: evt.currentTarget.y,
graphics: new createjs.Graphics().s("#0f0").dc(0,0,10)
});
stage.addChild(connection);
stage.addEventListener("stagemousemove", tmpDrawEdgeHandler);
stage.addEventListener("stagemouseup", endDrawEdgeHandler);
}

function tmpDrawEdgeHandler (evt) {
  connection.graphics.clear().s('#0f0').mt(0,0)
    .lt(stage.mouseX-connection.x, stage.mouseY-connection.y);
}

function endDrawEdgeHandler (evt) {
  var targetVertex , targets = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
  for(var i=0; i<targets.length; i++) {
    if(targets[i].parent!=null && targets[i].parent.name=="wfGraph_vertex") {
      targetVertex = targets[i].parent; 
      break;
    }
  }

  stage.removeChild(connection);
  if(targetVertex != null) {
    var sourceId = sourceVertex.vertexId;
    var sinkId = targetVertex.vertexId;
    if(hasEdge(edges, sourceId, sinkId)) {
      console.log(sourceId + "->" + sinkId + ": exists!");
    } else {
      drawEdge(sourceId, sinkId);
      edges.push({source:sourceId, sink:sinkId});
    }
  } 

  stage.removeEventListener("stagemousemove", tmpDrawEdgeHandler);
  stage.removeEventListener("stagemouseup", endDrawEdgeHandler);
}

function hasEdge(edgeArray, sourceId, sinkId) {
  for(var i=0; i<edgeArray.length; i++) {
    if(edgeArray[i].source==sourceId && edgeArray[i].sink==sinkId)
      return true;
  }
  return false;
}

function drawEdge(sourceId, sinkId) {
  var source,sink = null;
  for(var j=0; j<stage.children.length; j++) {
    if(stage.children[j].name=="wfGraph_vertex") {
      if(stage.children[j].vertexId == sourceId) {
        source = stage.children[j];
      }
      if(stage.children[j].vertexId == sinkId) {
        sink = stage.children[j];
      }
      if(source!=null && sink!=null) break;
    }
  }

  if(source!=null && sink!=null) {
    var edge = stage.addChild(new GraphEdge(source, sink));
    //source.addEdge(edge); sink.addEdge(edge);
  }
}
$(document).ready(function(){
    var toggleBtn = function(btn){ 
    $('.btn.active').removeClass('active');
    if(btn)
    $(btn).addClass('active');
    };

    $('.btn#save').click(function(){ 
      toggleBtn();
      });

    $('.btn#editEdge').click(function(){ 
      var btn = $(this);
      if($(btn).hasClass('active')) return;

      stage.children.forEach(function(elem){
        if(elem.name=="wfGraph_vertex") {
        elem.removeAllEventListeners();
        elem.on("mousedown", startDrawEdgeHandler);
        }
        });

      toggleBtn(btn);
      });

    $('.btn#editVertex').click(function(){ 
        var btn = $(this);
        if($(btn).hasClass('active')) return;

        stage.children.forEach(function(elem){
          if(elem.name=="wfGraph_vertex") {
          elem.removeAllEventListeners();
          elem.on("pressmove", elem.dragHandler);
          elem.on("pressup", elem.dropHandler);
          }
          });

        toggleBtn(btn);
        });
});
