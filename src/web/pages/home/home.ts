import Vue from 'vue';

export default Vue.component('tiny-home', {
  data() { return {
    working: false
  }; },
  mounted() { this.refresh(); },
  methods: {
    async refresh() {
      if(this.working) return;
      this.working = true;

      // just show places to go

      this.working = false;
    }
  }
});
