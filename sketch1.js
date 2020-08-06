// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here
    let particles = []; 
    let emojiSize;
    let target;
    let nearbyParticles = 0;
    let worry = 0;

    p.setup = function() {
      target = parent.$el;
      let width = target.clientWidth;
      let height = 0.833 * target.clientHeight;
      //console.log(width, height);
      let canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);
      p.fill(240);
      p.noStroke();
      emojiSize = height * 0.66;
      p.textSize(emojiSize);
      p.textAlign(p.CENTER, p.CENTER);
      //console.log(parent.data.mask1);
      p.noLoop();

      //new ResizeObserver(onResize).observe(target);
    };

    function drawMask(x,y) {
      // straps
      p.stroke('white');
      p.strokeWeight(emojiSize/15);
      p.drawingContext.setLineDash([]);
      p.line(x - 0.43*emojiSize, y - 0.2*emojiSize, x + 0.27*emojiSize, y + 0.1*emojiSize);
      p.line(x + 0.43*emojiSize, y - 0.2*emojiSize, x - 0.27*emojiSize, y + 0.1*emojiSize);

      // mask
      p.noStroke();
      p.fill('white');
      p.ellipse(x, y, 0.5*emojiSize, 0.37*emojiSize)

      // nose clip
      p.stroke('grey');
      p.strokeWeight(emojiSize/40);
      p.arc(x, y, 0.8*0.5*emojiSize, 0.8*0.35*emojiSize, -Math.PI/2 -0.5, -Math.PI/2 + 0.5);
    }

    function drawContagiousPerson() {
      
      p.text('😐', emojiSize/2, p.height * 0.6);              
      
      if (parent.data.mask1) {
        let x = emojiSize/2;
        let y = p.height * 0.6;
        drawMask(x,y);
      }

    }

    function drawSusceptiblePerson() {

      if (worry > 10) {
        p.text('😟', p.width - emojiSize/2, p.height * 0.6);      
      } else if (worry > 5) {
        p.text('😕', p.width - emojiSize/2, p.height * 0.6);      
      } else {
        p.text('😐', p.width - emojiSize/2, p.height * 0.6);      
      }

      if (parent.data.mask2) {
        let x = p.width - emojiSize/2;
        let y = p.height * 0.6;
        drawMask(x,y);
      }

    }

    p.draw = function() {
      p.background(0, 0, 51);

      if (particles.length < 25) {
        for (let i = 0; i < 50; i++) {
          particles.push(new particle());
        }
      }

      drawContagiousPerson();
      drawSusceptiblePerson();

      p.stroke(240);
      p.strokeWeight(7);
      p.drawingContext.setLineDash([0, 15]);

      if (parent.data.mask1) {
        p.line(1.25 * emojiSize, 10, 1.25 * emojiSize, p.height + 10);
      }

      if (parent.data.mask2) {
        p.line(p.width - 1.25 * emojiSize, 10, p.width - 1.25 * emojiSize, p.height + 10);
      }

      p.noStroke();
      nearbyParticles = 0;
      for (let particle of particles) {
        particle.display();
        particle.update();
        nearbyParticles += particle.checkIfNear(p.width - emojiSize/2, p.height * 0.6 - 0.2*emojiSize, emojiSize/2);
      }

      if (nearbyParticles) {
        worry++;
      } else {
        worry--;
      }

      if (worry > 21) {worry = 21;}
      if (worry < 0) {worry = 0;}

      //p.ellipse(p.width - emojiSize/2, p.height * 0.6 - 0.2*emojiSize, emojiSize);
      //console.log('nearby particles', nearbyParticles);
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
    };

    p.windowResized = function() {
      //console.log('p5 canvas resized');
      let width = target.clientWidth;
      let height = 0.833 * target.clientHeight;
      p.resizeCanvas(width, height);
      emojiSize = height * 0.66;
      p.textSize(emojiSize);

      for (let particle of particles) {
        particle.remove();
      }

    };

    function onResize() {
      let width = target.clientWidth;
      let height = target.clientHeight;
      //console.log('p5 container resized', width, height);
    }

    // particle class
    function particle() {

      this.y = p.random(0.45 * p.height, 0.55 * p.height);
      this.size = p.random(0.05*emojiSize, 0.14*emojiSize);
      this.x = emojiSize / 2;
      this.maxangle = 2 * p.atan2(p.height/2, p.width);
      this.angle = this.maxangle * p.random(-1, 1);
      this.wander = 0.02;
      this.v0 = p.random(0.1,5);
      this.vx = this.v0 * Math.cos(this.angle);
      this.vy = this.v0 * Math.sin(this.angle);
      this.pastFirstMask = false;
      this.pastSecondMask = false;
      this.color = 'palegoldenrod';
      this.fadeOut = false;
      this.fadeCount = 30;

      this.update = function() {
        
        this.angle = p.random(2 * p.PI);

        this.ax = this.wander * Math.cos(this.angle);
        this.ay = this.wander * Math.sin(this.angle);
        
        this.vx += this.ax;
        this.vy += this.ay;
        
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        
        if (this.size > 0.036 * emojiSize) {
          this.size = this.size * 0.99;
        }

        // delete particle if it leaves screen
        if (this.x > p.width || this.x < -this.size || this.y > p.height || this.y < 0) {
          this.remove();
        }

        if (parent.data.mask1) {
          if (!this.pastFirstMask && this.x > 1.25 * emojiSize) {
            if (p.random(1) <= parent.data.eout) {
              this.color = 'red';
              this.vx *= -1;
              this.fadeOut = true;
            }
            this.pastFirstMask = true;
          }

          else if (this.fadeOut) {
            this.fadeCount--;
            if (this.fadeCount == 0) {
              this.remove();
            }
          }
        }
        
        if (parent.data.mask2) {
          if (!this.pastSecondMask && this.x > p.width - 1.25 * emojiSize) {
            if (p.random(1) <= parent.data.ein) {
              this.color = 'red';
              this.vx *= -1;
              this.fadeOut = true;
            }
            this.pastSecondMask = true;
          }

          else if (this.fadeOut) {
            this.fadeCount--;
              if (this.fadeCount == 0) {
                this.remove();
              }
          }
        }

      };

      this.display = function() {
        p.fill(this.color);
        p.ellipse(this.x, this.y, this.size);
      };

      this.remove = function() {
        let index = particles.indexOf(this);
        particles.splice(index, 1);
      }

      this.checkIfNear = function(x,y,range) {
        return distSquared(this.x, this.y, x, y) < range*range ? 1 : 0;
      }

    }

    function distSquared(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return dx * dx + dy * dy;
    }

  };
}

