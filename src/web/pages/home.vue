<template>
<div id='tiny-home' class='content'>
  <h1>home - {{ username }}</h1>
  <div>
    <router-link class='button info' to='/sessions'><span>Manage Sessions</span></router-link>
    <button class='warning' @click='changePass'><span>Change Password</span></button>
    <button class='danger' @click='deleteSelf'><span>Delete Account</span></button>
    <button class='primary' @click='logout'><span>Logout</span></button>
  </div>
</div>
</template>
<script>
import dataBus from 'services/data-bus';
import localApi from 'services/local-api';

import { openModal, openCustomModal } from 'utility';

import changePassModal from 'components/change-pass-modal.vue';

export default {
  name: 'tiny-home',
  data() { return {
    working: false,
    username: dataBus.user?.username || '???'
  }; },
  mounted() { this.refresh(); },
  methods: {
    async refresh() {
      if(this.working) return;
      this.working = true;

      // just show places to go

      this.working = false;
    },
    async changePass() {
      const choice = await openCustomModal(changePassModal);
      if(choice)
        await localApi.auth.changePass(choice.password, choice.newpass).catch(() => { });
    },
    async logout() {
      await localApi.auth.logout();
      this.$router.push('/login');
    },
    async deleteSelf() {
      const choice = await openModal({
        title: 'Delete Account',
        type: 'danger',
        message: 'Are you sure you want to delete your account? This cannot be undone.',
        prompt: { type: 'password', placeholder: 'password', required: true }
      });

      if(choice) {
        await localApi.deleteSelf(choice).catch(() => { });
        this.$router.push('/login');
      }
    }
  }
};
</script>
<style lang='scss'>
#tiny-home {
  position: relative;
  padding: 1rem;
  padding-top: 1.5rem;
  min-height: 100vh;
  display: flex;
  flex-flow: column;

  > h1 {
    width: 100%;
  }

  display: flex;
  align-items: center;

  > div {

    flex-grow: 1;
    align-content: center;

    display: grid;
    grid-template-columns: repeat(2, 10em);
    grid-template-rows:    repeat(2, 10em);
    gap: 1.5em;

    > button, > .button {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      min-width: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
