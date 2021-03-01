<template>
<div id='tiny-login' class='content'>
  <h1>login</h1>
  <div class='form'>
    <div class='field'>
      <input placeholder='username' ref='username' v-model='username' />
    </div>
    <div class='field'>
      <input placeholder='password' type='password' v-model='password' :pattern='registering ? "\\w{4,}" : null' @keyup.enter='registering ? null : login()' />
      <span class='error' v-if='registering'>{{ (username || password) && password.length < 4 ? "At least 4 characters." : "" }}</span>
    </div>
    <div v-if='registering' class='field'>
      <input placeholder='confirm password' type='password' v-model='confirmpass' :pattern='password' @keyup.enter='register()'/>
      <span class='error'>{{ password && password !== confirmpass ? "this != password" : "" }}</span>
    </div>
  </div>
  <div id='buttons'>
    <template v-if='!registering'>
      <a v-if='canRegister' @click='registering = true'>register</a>
      <div style='flex-grow: 1'/>
      <button class='primary' :disabled='!valid || working' @click='login'>login</button>
    </template>
    <template v-else>
      <button @click='registering = false'>cancel</button>
      <button class='primary' @click='register()' :disabled='!valid || working'>register</button>
    </template>
  </div>
</div>
</template>
<script>
import localApi from 'services/local-api';
import { openModal } from 'utility';

export default {
  name: 'tiny-login',

  data() { return {
    registering: false,
    canRegister: true,
    working: false,

    username: '',
    password: '',
    confirmpass: ''
  }; },
  watch: {
    registering(n, o) {
      if(!n === !o) return;
      this.username = '';
      this.password = '';
      this.confirmpass = '';
    }
  },
  computed: {
    /** @returns {boolean} */
    valid() { return this.username && this.password && /\w{4,}/.test(this.password) && (!this.registering || this.confirmpass === this.password); }
  },
  mounted() {
    if(this.$route.query.username)
      this.username = '' + this.$route.query.username;
    this.$refs.username?.focus();
  },
  methods: {
    async register() {
      if(this.working || !this.valid) return;
      this.working = true;

      const success = await localApi.auth.register(this.username, this.password).then(() => true, () => false);
      if(success) {
        await openModal({
          title: 'Registered',
          message: 'Registered as "' + this.username + '"!',
          type: 'success',
          alert: true
        });

        this.registering = false;
      }

      this.working = false;
    },

    async login() {
      if(this.working || !this.username || !this.password) return;
      this.working = true;

      let success = await localApi.auth.login(this.username, this.password).then(() => true, e => false);

      if(!success)
        this.$refs.username?.focus();

      if(success)
        success = await localApi.getSelf().then(() => true, () => false);

      if(success) {
        if(this.$route.query.goto && !(this.$route.query.goto instanceof Array))
          this.$router.push(this.$route.query.goto);
        else
          this.$router.push('/');
      }

      this.working = false;
    }
  }
};
</script>
<style lang='scss'>
#tiny-login {
  display: inline-block;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);

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
