
(function(){

  // ctor 
  // param (vertexId, [configs])
  var GraphVertex = function(vertexId) { 
    var default_config = {
      label : "default_Label",
      color : "#777",
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
      alpha: 0.5,
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

  p.dragHandler = function(evt) {
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
  }

  p.dropHandler = function(evt) {
    //console.log(this.edges);
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
      alpha: 0.3,
      name: "wfGraph_edge"
    });

    this.initialize(); 

    console.log(sourceVertex.configs.label + "->" + sinkVertex.configs.label);
  }

  var p = GraphEdge.prototype = new createjs.Container(); // inherit from Container

  GraphEdge.prototype.Container_initialize = p.initialize;

  GraphEdge.prototype.initialize = function() {
    this.Container_initialize();

    this.addChild(new createjs.Shape());
    this.paint();
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
    else if(hasEdge(edges, sourceId, sinkId)) {
      console.log(sourceId + "->" + sinkId + ": exists!");
    } else {
      drawGraphEdge(sourceId, sinkId);
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

function drawGraphEdge(sourceId, sinkId) {
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
    stage.addChild(new GraphEdge(source, sink));
  }
}

function drawGraphVertex(vertexId, label, pos) {
  stage.addChild(new GraphVertex(vertexId, {label: label, pos:pos}));
}

$(document).ready(function(){
  var toggleBtn = function(btn){ 
    $('.btn.active').removeClass('active');
    if(btn) $(btn).addClass('active');
  };

  $('.btn#save').click(function(){ 
    toggleBtn(); 

    $.ajax({
      url: '/graph',
      type: 'put'
    }).done(function(data, textStatus, jqXHR){
        if(textStatus==='success') {
          alert('状态改变成功');
          window.location.href = baseurl;
        }
    });

  });

  $('.btn#editEdge').click(function(){ 
    var btn = $(this);
    if($(btn).hasClass('active')) return;

    stage.children.forEach(function(elem){
      if(elem.name=="wfGraph_vertex") {
        elem.removeAllEventListeners();
        elem.on("mousedown", startDrawEdgeHandler);
      }
      if(elem.name=="wfGraph_edge") {
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
