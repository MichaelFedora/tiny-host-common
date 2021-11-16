import { createRouter, createWebHistory } from 'vue-router';

const HomePage = () => import('@/pages/home.vue');
const SessionsPage = () => import('@/pages/sessions.vue');
const LoginPage = () => import('@/pages/login.vue');
const HandshakePage = () => import('@/pages/handshake.vue');

import NotFoundPage from '@/pages/not-found.vue';
import dataBus from '@/services/data-bus';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage, name: 'home' }, // main "menu"
    { path: '/sessions', component: SessionsPage, name: 'sessions' }, // managing sessions
    { path: '/login', component: LoginPage, name: 'login' }, // loggin in (obv)
    { path: '/handshake', component: HandshakePage, name: 'handshake' }, // handshaking apps
    { path: '/:pathMatch(.*)*', component: NotFoundPage, name: 'not-found' }
  ]
});

router.beforeEach((to, from, next) => {
  const baseTitle = 'tiny ' + (dataBus.type ? dataBus.type + 's ' : '') + 'host';

  if(to.path !== from.path) {
    if(to.name)
      document.title = baseTitle + ' - ' + to.name.toString().split('-').map(v => v[0].toLocaleUpperCase() + v.slice(1)).join(' ');
    else if(to.path.length > 1) {

      const sdir = [];
      let buff = '';
      to.path.slice(1).split('/').forEach(v => {
        if(!v) buff += '/';
        else {
          if(buff) sdir.push(buff + v);
          else sdir.push(v);
        }
      });

      document.title = baseTitle + ' - ' + sdir.join(' - ');
    } else
      document.title = baseTitle;
  }

  if(!dataBus.session && !/^\/login/.test(to.path))
    next(`/login?goto=${to.fullPath}`);

  next();
});

export default router;
