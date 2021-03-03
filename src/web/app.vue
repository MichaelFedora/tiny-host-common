<template>
<div id='app'>
  <h3>{{type ? type + 's' : 'tiny'}} host<template v-if='loggedIn'> - {{username}}</template></h3>
  <router-view />
</div>
</template>
<script>
import dataBus from 'services/data-bus';

export default {
  name: 'app',
  data() { return {
    loggedIn: Boolean(dataBus.session),
    type: dataBus.type || '',
    username: dataBus.user?.username || '',
    page: this.$route.name || ''
  }; },
  watch: {
    $route(n, o) {
      if(n.path !== o.path) {
        if(!/^\/login/.test(n.path)) {
          if(!this.loggedIn)
            this.loggedIn = Boolean(dataBus.session);
          if(!this.username)
            this.username = dataBus.user?.username;
        } else {
          if(this.loggedIn)
            this.loggedIn = Boolean(dataBus.session);
          if(this.username)
            this.username = dataBus.user?.username;
        }

        this.page = n.name;
      }
    }
  },
};
</script>
<style lang='scss'>
#app {
  padding: 1rem;
  padding-top: 1.5rem;

  display: flex;
  flex-flow: column;
  min-height: 100vh;
}
</style>
