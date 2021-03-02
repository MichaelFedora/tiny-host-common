<template>
<div id='tiny-sessions'>
  <h1>
    <router-link class='button icon info' to='/'>
      <svg-icon type='mdi' :path='mdiArrowLeft' />
    </router-link>
    <span>sessions - {{ username }}</span>
  </h1>
  <template v-if='masterkeys'>
  <h2 class='sub'>
    <span>master keys</span>
    <button class='icon success' @click='addKey'><svg-icon type='mdi' :path='mdiPlus' /></button>
  </h2>
  <div class='masterkeys'>
    <span class='h4 sub'>id</span>
    <span class='h4 sub'>name</span>
    <span class='h4 sub'>options</span>

    <template v-for='(mk, i) of masterkeys'>
      <span :key='"mk-id-" + i'>{{ mk.id }}</span>
      <div class='name' :key='"mk-name-" + i'>
        <input v-if='mk.editing' type='text' placeholder='name' required v-model='mk.editName' />
        <span v-else>{{ mk.name }}</span>
      </div>
      <div :key='"mk-opts-" + i'>
        <template v-if='!mk.editing'>
          <button class='warning'  @click='edit("mk", mk)'>edit</button>
          <button class='danger' @click='revoke("mk", mk.id)'>revoke</button>
        </template>
        <template v-else>
          <button class='success' @click='save("mk", mk)'>save</button>
          <button @click='cancel("mk", mk)'>cancel</button>
        </template>
      </div>
    </template>

    <span v-if='!masterkeys.length' style='grid-column: 1 / 4'>Nothing here...</span>
  </div>
  </template>
  <h2 class='sub'>sessions</h2>
  <div class='sessions'>
    <span class='h4 sub'>id</span>
    <span class='h4 sub'>scopes</span>
    <span class='h4 sub'>created</span>
    <span class='h4 sub'>options</span>

    <template v-for='(sess, i) of sessions'>
      <span :key='"sess-id-" + i'>{{ sess.id }}</span>
      <div class='scopes' :key='"sess-scopes-" + i'>
        <span v-for='(scope, j) of sess.scopes' :key='"sess-scope-" + i + "-" + j'>{{scope}}</span>
      </div>
      <span :key='"sess-created-" + i'>{{ (new Date(sess.created)).toLocaleString() }}</span>
      <div :key='"sess-opts-" + i'>
        <button class='danger' @click='revoke("s", sess.id)'>revoke</button>
      </div>
    </template>

    <span v-if='!sessions.length' style='grid-column: 1 / 4'>Nothing here...</span>
  </div>
</div>
</template>
<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft, mdiPlus } from '@mdi/js';

import dataBus from 'services/data-bus';
import localApi from 'services/local-api';

import { openModal } from 'utility';

export default {
  name: 'tiny-sessions',
  components: { SvgIcon },
  data() { return {
    working: false,
    username: dataBus.user?.username || '???',
    mdiArrowLeft, mdiPlus,
    sessions: [],
    masterkeys: []
  }; },
  mounted() { this.refresh(); },
  methods: {
    async refresh() {
      if(this.working) return;
      this.working = true;

      localApi.auth.getSessions().then(res => this.sessions = res, () => { });
      localApi.auth.getMasterKeys().then(res => this.masterkeys = res, () => this.masterkeys = null);

      this.working = false;
    },
    async addKey() {
      // name it
      const name = await openModal({
        title: 'Add Master Key',
        message: 'A Master Key can be used by a Tiny Home to use this node '
        + 'when authorizing with apps. Be careful -- this key can be used to '
        + 'access all of your data!',
        type: 'warning',
        prompt: { required: true, placeholder: 'name' }
      });

      if(!name)
        return;
      // add it
      const key = await localApi.auth.addMasterKey(name).catch(() => null);
      if(!key)
        return;

      //show it
      openModal({
        title: 'Master Key Added',
        message: 'Add this to your tiny home. It can always be revoked from this '
        + 'page.',
        prompt: { readonly: true, value: key },
        alert: true
      });

      this.refresh();
    },
    async edit(type, key) {
      switch(type) {
        case 'mk':
          this.$set(key, 'editName', key.name);
      }
      this.$set(key, 'editing', true);
    },
    cancel(type, key) {
      this.$set(key, 'editing', false);
      switch(type) {
        case 'mk':
          this.$set(key, 'editName', key.name);
      }
    },
    /**
     * @param type {'s' | 'mk'}
     * @param id {any}
     */
    async save(type, key) {
      switch(type) {
        case 'mk':
          if(!key.editName) return;
          await localApi.auth.updateMasterKey(key.id, key.editName).catch(() => { });
          await this.refresh();
          break;
      }
      this.cancel(type, key);
    },
    /**
     * @param type {'s' | 'mk'}
     * @param id {string}
     */
    async revoke(type, id) {
      switch(type) {
        case 's':
          await localApi.auth.delSession(id).catch(() => { });
        case 'mk':
          await localApi.auth.delMasterKey(id).catch(() => { });
      }
      return this.refresh();
    }
  }
}
</script>
<style lang='scss'>
@import 'colors.scss';

div#tiny-sessions {
  padding: 1rem;
  padding-top: 1.5rem;

  > h1, h2 {
    display: flex;
    align-items: baseline;
    > :not(:last-child) { margin-right: 0.33em; }
  }

  > div.masterkeys {
    display: grid;

    grid-template-columns: auto auto 1fr;
    grid-auto-rows: auto;
    gap: 1.5em;
    align-items: baseline;

    margin-bottom: 2rem;

    > * { margin: 0; }
  }

  > div.sessions {
    display: grid;

    grid-template-columns: auto auto auto 1fr;
    grid-auto-rows: auto;
    gap: 1.5em;
    align-items: baseline;

    > * { margin: 0; }

    > div.scopes {
      display: flex;
      > span {
        font-size: 0.87rem;
        padding: 0.33em 0.67em;
        background-color: $grey-lighter;
        color: $grey-dark;
        border-radius: 5px;
        text-align: center;
        min-width: 2em;
        &:not(:last-child) { margin-right: 0.67em; }
      }
    }
  }
}
</style>
