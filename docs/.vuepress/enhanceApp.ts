// .vuepress/enhanceApp.ts
import { defineClientConfig } from '@vuepress/client';

export default defineClientConfig({
  enhance({ router }) {
    router.beforeEach((to, from, next) => {
      const loginRoutes = ['/login.html']; // Add all login routes here
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (loginRoutes.includes(to.path) || isAdmin) {
        next();
      } else {
        next('/login/');
      }
    });
  },
});
