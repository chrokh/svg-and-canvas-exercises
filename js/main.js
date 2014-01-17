(function(){

  var nil = function(val){
    return typeof val === 'undefined';
  }

  var Circle = function(){
    this.x        = Circle.Position.next();
    this.y        = Circle.Position.next();
    this.radius   = Circle.Size.next();
    this.color    = Rand.Color.next();
  }
  Circle.prototype.toSvg = function(){
    return Xml.createTag('circle', {
      cx: this.x,
      cy: this.y,
      r: this.radius,
      fill: this.color
    });
  }
  Circle.Position = {};
  Circle.Position.next = function(){
    var n = Rand.next(0, Boundries.steps);
    return n * Boundries.stepSize;
  }
  Circle.Size = {};
  Circle.Size.next = function(){
    var n = Rand.next(1, Boundries.steps);
    return n * Boundries.stepSize / 2;
  }


  var Rect = function(x, y, width, height, rotation){
    this.x = nil(x) ? Rect.Position.next() : x;
    this.y = nil(y) ? Rect.Position.next() : y;
    this.width = nil(width) ? Rect.Position.next() : width;
    this.height = nil(height) ? Rect.Position.next() : height;
    this.rotation = nil(rotation) ? Rand.Rotation.next() : rotation;
    this.color    = Rand.Color.next();
  }
  Rect.prototype.toSvg = function(){
    return Xml.createTag('rect', {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.color
    });
  }
  Rect.Position = {};
  Rect.Position.next = function(){
    var n = Rand.next(0, Boundries.steps - 1);
    return n * Boundries.stepSize;
  }
  Rect.Size = {};
  Rect.Size.next = function(){
    var n = Rand.next(1, Boundries.steps)
    return n * Boundries.stepSize;
  }
  Rect.newBackground = function(){
    return new Rect(0, 0, Boundries.width, Boundries.height, 0);
  }


  var Boundries = {};
  Boundries.width = 300;
  Boundries.height = Boundries.width;
  Boundries.steps = 4;
  Boundries.stepSize = Boundries.width / Boundries.steps;


  var Pattern = function(){
    this._shapes = [Rect.newBackground()];
    for(var r=0; r<3; r++)
      this._shapes.push(new Rect());
    for(var r=0; r<1; r++)
      this._shapes.push(new Circle());
  }
  Pattern.prototype.toSvg = function(){
    var svg = '<svg width="'+Boundries.width+'" height="'+Boundries.height+'">';
    for(var s=0; s<this._shapes.length; s++)
      svg += this._shapes[s].toSvg();
    return svg + '</svg>';
  }


  var Rand = {};
  Rand.next = function(min, max){
    return Math.floor((Math.random()*max)+min);
  }
  Rand.Rotation = {};
  Rand.Rotation.next = function(){
    var rotationStep = 45;
    var steps = 360 / rotationStep;
    var  n = Rand.next(1, steps);
    return n * rotationStep;
  }
  Rand.Color = {};
  Rand.Color.next = function(){
    var r = Rand.next(0, 255),
        g = Rand.next(0, 255),
        b = Rand.next(0, 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }


  var Xml = {};
  Xml.createTag = function(tagName, props){
    var tag = '<' + tagName;
    for(var prop in props)
      tag += ' ' + prop + '="' + props[prop] + '"';
    return tag + '/>'
  }


  var App = {};
  App.init = function(){
    $('#generate').click(function(e){
      var pattern = new Pattern().toSvg();
      $('#patterns').prepend(pattern);
      e.preventDefault();
    });
  }


  App.init();
})();
