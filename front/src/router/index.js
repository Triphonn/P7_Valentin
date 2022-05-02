import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import CreateProfile from '../views/createProfile.vue';
import Profile from '../views/Profile.vue';

Vue.use(VueRouter);

const routes = [
    {
        name: 'Home',
        path: '/home',
        component: Home,
    },
    {
        name: 'Login',
        path: '/login',
        component: Login,
    },
    {
        name: 'CreateProfile',
        path: '/createProfile/:id',
        component: CreateProfile,
    },
    {
        name: 'Profile',
        path: '/profile/:username',
        component: Profile,
    },
    {
        name: 'NotFound',
        path: '/:catchAll(.*)',
        redirect: '/home',
    },
];

const router = new VueRouter({
    routes,
});

export default router;
