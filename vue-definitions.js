// mask interactive component

Vue.component('maskanim', {

  template:   `
  <div class="graphic">
    <div class="anim">
      <div class="sideanim">
          <div>Contagious<br/>Person</div>
      </div>
      <p5 src="sketch1.js" :data="{mask1: mask1, mask2: mask2}"></p5>
      <div class="sideanim">
          <div>Susceptible<br/>Person</div>
      </div>
    </div>
    <div class="caption">
      <slot></slot>
    </div>
  </div>`,

  props: ['mask1', 'mask2']

})

// Creates a Vue <p5> Component
Vue.component('p5', {
  
  template: `<div v-observe-visibility="{
    callback: visibilityChanged,
    throttle: 300
  }"></div>`,

  props: ['src','data'],

  methods: {
    // loadScript from https://stackoverflow.com/a/950146
    // loads the p5 javscript code from a file
    loadScript(url, callback)
    {
      // Adding the script tag to the head as suggested before
      var head = document.head;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = callback;
      script.onload = callback;

      // Fire the loading
      head.appendChild(script);
    },

    loadSketch() {
      this.myp5 = new p5(sketch(this));
    },

    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible;
      if (this.myp5.visibilityChanged) {
        this.myp5.visibilityChanged(isVisible);
      }
    }
  },

  data: function() {
    return {
      myp5: {},
      isVisible: false
    }
  },

  mounted() {
    this.loadScript(this.src, this.loadSketch);
  },

  watch: {
    data: {
      handler: function(val, oldVal) {
        if(this.myp5.dataChanged) {
          this.myp5.dataChanged(val, oldVal);
        }
      },
      deep: true
    }
  }

})


/* main Vue instance */
let app = new Vue({

  el: '#root',

  data: {
  },

  methods: {
  },

  computed: {
  }

})