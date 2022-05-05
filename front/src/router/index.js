import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
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
