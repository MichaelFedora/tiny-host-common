import Vue from 'vue';
import VueRouter from 'vue-router';

// @ts-ignore
const HomePage = () => import('pages/home.vue');
// @ts-ignore
const SessionsPage = () => import('pages/sessions.vue');
// @ts-ignore
const LoginPage = () => import('pages/login.vue');
// const HandshakePage = () => import('./pages/handshake/handshake');

// @ts-ignore
import NotFoundPage from 'pages/not-found.vue';
import dataBus from 'services/data-bus';


Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: HomePage, name: 'home' }, // main "menu"
    { path: '/sessions', component: SessionsPage, name: 'sessions' }, // managing sessions
    { path: '/login', component: LoginPage, name: 'login' }, // loggin in (obv)
    // { path: '/handshake', component: HandshakePage, name: 'handshake' }, // loggin in (obv)
    { path: '**', component: NotFoundPage, name: 'not-found' }
  ]
});

router.beforeEach((to, from, next) => {
  if(to.path !== from.path) {
    if(to.path.length > 1) {

      const sdir = [];
      let buff = '';
      to.path.slice(1).split('/').forEach(v => {
        if(!v) buff += '/';
        else {
          if(buff) sdir.push(buff + v);
          else sdir.push(v);
        }
      });

      document.title = 'tiny host - ' + sdir.join(' - ');
    } else document.title = 'tiny host';
  }

  if(!dataBus.session && !/^\/login/.test(to.path))
    next(`/login?goto=${to.fullPath}`);

  next();
});

export default router;
