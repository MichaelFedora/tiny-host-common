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
<script lang='ts'>
import { defineComponent, reactive, computed, toRefs, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import dataBus from '@/services/data-bus';
import localApi from '@/services/local-api';

export default defineComponent({
  setup(args, context) {
    const route = useRoute();
    const handshake = computed(() => route.query.handshake as string);

    const data = reactive({
      working: false,

      username: dataBus.user?.username || '{current user}',

      app: '',
      scopes: [] as string[]
    });

    onMounted(async () => {
      if(!handshake.value)
        return;

      data.working = true;

      const appInfo = await localApi.auth.getHandshakeInfo(handshake.value).catch(() => null);
      data.app = appInfo?.app || '{broken}';
      data.scopes = appInfo?.scopes || [];

      data.working = false;
    });

    return {
      handshake,
      ...toRefs(data),

      cancel() {
        localApi.auth.cancelHandshake(handshake.value);
      },
      approve() {
        if(handshake.value && data.app)
          localApi.auth.approveHandshake(handshake.value);
      }
    }
  }
});
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
