<template>
<div id='app'>
  <div id='account-dropdown' v-if='loggedIn'>
    <button slot='trigger' id='menu-fab'><svg-icon type='mdi' :path='mdiAccount' /></button>
    <button @click='changePassword()' class='hover-info'>change password</button>
    <button @click='logout()'>logout</button>
    <button @click='deleteSelf()' class='hover-danger'>(!) delete self</button>
  </div>
  <router-view />
</div>
</template>
<script src='./app.ts'></script>
<style lang='scss'>
div#app {
  div#account-dropdown {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 20;

    button#menu-fab {
      display: flex;
      align-items: center;
      justify-content: center;

      background-color: hsl(171, 100%, 41%);
      color: white;

      border: none;
      padding: 0.5em;
      box-shadow: 0 1px 5px rgba(0,0,0,0.33);
      border-radius: 50%;

      cursor: pointer;
      user-select: none;
      z-index: 1;
    }
  }
}
</style>
