// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here
    let particles = [];
    let numParticles; 
    let target;
    let isVisible = false;
    let initialParticles = 100;

    p.setup = function() {
      target = parent.$el;
      let width = target.clientWidth;
      let height = target.clientHeight;
      //console.log(width, height);
      let canvas = p.createCanvas(width, height);
      numParticles = p.round(initialParticles * width * height / 570000);
      canvas.parent(parent.$el);
      p.noStroke();
    };

    p.draw = function() {
      p.background(0, 0, 51);

      if (particles.length < numParticles / 3) {
        for (let i = 0; i < numParticles; i++) {
          particles.push(new particle());
        }
      }

      //p.circle(p.mouseX, p.mouseY, 100);

      for (let particle of particles) {
        particle.display();
        particle.update();
      }

      p.fill(255,255,255, 50);
      p.circle(p.mouseX, p.mouseY, 200);

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
    function particle() {

      this.y = p.random(0.45 * p.height, 0.55 * p.height);
      this.size = p.random(5, 25);
      this.x = Math.random() < 0.5 ? 25 : p.width - 25;
      this.maxangle = 2 * p.atan2(p.height/2, p.width);
      this.angle = this.maxangle * p.random(-1, 1);
      this.wander = 0.05;
      this.v0 = p.random(0.1, 5) * (this.x < p.width/2 ? 1 : -1);
      this.vx = this.v0 * Math.cos(this.angle);
      this.vy = this.v0 * Math.sin(this.angle);
      this.minSize = 2;
      //this.color = 'palegoldenrod';
      // this.fadeOut = false;
      // this.fadeCount = 20;

      this.update = function() {
        
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
        
        if (this.size > this.minSize) {
          this.size = this.size * 0.99;
        }

        // delete particle if it leaves screen
        if (this.x > p.width || this.x < -this.size || this.y > p.height || this.y < 0) {
          this.remove();
        }

        if (distSquared(p.mouseX, p.mouseY, this.x, this.y) < 100*100) {
          let dy = this.y - p.mouseY;
          let dx = this.x - p.mouseX;
          let angle = Math.atan2(dy, dx);
          this.x = p.mouseX + 101 * Math.cos(angle);
          this.y = p.mouseY + 101 * Math.sin(angle);
          
        }

        if (this.fadeOut) {
          this.fadeCount--;
            if (this.fadeCount == 0) {
              this.remove();
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
      //console.log('p5 canvas resized');
      let width = target.clientWidth;
      let height = target.clientHeight;
      p.resizeCanvas(width, height);

      particles = [];
      numParticles = p.round(initialParticles * width * height / 570000);

    };

  };
}