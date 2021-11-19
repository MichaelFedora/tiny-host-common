<template>
<div id='app'>
  <h3>tiny {{type ? type + 's ' : ''}}host<template v-if='loggedIn'> - {{username}}</template></h3>
  <router-view />
</div>
<Modal
  v-for='(modal, i) of modalList'
  :key='"modal-" + i'
  v-bind='modal'
  @destroy='destroyModal(i)'
  @confirm='modal.onConfirm'
  @cancel='modal.onCancel'
/>
</template>
<script lang='ts'>
import { defineComponent, ref, toRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Modal from './components/modal.vue';
import dataBus from '@/services/data-bus';
import modals, { ModalPropsExtended } from '@/services/modals';

export default defineComponent({
  components: { Modal },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const loggedIn = ref(Boolean(dataBus.session));
    const type = ref(dataBus.type || '');
    const username = ref(dataBus.user?.username || '');
    const page = toRef(route, 'name');

    const modalList = ref([] as ModalPropsExtended[]);

    modals.modalRequest.subscribe(v => {
      modalList.value.push(v);
    });

    const destroyModal = (idx: number) => {
      modalList.value.splice(idx, 1);
    };

    modals.dismissAllRequest.subscribe(() => {
      const v = modalList.value;
      modalList.value = [];
      for(const m of v)
        m.onCancel();
    });

    watch(() => route.path, (n, o) => {
      if(n !== o) {
        if(!/^\/login/.test(n)) {
          if(!loggedIn.value)
            loggedIn.value = Boolean(dataBus.session);
          if(!username.value)
            username.value = dataBus.user?.username;
        } else {
          if(loggedIn.value)
            loggedIn.value = Boolean(dataBus.session);
          if(username.value)
            username.value = dataBus.user?.username;
        }
      }
    })

    return {
      loggedIn,
      type,
      username,
      page,

      modalList,
      destroyModal
    }
  }
});
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
