// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here

    p.setup = function() {
      let target = parent.$el;
      let width = target.clientWidth;
      let height = target.clientHeight;
      //console.log(width, height);
      let canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);
    };

    p.draw = function() {
      p.background('#262626');
      p.circle(p.mouseX, p.mouseY, 50);
    };

    // this is a new function we've added to p5
    // it runs only if the data changes
    p.dataChanged = function(val, oldVal) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
    };

  };
}