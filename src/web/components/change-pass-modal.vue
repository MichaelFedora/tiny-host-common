<template>
<transition name='fade'>
<div v-if='active'
  class='change-pass-modal modal is-active'
  role='dialog'
  aria-modal='modal'>
  <div class='modal-background' @click='cancel()' />
  <div class='modal-card'>
    <header>
      <span>Change Password</span>
    </header>
    <section>
      <div class='field'>
        <input type='password' ref='pass' required placeholder='old password' v-model='password' />
        <span class='error'>{{ password === '' ? 'required' : '' }}</span>
      </div>
      <div class='field'>
        <input type='password' required placeholder='new passwprd' v-model='newpass' @keydown.enter='confirm()' />
        <span class='error'>{{ newpass != undefined ? (newpass === '' ? 'required' : newpass.length < 4 ? 'at least 4 characters' : '') : '' }}</span>
      </div>
    </section>
    <footer>
      <button @click='cancel'>cancel</button>
      <button class='warning' :disabled='!password || !newpass' @click='confirm'>confirm</button>
    </footer>
  </div>
</div>
</transition>
</template>
<script>
/** @param el {Element} */
function removeElement(el) {
  if (typeof el.remove !== 'undefined') {
      el.remove()
  } else if (typeof el.parentNode !== 'undefined' && el.parentNode !== null) {
      el.parentNode.removeChild(el)
  }
}

export default {
  name: 'tiny-change-pass-modal',
  data() { return { active: false, password: undefined, newpass: undefined }; },
  mounted() {
    this.active = true;
    this.$nextTick(() => this.$refs.pass?.focus());
    window.addEventListener('keyup', this.onKey);
  },
  destroyed() {
    window.removeEventListener('keyup', this.onKey);
  },
  methods: {
    confirm() {
      if(!this.active || !this.password || !this.newpass || this.newpass.length < 4) return;

      this.$emit('confirm', { password: this.password, newpass: this.newpass });
      this.close();
    },
    cancel() {
      if(!this.active) return;

      this.$emit('cancel');
      this.close();
    },
    close() {
      if(!this.active) return;

      this.active = false;
      setTimeout(() => {
        this.$destroy();
        removeElement(this.$el);
      }, 150);
    },
    /** @param ev {KeyboardEvent} */
    onKey(ev) {
      if(!this.active) return;

      else if(ev.key === 'Escape')
        this.cancel();
    }
  }
}
</script>
<style lang='scss'>
</style>
