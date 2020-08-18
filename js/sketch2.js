// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here
    let particles = [];
    let mouseParticle;
    let mouseOnScreen = false;
    let numParticles; 
    let target;
    let isVisible = false;

    p.setup = function() {
      target = parent.$el;
      let width = target.clientWidth;
      //let height = target.clientHeight;
      let height = 400;
      //console.log(width, height);
      let canvas = p.createCanvas(width, height);
      numParticles = 50 * width * height / 570000
      canvas.parent(parent.$el);
      p.noStroke();
      p.noLoop();

      for (let i = 0; i < numParticles; i++) {
        particles.push(new particle());
      }
    };

    p.draw = function() {

      if (!mouseOnScreen) {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          mouseParticle = new particle(p.mouseX, p.mouseY);
          mouseOnScreen = true;
        }
      }

      if (mouseOnScreen) {
        if (!(p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height)) {
          mouseParticle.remove();
          mouseOnScreen = false;        
        }
      }

      p.background(0, 0, 51);

      for (let particle of particles) {
        particle.display();
        particle.update();
      }

      if (mouseOnScreen) {
        mouseParticle.display();
        mouseParticle.update(p.mouseX, p.mouseY);
      }

    };

    // this is a new function we've added to p5
    // it runs only if the data changes
    p.dataChanged = function(val, oldVal) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
    };


    // this is a new function we've added to p5
    // it runs only when the canvas scrolls in or out of the page view
    p.visibilityChanged = function(isVisible) {
      //console.log('visibility changed to ', isVisible, Date.now());
      if (isVisible) {
        p.loop()
      } else {
        p.noLoop();
      }
    };

    // particle class
    function particle(posX, posY) {

      this.y = posX ? posX : p.random(0, p.height);
      this.size = 2;
      this.x = posY ? posY : p.random(0, p.width);
      this.angle = p.random(0, 2*Math.PI);
      this.wander = 0.05;
      this.v0 = 0.1;
      this.vx = this.v0 * Math.cos(this.angle);
      this.vy = this.v0 * Math.sin(this.angle);
      this.minSize = 2;
      //this.color = 'palegoldenrod';
      // this.fadeOut = false;
      // this.fadeCount = 20;

      this.update = function(posX, posY) {
        
        if (posX && posY) {
          this.x = posX;
          this.y = posY;
        } else {
          this.angle = p.random(2 * p.PI);

          this.ax = this.wander * Math.cos(this.angle);
          this.ay = this.wander * Math.sin(this.angle);

          /*
          let dy = this.y - p.mouseY;
          let dx = this.x - p.mouseX;
          let angle = Math.atan2(dy, dx);
          let rsq = 1 + dy*dy + dx*dx;

          this.ax += 1000*Math.cos(angle)/rsq;
          this.ay += 1000*Math.sin(angle)/rsq;
          */

          this.vx += this.ax;
          this.vy += this.ay;
          
          this.x = this.x + this.vx;
          this.y = this.y + this.vy;

          // wraparound the screen
          if (this.x > p.width) {
            this.x = 0;
          } else if (this.x < 0) {
            this.x = p.width;
          }

          if (this.y > p.height) {
            this.y = 0;
          } else if (this.y < 0) {
            this.y = p.height;
          }
        }

      };

      this.display = function() {
        p.fill(238, 232, 170, 200);
        p.ellipse(this.x, this.y, this.size);
      };

      this.remove = function() {
        let index = particles.indexOf(this);
        particles.splice(index, 1);
      }

    }

    function distSquared(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return dx * dx + dy * dy;
    }

    p.windowResized = function() {

    };

  };
}