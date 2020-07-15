   let allowResize = true;

    p.windowResized = function() {

      if (allowResize) {
        setTimeout(function(){
          console.log('window resized', p.windowWidth);
          let target = parent.$el;
          let width = target.clientWidth;
          let canvas = p.resizeCanvas(0.6 * p.windowWidth, p.height);
          let emojiSize = p.min(0.2 * p.width, p.height);
          p.textSize(emojiSize);
          allowResize = true;
        }, 300);
      }

      allowResize = false;

    }
