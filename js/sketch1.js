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
    let emojis = {};
    let isVisible = false;

    p.preload = function() {
      emojis.neutral = p.loadImage('assets/neutral.png');
      emojis.confused = p.loadImage('assets/confused.png');
      emojis.flinch = p.loadImage('assets/flinch.png');
      emojis.cough = p.loadImage('assets/cough.png');
      emojis.worried = p.loadImage('assets/worried.png');
    }

    p.setup = function() {
      target = parent.$el;
      let width = target.clientWidth;
      let height = 0.833 * target.clientHeight;
      let canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);
      p.fill(240);
      p.noStroke();
      emojiSize = height * 0.66;
      p.imageMode(p.CENTER);
      p.rectMode(p.CENTER, p.CENTER);

      for (let i = 0; i < 21; i++) {
        particles.push(new particle());
      }

      /*
      emojis.neutral.resize(emojiSize, emojiSize);
      emojis.confused.resize(emojiSize, emojiSize);
      emojis.flinch.resize(emojiSize, emojiSize);
      emojis.cough.resize(emojiSize, emojiSize);
      emojis.worried.resize(emojiSize, emojiSize);
      */

    };

    function drawMask(x,y) {
      p.drawingContext.setLineDash([]);


      // straps
      p.stroke('white');
      p.strokeWeight(emojiSize/15);
      p.line(x - 0.47*emojiSize, y - 0.25*emojiSize, x + 0.3*emojiSize, y + 0.1*emojiSize);
      p.line(x + 0.47*emojiSize, y - 0.25*emojiSize, x - 0.3*emojiSize, y + 0.1*emojiSize);

      // mask
      p.noStroke();
      p.fill('white');
      p.ellipse(x, y, 0.6*emojiSize, 0.4*emojiSize)

      // nose clip
      p.stroke('grey');
      p.strokeWeight(emojiSize/25);
      p.arc(x, y, 0.7*0.6*emojiSize, 0.7*0.4*emojiSize, -Math.PI/2 -0.5, -Math.PI/2 + 0.5);

      /*
      // surgical mask

      p.stroke('white');
      p.strokeWeight(emojiSize/15);
      p.line(x - 0.47*emojiSize, y - 0.25*emojiSize, x, y);
      p.line(x + 0.47*emojiSize, y - 0.25*emojiSize, x, y);
      p.line(x - 0.38*emojiSize, y + 0.02*emojiSize, x, y + 0.15*emojiSize);
      p.line(x + 0.38*emojiSize, y + 0.02*emojiSize, x, y + 0.15*emojiSize);

      p.noStroke();
      p.fill(158,187,214);
      p.rect(x, y, 0.55*emojiSize, 0.4*emojiSize, 0.1*emojiSize);
      */

    }

    function drawContagiousPerson() {
      
      if (particles.length > 70) {
        p.image(emojis.cough, emojiSize/2, p.height/2, emojiSize, emojiSize);              
      } else if (particles.length > 60) {
        p.image(emojis.flinch, emojiSize/2, p.height/2, emojiSize, emojiSize);              
      } else {
        p.image(emojis.neutral, emojiSize/2, p.height/2, emojiSize, emojiSize);              
      }

      
      if (parent.data.mask1) {
        let x = emojiSize/2;
        let y = p.height * 2/3;
        drawMask(x,y);
      }

    }

    function drawSusceptiblePerson() {

      if (worry > 10) {
        p.image(emojis.worried, p.width - emojiSize/2, p.height/2, emojiSize, emojiSize);      
      } else if (worry > 5) {
        p.image(emojis.confused, p.width - emojiSize/2, p.height/2, emojiSize, emojiSize);      
      } else {
        p.image(emojis.neutral, p.width - emojiSize/2, p.height/2, emojiSize, emojiSize);      
      }

      if (parent.data.mask2) {
        let x = p.width - emojiSize/2;
        let y = p.height * 2/3;
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
      p.strokeWeight(emojiSize/12);
      p.drawingContext.setLineDash([0, emojiSize/7]);

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
        nearbyParticles += particle.checkIfNear(p.width - emojiSize/2, p.height/2, emojiSize/2);
      }

      if (nearbyParticles) {
        worry++;
      } else {
        worry--;
      }

      if (worry > 21) {worry = 21;}
      if (worry < 0) {worry = 0;}

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
      //console.log('visibility changed to ', isVisible, Date.now());
      if (isVisible) {
        p.loop()
      } else {
        p.noLoop();
      }
    };

    p.windowResized = function() {
      //console.log('p5 canvas resized');
      p.resizeCanvas(0, 0);

      setTimeout(function(){
        let width = target.clientWidth;
        let height = 0.833 * target.clientHeight;
        p.resizeCanvas(width, height);
        emojiSize = height * 0.66;
        particles = [];        
      }, 50);


      /*
      emojis.neutral.resize(emojiSize, emojiSize);
      emojis.confused.resize(emojiSize, emojiSize);
      emojis.flinch.resize(emojiSize, emojiSize);
      emojis.cough.resize(emojiSize, emojiSize);
      emojis.worried.resize(emojiSize, emojiSize);
      */

    };

    // particle class
    function particle() {

      this.y = p.random(0.55 * p.height, 0.65 * p.height);
      this.size = p.random(0.05*emojiSize, 0.14*emojiSize);
      this.x = emojiSize / 2;
      this.maxangle = 2 * p.atan2(p.height/2, p.width);
      this.angle = this.maxangle * p.random(-1, 1);
      this.wander = 0.02;
      this.v0 = p.random(0.1, 0.01*p.width);
      this.vx = this.v0 * Math.cos(this.angle);
      this.vy = this.v0 * Math.sin(this.angle);
      this.pastFirstMask = false;
      this.pastSecondMask = false;
      this.color = 'palegoldenrod';
      this.fadeOut = false;
      this.fadeCount = 30;
      this.minSize = 0.036 * emojiSize;

      this.update = function() {
        
        this.angle = p.random(2 * p.PI);

        this.ax = this.wander * Math.cos(this.angle);
        this.ay = this.wander * Math.sin(this.angle);
        
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

