// custom graph component
Vue.component('graph', {

  props: ['traces', 'layout', 'config'],

  template: '<div ref="graph" class="graph"></div>',

  methods: {

    graph() {
      Plotly.react(this.$refs.graph, this.traces, this.layout, this.config);
    },

  },

  mounted() {
    this.graph();
  },

  watch: {
    traces() {
      this.graph();
    },
    layout() {
      this.graph();
    }
  }
})

// slider component
Vue.component('slider', {
  props: ['value', 'min', 'max', 'step'],

  template: `<div><input type="range" :min="min" :max="max" :step="step" :value="value" @input="sliderChanged" class="slider"></input></div>`,

  methods: {
    sliderChanged: function(event) {
      let slider = event.target;
      this.$emit('input', slider.value)
    },
  }
})


// p5 network component
Vue.component('network', {

  template: `
    <div class="component nocursor">
      <p5 src="js/sketch2.js" :data="{maskusage: maskusage}"></p5>
    </div>`,

  props: ['maskusage']
})

// mask animation component
Vue.component('anim', {
  template: '<p5 src="js/sketch1.js" :data="{mask1: mask1, mask2: mask2, eout: eout, ein: ein}"></p5>',
  props: ['mask1', 'mask2', 'eout', 'ein']

})

// mask animation component with sidetext and caption
Vue.component('anim-with-caption', {

  template:   `
  <div class="graphic" dir="ltr">
    <div class="graphic-container">

      <div class="row small-big-small twohundredpx">

        <div class="center">
            <div class="label">{{ contagiousperson }}</div>
        </div>

        <anim :mask1="mask1" :mask2="mask2" :eout="eout" :ein="ein"></anim>

        <div class="center">
            <div class="label">{{ susceptibleperson }}</div>
        </div>

      </div>

      <div class="caption">
        <slot></slot>
      </div>

    </div>
  </div>`,

  props: ['mask1', 'mask2', 'eout', 'ein', 'contagiousperson', 'susceptibleperson']

})

// mask interactive component
/*
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
*/

// mask interactive component
/*
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
*/

