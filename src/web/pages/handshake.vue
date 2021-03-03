<template>
<div id='tiny-handshake'>
  <h1>handshake</h1>
  <h2 class='sub'>{{ app }}</h2>
  <p>
    scopes:<br>
    <ul>
      <li v-for='(scope, i) of scopes' :key='"filescope-" + i'>{{scope}}</li>
    </ul>
  </p>
  <p>Authenticate as <b>{{ username }}</b> with these scopes?</p>
  <hr>
  <div id='buttons'>
    <button @click='cancel'>cancel</button>
    <button class='primary' @click='approve'>approve</button>
  </div>
</div>
</template>
<script>
import dataBus from 'services/data-bus';
import localApi from 'services/local-api';

export default {
  data() { return {
    working: false,

    username: dataBus.user?.username || '{current user}',

    app: 'my app',
    /** @type {string[]} */
    scopes: ['/public', '/appdata']
  }; },
  computed: {
    handshake() { return String(this.$route.query.handshake); },
  },
  async mounted() {
    if(!this.handshake)
      return;

    this.working = true;

    const appInfo = await localApi.auth.getHandshakeInfo(this.handshake).catch(() => null);
    this.app = appInfo?.app || '{broken}';
    this.scopes = appInfo?.scopes || [];

    this.working = false;
  },
  methods: {
    cancel() {
      localApi.auth.cancelHandshake(this.handshake);
    },
    approve() {
      if(this.handshake && this.app)
        localApi.auth.approveHandshake(this.handshake);
    }
  }
};
</script>
<style lang='scss'>
#tiny-handshake {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  align-self: center;
  align-content: center;
  justify-content: center;

  > div#buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;

    > button:not(:last-child) {
      margin-right: 0.5rem;
    }

    > a {
      font-size: 0.8rem;
    }
  }
}
</style>
