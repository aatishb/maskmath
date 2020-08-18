// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name

    // p5 sketch goes here
    let particles = [];
    let mouseParticle;
    let mouseOnScreen = false;
    let target;
    let emojis = {};

    // VARIABLES
    let initialParticles = 40; 
    let particleSize = 30;
    let drag = 0.99;
    let bounciness = 0.2;

    p.preload = function() {
      emojis.neutral = p.loadImage('assets/neutral.png');
      emojis.mask = p.loadImage('assets/mask.png');
    }

    p.setup = function() {
      target = parent.$el;
      let width = target.clientWidth;
      //let height = target.clientHeight;
      let height = 400;
      //console.log(width, height);
      let canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);
      p.noStroke();
      p.strokeWeight(2);
      p.imageMode(p.CENTER);

      numParticles = initialParticles * width * height / 570000
      for (let i = 0; i < numParticles; i++) {
        particles.push(new particle());
      }
    };

    p.draw = function() {

      p.background(0, 0, 51);

      for (let particle of particles) {
        particle.update();
      }

      if (mouseOnScreen) {
        mouseParticle.update(p.mouseX, p.mouseY);
      }

      let particleArray = mouseOnScreen ? [...particles, mouseParticle] : particles;

      for (let p1 of particleArray) {
        for (let p2 of particleArray) {
          if (p1 !== p2) {
            let distSq = distSquared(p1.x, p1.y, p2.x, p2.y);
            if (distSq < 100*100) {
              let dist = Math.sqrt(distSq);
              let opacity = p.map(dist, 0, 100, 255, 0, true);
              p.stroke(238, 232, 170, opacity);
              p.line(p1.x, p1.y, p2.x, p2.y);
            }
          }
        } 
      }

      for (let p of particleArray) {
        p.display();
      }

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
      this.x = posY ? posY : p.random(0, p.width);
      this.angle = p.random(0, 2*Math.PI);
      this.wander = bounciness;
      this.v0 = 0;
      this.vx = this.v0 * Math.cos(this.angle);
      this.vy = this.v0 * Math.sin(this.angle);

      
      if (posX) { // mouse masking follows majority
        this.face = parent.data.maskusage >= 0.5 ? emojis.mask : emojis.neutral;
      } else { // everyone else is set randomly according to overall percentage of mask usage
        this.face = (Math.random() < parent.data.maskusage) ? emojis.mask : emojis.neutral;
      }

      this.update = function(posX, posY) {
        
        if (posX && posY) {

          // for mouseParticle
          this.x = posX;
          this.y = posY;
        
        } else {
 
          // brownian motion
          this.angle = p.random(2 * p.PI);

          this.ax = this.wander * Math.cos(this.angle);
          this.ay = this.wander * Math.sin(this.angle);

          this.vx += this.ax;
          this.vy += this.ay;

          // drag
          this.vx *= drag;
          this.vy *= drag;
          
          this.x = this.x + this.vx;
          this.y = this.y + this.vy;

          // wraparound the screen: x
          if (this.x > p.width + particleSize/2) {
            this.x = -particleSize/2;
          } else if (this.x < -particleSize/2) {
            this.x = p.width + particleSize/2;
          }

          // wraparound the screen: y
          if (this.y > p.height + particleSize/2) {
            this.y = -particleSize/2;
          } else if (this.y < -particleSize/2) {
            this.y = p.height + particleSize/2;
          }
        }

      };

      this.display = function() {
        p.image(this.face, this.x, this.y, particleSize, particleSize);

        /*
        p.noStroke();
        p.fill(238, 232, 170, 200);
        p.ellipse(this.x, this.y, this.size);
        */
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
      let height = 400;
      p.resizeCanvas(width, height);


      if (mouseOnScreen) {
        mouseParticle.remove();
        mouseOnScreen = false;
      }

      for (let particle of particles) {
        particle.remove();
      }

      numParticles = initialParticles * width * height / 570000
      for (let i = 0; i < numParticles; i++) {
        particles.push(new particle());
      }


    };

  };
}