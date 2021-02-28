
function removeElement(el: Element) {
  if (typeof el.remove !== 'undefined') {
      el.remove()
  } else if (typeof el.parentNode !== 'undefined' && el.parentNode !== null) {
      el.parentNode.removeChild(el)
  }
}

export default {
  name: 'tiny-dialog',
  props: {
    title: String,
    message: String,
    type: String,
    alert: Boolean
  },
  data() { return { active: false }; },
  computed: {
    classes(): any { return { [(this as any).type]: true }; }
  },
  mounted() {
    (this as any).active = true;
    (this as any).$nextTick(() => ((this as any).$refs['submit'] as HTMLButtonElement)?.focus());
  },
  methods: {
    confirm() {
      this.$emit('confirm', true);
      this.close();
    },
    cancel() {
      this.$emit('cancel');
      this.close();
    },
    close() {
      this.active = false;
      setTimeout(() => {
        this.$destroy();
        removeElement(this.$el);
      }, 150);
    }
  }
} as Vue.ComponentOptions<any>;
