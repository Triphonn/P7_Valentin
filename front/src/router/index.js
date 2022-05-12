import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import CreateProfile from '../views/createProfile.vue';
import Profile from '../views/Profile.vue';
import Login from '../components/Login.vue';
import Posts from '../components/Post.vue';
import SinglePost from '../views/SinglePost.vue';

Vue.use(VueRouter);

const routes = [
    {
        name: 'Home',
        path: '/home',
        component: Home,
    },
    {
        name: 'Posts',
        path: '/post',
        component: Posts,
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
        name: 'SinglePost',
        path: '/:username/:id',
        component: SinglePost,
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
