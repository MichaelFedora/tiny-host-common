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
    </section>
    <footer>
      <button v-if='!alert' @click='cancel'>cancel</button>
      <button :class='{ [type]: true }' ref='submit' @click='confirm' @keydown.esc='cancel'>{{ alert ? 'ok' : 'confirm' }}</button>
    </footer>
  </div>
</div>
</transition>
</template>
<script src='./modal.ts'></script>
<style lang='scss'>
</style>
