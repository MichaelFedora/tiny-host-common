<template>
<div id='tiny-login' class='content'>
  <h1>login</h1>
  <div class='form'>
    <div class='field'>
      <input placeholder='username' v-model='username' />
    </div>
    <div class='field'>
      <input placeholder='password' type='password' v-model='password' :pattern='registering ? "\\w{4,}" : null' @keyup.enter='registering ? null : login()' />
      <span class='error' v-if='registering'>{{ (username || password) && password.length < 4 ? "At least 4 characters." : "" }}</span>
    </div>
    <div v-if='registering' class='field'>
      <input placeholder='confirm password' type='password' v-model='confirmpass' :pattern='password' @keyup.enter='register()'/>
      <span class='error'>{{ password && password !== confirmpass ? "this != password" : "" }}</span>
    </div>
  </div>
  <div id='buttons'>
    <template v-if='!registering'>
      <a v-if='canRegister' @click='registering = true'>register</a>
      <div style='flex-grow: 1'/>
      <button class='primary' :disabled='!valid || working' @click='login'>login</button>
    </template>
    <template v-else>
      <button @click='registering = false'>cancel</button>
      <button class='primary' @click='register()' :disabled='!valid || working'>register</button>
    </template>
  </div>
</div>
</template>
<script src='./login.ts'></script>
<style lang='scss'>
#tiny-login {
  display: inline-block;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);

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
