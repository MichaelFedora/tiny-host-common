<template>
<transition name='fade'>
<div v-if='active'
  class='modal is-active'
  :class='classes'
  role='dialog'
  aria-modal='modal'>
  <div class='modal-background' @click='cancel()' />
  <div class='modal-card'>
    <header v-show='title'>
      <span>{{title}}</span>
    </header>
    <section>
      <p class='content'>{{message}}</p>
      <div class='field' v-if='input'>
        <input :type='input.type' :placeholder='input.placeholder' :required='input.required' v-model='text' />
        <span class='error'>{{ input.required && text === '' ? 'required' : '' }}</span>
      </div>
    </section>
    <footer>
      <button v-if='!alert' @click='cancel'>cancel</button>
      <button :class='{ [type]: true }' ref='submit' :disabled='input && input.required && !text' @click='confirm' @keydown.esc='cancel'>{{ alert ? 'ok' : 'confirm' }}</button>
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
  name: 'tiny-modal',
  props: {
    title: String,
    message: String,
    type: { type: String, default: 'primary' },
    alert: Boolean,
    prompt: { type: Object, default: () => null }
  },
  data() { return { active: false, text: undefined }; },
  computed: {
    classes() { return { [this.type]: true }; },
    /**
     * @returns {{type: string, placeholder: string}} input object
     */
    input() {
      if(!this.prompt) return null;
      else return Object.assign({ type: 'text', placeholder: '', required: false }, this.prompt);
    }
  },
  mounted() {
    this.active = true;
    this.$nextTick(() => this.$refs.submit?.focus());
    window.addEventListener('keydown', this.onKeydown);
  },
  destroyed() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    confirm() {
      if(!this.active) return;

      this.$emit('confirm', this.input ? this.text : true);
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
    onKeydown(ev) {
      if(!this.active) return;

      if(ev.key === 'Enter')
        this.confirm();
      else if(ev.key === 'Escape')
        this.cancel();
    }
  }
}
</script>
<style lang='scss'>
</style>
