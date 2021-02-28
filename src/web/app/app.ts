import Vue from 'vue';
import { mdiAccount } from '@mdi/js';

import localApi from 'services/local-api';
import dataBus from 'services/data-bus';
import { openModal } from 'utility';

export default Vue.component('app', {
  data() { return {
    loggedIn: Boolean(dataBus.session),
    user: dataBus.user,
    mdiAccount
  }; },
  watch: {
    $route(n, o) {
      if(n.path !== o.path && !this.loggedIn && !/^\/login/.test(n.path))
        this.loggedIn = Boolean(dataBus.session);
    }
  },
  methods: {
    async changePassword() {
      await openModal({
        title: 'wip',
        message: 'to be implemented ;3',
        alert: true
      });
    },
    async logout() {
      await localApi.auth.logout();
      this.$router.push('/login');
      this.loggedIn = false;
    },
    async deleteSelf() {
      const choice = await openModal({
        title: 'Delete Account',
        type: 'danger',
        message: 'Are you sure you want to delete your account? This cannot be undone.',
      });

      if(choice) {
        await localApi.deleteSelf();
        this.$router.push('/login');
        this.loggedIn = false;
      }
    }
  }
});
