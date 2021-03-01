import Vue from 'vue';
import dataBus from 'services/data-bus';

export default Vue.component('app', {
  data() { return {
    loggedIn: Boolean(dataBus.session),
  }; },
  watch: {
    $route(n, o) {
      if(n.path !== o.path && !this.loggedIn && !/^\/login/.test(n.path))
        this.loggedIn = Boolean(dataBus.session);
    }
  },
});
