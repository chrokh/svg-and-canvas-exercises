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
    var n = Rand.next(1, Boundries.steps - 1);
    return n * Boundries.stepSize / 2;
  }


  var Rect = function(x, y, width, height, rotation){
    this.x = nil(x) ? Rect.Position.next() : x;
    this.y = nil(y) ? Rect.Position.next() : y;
    this.width = nil(width) ? Rect.Position.next() : width;
    this.height = nil(height) ? Rect.Position.next() : height;
    if(this.width == this.height)
      this.rotation = nil(rotation) ? Rand.Rotation.next() : rotation;
    else
      this.rotation = 0;
    this.color    = Rand.Color.next();
  }
  Rect.prototype.toSvg = function(){
    var centerX = this.x + this.width / 2,
        centerY = this.y + this.height / 2;
    return Xml.createTag('rect', {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.color,
      transform: 'rotate('+this.rotation+','+centerX+','+centerY+')'
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


  var ComplexShape = function(){
    this._shapes = [];
    var numRects = 3,
        numCircs = 1,
        color = Rand.Color.next();
    for(var r=0; r<8; r++){
      var rect = new Rect();
      rect.color = color;
      this._shapes.push(rect);
    }
    for(var r=0; r<numCircs; r++){
      var c = new Circle()
      c.color = color;
      this._shapes.push(c);
    }
  }
  ComplexShape.prototype.toSvg = function(){
    return Svg.fromShapes(this._shapes);
  }


  var Line = function(x1, y1, x2, y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = new Color(0,0,0,0.3);
    this.width = 1;
  }
  Line.prototype.toSvg = function(){
    return Xml.createTag('line', {
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      stroke: this.color,
      'stroke-width': this.width
    });
  }


  var Grid = function(){
    this._shapes = [];
    for(var col=0; col<=Boundries.steps; col++){
      var x1, x2;
      x1 = x2 = col * Boundries.stepSize;
      this._shapes.push(new Line(x1, 0, x2, Boundries.height));
    }
    for(var row=0; row<=Boundries.steps; row++){
      var y1, y2;
      y1 = y2 = row * Boundries.stepSize;
      this._shapes.push(new Line(0, y1, Boundries.width, y2));
    }
  }
  Grid.prototype.toSvg = function(){
    console.log(this);
    var xml = '';
    for(var s=0; s<this._shapes.length; s++)
      xml += this._shapes[s].toSvg();
    return xml;
  }


  var Pattern = function(shapes){
    var numRects = 4,
        numCircs = 1;
    this._shapes = [Rect.newBackground()];
    for(var n=0; n<3; n++)
      this._shapes.push(new ComplexShape());
    this._shapes.push(new Grid());
  }
  Pattern.prototype.toSvg = function(){
    return Svg.fromShapes(this._shapes);
  }


  var Rand = {};
  Rand.next = function(min, max){
    return Math.floor((Math.random()*max)+min);
  }
  Rand.Rotation = {};
  Rand.Rotation.next = function(){
    if(Rand.next(0,100) < 50) return;
    var rotationStep = 45;
    var steps = 360 / rotationStep;
    var  n = Rand.next(1, steps);
    return n * rotationStep;
  }
  Rand.Color = {};
  Rand.Color.next = function(){
    var color = new Color(
        Rand.next(0, 255),
        Rand.next(0, 255),
        Rand.next(0, 255));
    return color.toString();
  }


  var Color = function(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = (typeof a === 'undefined') ? 1 : a;
  }
  Color.prototype.toString = function(){
    if(this.a == 1)
      return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    else
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
  }


  var Xml = {};
  Xml.createTag = function(tagName, props){
    var tag = '<' + tagName;
    for(var prop in props)
      tag += ' ' + prop + '="' + props[prop] + '"';
    return tag + '/>'
  }


  var Svg = {};
  Svg.fromShapes = function(shapes){
    var svg = '<svg width="'+Boundries.width+'" height="'+Boundries.height+'">';
    for(var s=0; s<shapes.length; s++)
      svg += shapes[s].toSvg();
    return svg + '</svg>';
  }


  var App = {};
  App.init = function(){
    $('#generate').click(App.generate);
    for(var n=0; n<6; n++)
      App.generate();
  }
  App.generate = function(){
    var pattern = new Pattern().toSvg();
    var $canvas = $('<canvas/>');

    canvg($canvas[0], pattern);

    var imgData = $canvas[0].toDataURL('image/png');

    var $img = $('<img/>');
    $img.attr('src', imgData);

    var $a = $('<a/>');
    $a.append($img);
    $a.attr('href', imgData);

    $('#patterns').prepend($a);
    return false;
  }


  App.init();
})();