// Creates a Vue <p5> Component
Vue.component('p5', {
  
  template: `<div class="center" v-observe-visibility="{
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

// translation list component
Vue.component('translation', {

  props: ['list'],

  template: `
  <h5>
    <ul id="translation-list">
      <li v-for="(item, index) in list" :key="item.language">
        <span v-if="index > 0"> &middot; </span><a :href="item.url">{{item.language}}</a>
      </li>
      <li v-if="url == '' || url == 'index.html'">
        <span> &middot; </span><a href="https://github.com/aatishb/maskmath/issues/4">Add a Translation</a>
      </li>
    </ul>
  </h5>`,

  data: function() {
    return {
      url: ''
    }
  },

  mounted() {
    this.url = window.location.href.split('/').pop();
  }
})


/* main Vue instance */
let app = new Vue({

  el: '#root',

  data: {
    eout: 0.5,  // mask effectiveness on exhale
    ein: 0.5,   // mask effectiveness on inhale
    e: 0.5,     // mask effectiveness (used for video viz)
    p: 0.5,     // percent of people wearing masks
    pnetwork: 0.5, // percent of people wearing masks for interactive network graph
    R0: 2.5,     // reproductive number R0
    graphBackgroundColor: 'rgb(0,0,51)',
    graphTextColor: 'rgb(255, 190, 137)',
    graphTraceColor: 'rgb(254, 199, 81)',
    expandaside1: false,
    expandaside2: false,
    translations: 
    [ 
      { url: 'index.html', language: 'English' },
      { url: 'index-he.html', language: 'עברית' },
      { url: 'index-fr.html', language: 'Français' },
      { url: 'index-it.html', language: 'Italiano' },
      { url: 'index-pt.html', language: 'Português Brasileiro' },
      { url: 'index-ru.html', language: 'Русский' },
      { url: 'index-es.html', language: 'Español' },
      { url: 'index-el.html', language: 'Ελληνικά' },
      { url: 'index-cs.html', language: 'Česky' },
      { url: 'index-uk.html', language: 'Українська' },
      { url: 'index-id.html', language: 'Bahasa Indonesia' },
      { url: 'index-fa.html', language: 'فارسی' },
      { url: 'index-nl.html', language: 'Nederlands' },
      { url: 'index-ca.html', language: 'Català' },
      { url: 'index-pl.html', language: 'Polski' },
    ]
  },

  methods: {

    convertToPercent(val) {
      return Math.round(10 * 100 * val) / 10;
    },

    R0withmask(p) {
      return this.R0 * (1 - this.ein * p) * (1 - this.eout * p);
    },

    graph2Layout(title, xaxistitle, yaxistitle, annotation1, annotation2) {
      return {
        title:'<b>' + title + '</b>',
        showlegend: false,
        xaxis: {
          title: xaxistitle,
          tickformat: ',.0%',
          color: this.graphTextColor,
          fixedrange: true
        },
        yaxis: {
          title: yaxistitle,
          range: [0, 3],
          color: this.graphTextColor,
          hoverformat: '.2f',
          fixedrange: true
        },
        paper_bgcolor: this.graphBackgroundColor,
        plot_bgcolor: this.graphBackgroundColor,
        font: {
          family: 'Open Sans, sans-serif',
          color: this.graphTextColor,
          size: 0.9 * this.fontSize
        },
        annotations: [
          {
            x: 0.01,
            y: 0.95,
            xref: 'x',
            yref: 'y',
            text: annotation1,
            showarrow: false,
            font: {
              family: 'Open Sans, sans-serif',
              color: 'lightgreen',
              size: 0.9 * this.fontSize
            },
            align: 'left',
            xanchor: 'left',
            yanchor: 'top',
            opacity: 1
          },
          {
            x: 0.01,
            y: 1.05,
            xref: 'x',
            yref: 'y',
            text: annotation2,
            showarrow: false,
            font: {
              family: 'Open Sans, sans-serif',
              color: 'salmon',
              size: 0.9 * this.fontSize
            },
            align: 'left',
            xanchor: 'left',
            yanchor: 'bottom',
            opacity: 1
          }
        ]

      }
    },

    graph3Layout(title, xaxistitle, yaxistitle) {
      return {
        title:'<b>' + title + '</b>',
        showlegend: false,
        xaxis: {
          title: xaxistitle,
          tickformat: ',.0%',
          color: this.graphTextColor,
          fixedrange: true
        },
        yaxis: {
          title: yaxistitle,
          range: [0, 1],
          color: this.graphTextColor,
          tickformat: '%',
          fixedrange: true
        },
        paper_bgcolor: this.graphBackgroundColor,
        plot_bgcolor: this.graphBackgroundColor,
        font: {
          family: 'Open Sans, sans-serif',
          color: this.graphTextColor,
          size: 0.9 * this.fontSize
        },
      }
    },

    graph3Traces(percentInfected) {
      return [
        {
          name: percentInfected,
          x: this.indexArray,
          y: this.indexArray.map(p => Math.max(1 + gsl_sf_lambert_W0(- this.R0withmask(p) * Math.exp(-this.R0withmask(p)))/this.R0withmask(p), 0) ),
          type: 'scatter',
          mode: 'lines',
          fill: 'tozeroy',
          fillcolor: 'rgba(255, 50, 50, 0.2)',
          line: {
            color: this.graphTraceColor,
            width: 4
          }
        },
        {
          x: [0,1],
          y: [1,1],
          type: 'scatter',
          mode: 'lines',
          fill: 'tonexty',
          fillcolor: 'rgba(50, 255, 50, 0.2)',
          line: {color: "transparent"},
          hoverinfo: 'none'
        }
      ]
    },

  },

  computed: {

    fontSize() {
      return parseInt(window.getComputedStyle(document.getElementById("root")).fontSize.slice(0,-2));
    },

    indexArray() {
      return new Array(101).fill(0).map((e,i) => i / 100);
    },

    graph2Traces() {
      return [
        {
          x: [0,1],
          y: [1,1],
          type: 'scatter',
          mode: 'lines',
          fill: 'tozeroy',
          fillcolor: 'rgba(50, 255, 50, 0.2)',
          line: {color: "transparent"},
          hoverinfo: 'none'
        },
        {
          x: [0,1],
          y: [3,3],
          type: 'scatter',
          mode: 'lines',
          fill: 'tonexty',
          fillcolor: 'rgba(255, 50, 50, 0.2)',
          line: {color: "transparent"},
          hoverinfo: 'none'
        },
        {
          name: 'R0',
          x: this.indexArray,
          y: this.indexArray.map(p => this.R0withmask(p)),
          mode: 'lines',
          line: {
            color: this.graphTraceColor,
            width: 4
          }
        },

      ]
    },

    

    config() {
      return {
        responsive: true,
        displayModeBar: false
      }
    },

    d1() {
      return 0;
    },
    d2() {
      return this.eout;
    },
    d3() {
      return this.ein;
    },
    d4() {
      return 1 - (1 - this.eout) * (1 - this.ein);
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
