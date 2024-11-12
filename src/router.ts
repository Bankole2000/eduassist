import { createWebHashHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { storeToRefs } from "pinia";



function userAuthenticated(_: any, __: any, next: (arg0?: { name: string; } | undefined) => void){
  const { user, token } = storeToRefs(useAuthStore())
  if(!user || !token){
    next({ name: 'login'})
  } else {
    next()
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    alias: "/dashboard",
    name: "dashboard",
    beforeEnter: [userAuthenticated],
    component: () => import("./views/Dashboard.vue"),
  },
  // {
  //   path: "/tutorials/:id",
  //   name: "tutorial-details",
  //   component: () => import("./views/TutorialDetails.vue"),
  // },
  {
    path: "/about",
    name: "about",
    component: () => import("./views/About.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("./views/Contact.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("./views/Test.vue"),
  },
  {
    path: "/auth/login",
    name: "login",
    component: () => import("./views/Signin.vue")
  },
  {
    path: "/auth/signup",
    name: "signup",
    component: () => import("./views/Signup.vue")
  },
  {
    path: '/courses/:id',
    name: "Course",
    component: () => import("./views/Course.vue"),
  },
  {
    path: '/quiz/:id',
    name: 'Quiz',
    component: () => import("./views/Quiz.vue")
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import("./views/Profile.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const publicPages = ['/auth/login', '/auth/signup', '/test'];
  const authRequired = !publicPages.includes(to.path);
  const { user, token } = storeToRefs(useAuthStore())
  if (authRequired && (!user.value || !token.value)) {
    next('/auth/login');
  } else {
    next();
  }
});

export default router;