// interactive component
Vue.component('slider', {
  props: ['value'],

  template: `<div><input type="range" min="0" max="1" step="0.01" :value="value" @input="sliderChanged" class="slider"></input></div>`,

  methods: {
    sliderChanged: function(event) {
      let slider = event.target;
      this.$emit('input', slider.value)
    },
  }
})


// mask interactive component
Vue.component('anim', {
  template: '<p5 src="sketch1.js" :data="{mask1: mask1, mask2: mask2}"></p5>',
  props: ['mask1', 'mask2']

})

Vue.component('anim-with-caption', {

  template:   `
  <div class="graphic">
    <div class="graphic-container">

      <div class="row small-big-small twohundredpx">

        <div class="center">
            <div class="label">Contagious<br/>Person</div>
        </div>

        <anim :mask1="mask1" :mask2="mask2"></anim>

        <div class="center">
            <div class="label">Susceptible<br/>Person</div>
        </div>

      </div>

      <div class="caption">
        <slot></slot>
      </div>

    </div>
  </div>`,

  props: ['mask1', 'mask2']

})

// mask interactive component
Vue.component('maskscenario', {

  template:   `
    <div class="anim row">
      <p5 src="sketch1.js" :data="{mask1: mask1, mask2: mask2}"></p5>
      <div class="center">
          <div>{{text1}}</div>
      </div>
      <div class="center">
          <div>{{text2}}</div>
      </div>
    </div>`,

  props: ['mask1', 'mask2', 'text1', 'text2']

})

// mask interactive component
Vue.component('tablelabel', {

  template:   `
    <div class="anim row heading">
      <div class="center">
          <div>{{text1}}</div>
      </div>
      <div class="center">
          <div>{{text2}}</div>
      </div>
      <div class="center">
          <div>{{text3}}</div>
      </div>
    </div>`,

  props: ['text1', 'text2', 'text3']

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
    Eout: 0.5,
    Ein: 0.5,
    p: 0.5,
  },

  methods: {
    convertToPercent(val) {
      return Math.round(100 * 100 * val) / 100;
    },
  },

  computed: {
    d1() {
      return 0;
    },
    d2() {
      return this.Eout;
    },
    d3() {
      return this.Ein;
    },
    d4() {
      return 1 - (1 - this.Eout) * (1 - this.Ein);
    },
    l1() {
      return (1 - this.p) * (1 - this.p);
    },
    l2() {
      return this.p * (1 - this.p);
    },
    l3() {
      return (1 - this.p) * this.p;
    },
    l4() {
      return this.p * this.p;
    },
  }

})