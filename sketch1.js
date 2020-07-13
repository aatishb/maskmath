// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here
    let particles = []; 

    p.setup = function() {
      let target = parent.$el;
      let width = target.clientWidth;
      let height = target.clientHeight;
      //console.log(width, height);
      let canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);
      p.fill(240);
      p.noStroke();
      p.textSize(p.height * 0.66);
      p.textAlign(p.CENTER, p.BASELINE);
      //console.log(parent.data.mask1);
      p.strokeWeight(7);
      p.drawingContext.setLineDash([0, 15]);
      p.noLoop();
    };

    p.draw = function() {
      p.background('#262626');

      if (particles.length < 25) {
        for (let i = 0; i < 50; i++) {
          particles.push(new particle()); // append snowflake object
        }
      }

      if (parent.data.mask1) {
        p.text('😷', 0.1 * p.width, p.height * 0.8);      
      } else {
        p.text('😐', 0.1 * p.width, p.height * 0.8);              
      }

      if (parent.data.mask2) {
        p.text('😷', 0.9 * p.width, p.height * 0.8);      
      } else {
        p.text('😐', 0.9 * p.width, p.height * 0.8);      
      }

      p.stroke(240);
      if (parent.data.mask1) {
        p.line(0.2 * p.width, 10, 0.2 * p.width, p.height + 10);
      }

      if (parent.data.mask2) {
        p.line(0.8 * p.width, 10, 0.8 * p.width, p.height + 10);
      }

      p.noStroke();
      for (let particle of particles) {
        particle.display(); // draw snowflake
        particle.update(); // update snowflake position
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
      //console.log('visibility changed to ', isVisible);
      if (isVisible) {
        p.loop()
      } else {
        p.noLoop();
      }
    }

    // particle class
    function particle() {

      this.y = p.random(0.45 * p.height, 0.55 * p.height);
      this.size = p.random(1, 15);
      this.x = 0.1 * p.width;
      this.maxangle = 2 * p.atan2(p.height/2, p.width);
      this.angle = this.maxangle * p.random(-1, 1);
      this.wander = 0.02;
      this.v0 = p.random(0.1,5);
      this.vx = this.v0 * Math.cos(this.angle);
      this.vy = this.v0 * Math.sin(this.angle);
      this.pastFirstMask = false;
      this.pastSecondMask = false;

      this.update = function() {
        
        this.angle = p.random(2 * p.PI);

        this.ax = this.wander * Math.cos(this.angle);
        this.ay = this.wander * Math.sin(this.angle);
        
        this.vx += this.ax;
        this.vy += this.ay;
        
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        
        if (this.size > 3) {
          this.size = this.size * 0.99;
        }

        // delete snowflake if past end of screen
        if (this.x > p.width || this.x < -this.size || this.y > p.height || this.y < 0)     {
          let index = particles.indexOf(this);
          particles.splice(index, 1);
        }

        if (parent.data.mask1) {
          if (!this.pastFirstMask && this.x > 0.2 * p.width) {
            if (p.random(1) <= 0.5) {
              let index = particles.indexOf(this);
              particles.splice(index, 1);
            }
            this.pastFirstMask = true;
          }    
        }
        
        if (parent.data.mask2) {
          if (!this.pastSecondMask && this.x > 0.8 * p.width) {
            if (p.random(1) <= 0.5) {
              let index = particles.indexOf(this);
              particles.splice(index, 1);
            }
            this.pastSecondMask = true;
          }    
        }

      };

      this.display = function() {
        p.ellipse(this.x, this.y, this.size);
      };
    }


  };
}