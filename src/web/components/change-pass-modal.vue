<template>
<Modal :valid='valid' title='Change Password' type='warning' @confirm='confirm()'>
  <div class='field'>
    <input class='warning' type='password' ref='passEl' required placeholder='old password' v-model='password' />
    <span class='error'>{{ password === '' ? 'required' : '' }}</span>
  </div>
  <div class='field'>
    <input class='warning' type='password' required placeholder='new password' v-model='newpass' @keydown.enter='confirm()' />
    <span class='error'>{{ newpass != undefined ? (newpass === '' ? 'required' : newpass.length < 4 ? 'at least 4 characters' : '') : '' }}</span>
  </div>
</Modal>
</template>
<script lang='ts' setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import Modal from './modal.vue';

const passEl = ref<HTMLInputElement>(null);

const password = ref<string>(undefined);
const newpass = ref<string>(undefined);
const valid = computed(() => !Boolean(!password.value || !newpass.value || newpass.value.length < 4));

const emits = defineEmits<{
  (e: 'confirm', data: { password: string; newpass: string })
}>();

onMounted(() => {
  nextTick(() => passEl.value?.focus());
});

function confirm() {
  if(!valid.value) return;

  emits('confirm', { password: password.value, newpass: newpass.value });
}
</script>
<style lang='scss'>
</style>
