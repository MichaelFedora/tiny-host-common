import localApi from 'services/local-api';
import { openModal } from 'utility';
import Vue from 'vue';

export default Vue.component('tiny-login', {

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
    valid(): boolean { return this.username && this.password && /\w{4,}/.test(this.password) && (!this.registering || this.confirmpass === this.password); }
  },
  mounted() {
    if(this.$route.query.username)
      this.username = '' + this.$route.query.username;
  },
  methods: {
    async register() {
      if(this.working || !this.valid) return;
      this.working = true;

      const success = await localApi.auth.register(this.username, this.password).then(() => true, e => false);
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

      const success = await localApi.auth.login(this.username, this.password).then(() => true, e => false);
      if(success) {
        if(this.$route.query.goto && !(this.$route.query.goto instanceof Array))
          this.$router.push(this.$route.query.goto);
        else
          this.$router.push('/');
      }

      this.working = false;
    }
  }
});
