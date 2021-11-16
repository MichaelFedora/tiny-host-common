<template>
<div id='tiny-sessions'>
  <h1>
    <router-link class='button icon info' to='/'>
      <svg-icon type='mdi' :path='mdiArrowLeft' />
    </router-link>
    <span>sessions</span>
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

    <template v-for='(mk, i) of masterkeys' :key='"mk-" + i'>
      <span>{{ mk.id }}</span>
      <div class='name'>
        <input v-if='mk.editing' type='text' placeholder='name' required v-model='mk.editName' />
        <span v-else>{{ mk.name }}</span>
      </div>
      <div>
        <template v-if='!mk.editing'>
          <button class='primary' @click='useMasterKey(mk.id)'>use</button>
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

    <template v-for='(sess, i) of sessions' :key='"sess-" + i'>
      <span>{{ sess.id }}</span>
      <div class='scopes'>
        <span v-for='(scope, j) of sess.scopes' :key='"sess-scope-" + i + "-" + j' class='tag'>{{scope}}</span>
      </div>
      <span>{{ (new Date(sess.created)).toLocaleString() }}</span>
      <div>
        <button class='danger' @click='revoke("s", sess.id)'>revoke</button>
      </div>
    </template>

    <span v-if='!sessions.length' style='grid-column: 1 / 4'>Nothing here...</span>
  </div>
</div>
</template>
<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue';
//@ts-ignore
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft, mdiPlus } from '@mdi/js';

import dataBus from '@/services/data-bus';
import localApi from '@/services/local-api';

import modals from '@/services/modals';

export default defineComponent({
  name: 'tiny-sessions',
  components: { SvgIcon },
  setup(args, options) {
    const data = reactive({
      working: false,
      username: dataBus.user?.username || '???',
      mdiArrowLeft, mdiPlus,
      sessions: [],
      masterkeys: []
    });

    async function refresh() {
      if(data.working) return;
      data.working = true;

      localApi.auth.getSessions().then(res => data.sessions = res, () => { });
      localApi.auth.getMasterKeys().then(res => data.masterkeys = res, () => data.masterkeys = null);

      data.working = false;
    }

    refresh();

    async function addKey() {
      // name it
      const name = await modals.open({
        title: 'Add Master Key',
        message: 'A Master Key can be used by a Tiny Home to use this node '
        + 'when authorizing with apps. Be careful -- this key can be used to '
        + 'access all of your data!',
        type: 'warning',
        prompt: { required: true, placeholder: 'name' }
      });

      console.log('name', name);

      if(!name)
        return;
      // add it
      const key = await localApi.auth.addMasterKey(name).catch(() => null);
      if(!key)
        return;

      const wrapped = btoa(JSON.stringify({ key, url: localApi.url, type: dataBus.type })).replace(/=+$/, '');

      //show it
      modals.open({
        title: 'Master Key Added',
        message: 'Add this to your tiny home. It can always be revoked from this '
        + 'page.',
        prompt: { readonly: true, value: wrapped },
        alert: true
      });

      refresh()
    }

    function useMasterKey(key: any) {
      const wrapped = btoa(JSON.stringify({ key, url: localApi.url, type: dataBus.type })).replace(/=+$/, '');

      modals.open({
        title: 'Master Key "' + key.name + '"',
        message: 'Add this to your tiny home. It can always be revoked from this '
        + 'page.',
        prompt: { readonly: true, value: wrapped },
        alert: true
      });
    }

    async function edit(type: 'mk' | 's', key: any) {
      switch(type) {
        case 'mk':
          key.editName = key.name;
      }
      key.editing = true;
    }

    function cancel(type: 'mk' | 's', key: any) {
      key.editing = false;
      switch(type) {
        case 'mk':
          key.editName = key.name;
      }
    }

    async function save(type: 's' | 'mk', key: any) {
      switch(type) {
        case 'mk':
          if(!key.editName) return;
          await localApi.auth.updateMasterKey(key.id, key.editName).catch(() => { });
          await refresh();
          break;
      }
      cancel(type, key);
    }

    async function revoke(type: 's' | 'mk', id: string) {
      switch(type) {
        case 's':
          await localApi.auth.delSession(id).catch(() => { });
        case 'mk':
          await localApi.auth.delMasterKey(id).catch(() => { });
      }
      return refresh();
    }

    return {
      ...toRefs(data),
      refresh,

      addKey,
      useMasterKey,
      edit,
      cancel,
      save,
      revoke
    }
  }
});
</script>
<style lang='scss'>
@import '@/colors.scss';

#tiny-sessions {

  > h1 { margin-bottom: 1em; }

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
      > span:not(:last-child) { margin-right: 0.67em; }
    }
  }
}
</style>
