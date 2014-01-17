(function(){

  var Circle = function(){
    this.x        = Circle.Position.next();
    this.y        = Circle.Position.next();
    this.radius    = Circle.Size.next();
  }
  Circle.prototype.toSvg = function(){
    return Xml.createTag('circle', {
      cx: this.x,
      cy: this.y,
      r: this.radius
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


  var Rect = function(){
    this.x = Rect.Position.next();
    this.y = Rect.Position.next();
    this.width = Rect.Size.next();
    this.height = Rect.Size.next();
    this.rotation = Rand.Rotation.next();
  }
  Rect.prototype.toSvg = function(){
    return Xml.createTag('rect', {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
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


  var Boundries = {};
  Boundries.width = 500;
  Boundries.heigth = Boundries.width;
  Boundries.steps = 4;
  Boundries.stepSize = Boundries.width / Boundries.steps;


  var Pattern = function(){
    this._shapes = [];
    for(var r=0; r<3; r++)
      this._shapes.push(new Rect());
    for(var r=0; r<1; r++)
      this._shapes.push(new Circle());
  }
  Pattern.prototype.toSvg = function(){
    var svg = '<svg>';
    for(var s=0; s<this._shapes.length; s++)
      svg += this._shapes[s].toSvg();
    return svg + '</svg>';
  }


  var Color = {};


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


  var Xml = {};
  Xml.createTag = function(tagName, props){
    var tag = '<' + tagName;
    for(var prop in props)
      tag += ' ' + prop + '="' + props[prop] + '"';
    return tag + '/>'
  }


  var foo = new Pattern().toSvg();
  console.log(foo);
})();
