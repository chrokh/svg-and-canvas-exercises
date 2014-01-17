(function(){

  var Circle = function(){
    this.x        = Circle.Position.next();
    this.y        = Circle.Position.next();
    this.radius    = Circle.Size.next();
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
  }


  var Boundries = {};
  Boundries.width = 500;
  Boundries.heigth = Boundries.width;
  Boundries.steps = 4;
  Boundries.stepSize = Boundries.width / Boundries.steps;


  var Pattern = function(){
  }


  var Color = {};


  var Rand = {};
  Rand.next = function(min, max){
    return Math.floor((Math.random()*max)+min);
  }


  var foo = new Circle();
  console.log(foo);
})();
