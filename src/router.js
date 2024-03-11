import Vue from 'vue';
import Router from 'vue-router';

import Main from './components/page/Main.vue';
import Register from './components/page/Register.vue';
import Projects from './components/page/Projects.vue';
import Login from './components/page/Login.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/project/:projectId',
      name: 'main',
      props: true,
      component: Main,

    },

    {
      path: '/home',
      name: 'projects',
      component: Projects,
      //meta: { requiresAuth: true },
    },

  ],
});

router.beforeEach((to, from, next) => {
  console.log('Navigation Guard triggered');
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
