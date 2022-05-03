import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000',
});

let user = sessionStorage.getItem('vuex');
if (!user) {
    user = {
        userId: -1,
        token: '',
        isLoggedIn: false,
    };
} else {
    try {
        user = JSON.parse(user.user);
        instance.defaults.headers.common['Authorization'] = user.token;
    } catch (ex) {
        user = {
            userId: -1,
            token: '',
            isLoggedIn: false,
        };
    }
}

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
            paths: ['user', 'profileInfos'],
        }),
    ],
    state: {
        status: '',
        user: user,
        profileInfos: null,
    },
    getters: {
        getProfileInfos(state) {
            return state.profileInfos;
        },
        getUserId(state) {
            return state.user.userId;
        },
        getToken(state) {
            return state.user.token;
        },
    },
    mutations: {
        setStatus: function (state, status) {
            state.status = status;
        },
        logUser: function (state, user) {
            instance.defaults.headers.common['Authorization'] = user.token;
            state.user = user;
            console.log(user);
        },
        profileInfos: function (state, profileInfos) {
            state.profileInfos = profileInfos;
        },
        updateBanner: function (state, banner) {
            state.profileInfos.banner = banner;
        },
        updateAvatar: function (state, profilePicture) {
            state.profileInfos.profilePicture = profilePicture;
        },
        logout: function (state) {
            state.user = {
                userId: -1,
                token: '',
                isLoggedIn: false,
            };
            state.profileInfos = null;
            sessionStorage.removeItem('vuex');
        },
        setIsLoggedIn(state) {
            state.user.isLoggedIn = !state.user.isLoggedIn;
        },
    },
    actions: {
        login: ({ commit }, userInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                instance
                    .post('/auth/login', userInfos)
                    .then(function (response) {
                        commit('logUser', response.data);
                        resolve(response);
                    })
                    .catch(function (error) {
                        commit('setStatus', 'error_login');
                        reject(error);
                    });
            });
        },
        createAccount: ({ commit }, userInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                commit;
                instance
                    .post('/auth/signup', userInfos)
                    .then(function (response) {
                        commit('setStatus', 'created');
                        resolve(response);
                    })
                    .catch(function (error) {
                        commit('setStatus', 'error_create');
                        reject(error);
                    });
            });
        },
        createProfile: ({ commit }, profileInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                commit;
                instance
                    .post('/profile/create', profileInfos, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    .then(function (response) {
                        commit('setStatus', 'profileCreated');
                        console.log(response);
                        commit('profileInfos', response.data.Profile);
                        console.log('Profil crée');
                        resolve(response);
                    })
                    .catch(function (error) {
                        commit('setStatus', 'error_create');
                        reject(error);
                    });
            });
        },
        verifyProfile: ({ commit, getters }) => {
            if (!sessionStorage.getItem('vuex')) {
                console.log('non connecté');
            } else {
                return new Promise((resolve, reject) => {
                    const userId = getters.getUserId;
                    instance
                        .get(`/auth/verifyprofile/${userId}`)
                        .then(function (response) {
                            commit('setStatus', 'profileCreated');
                            commit('profileInfos', response.data[0]);
                            console.log('Profil déjà crée');
                            resolve(response);
                        })
                        .catch(function (error) {
                            commit('setStatus', 'create');
                            reject(error);
                        });
                });
            }
        },
        getOneProfile: async ({ commit }, username) => {
            try {
                await instance
                    .get(`/profile/${username}`)
                    .then(async (response) => {
                        console.log(response);
                        commit('profileInfos', response.data[0]);
                        commit('setStatus', '');
                    })
                    .catch(function (error) {
                        commit('setStatus', 'error_get');
                        console.log(error);
                    });
            } catch (err) {
                commit('setStatus', 'error_get');
                throw 'Unable to get the profile ';
            }
        },
        modifyProfile: async ({ commit, getters, dispatch }, ProfileInfos) => {
            const userId = getters.getUserId;
            console.log(ProfileInfos);

            if (ProfileInfos.banner != null) {
                console.log('1');
                let bannerFormData = new FormData();
                bannerFormData.append('image', ProfileInfos.banner);
                bannerFormData.append('userId', userId);
                dispatch('uploadBanner', bannerFormData);
            }
            if (ProfileInfos.avatar != null) {
                console.log('2');
                let avatarformData = new FormData();
                avatarformData.append('image', ProfileInfos.avatar);
                avatarformData.append('userId', userId);
                dispatch('uploadAvatar', avatarformData);
            }
            if (ProfileInfos.name != '' || ProfileInfos.bio != '') {
                console.log('3');
                try {
                    let userInfos = {
                        userId: userId,
                        name: ProfileInfos.name,
                        bio: ProfileInfos.bio,
                    };
                    await instance
                        .put('/profile/modifyProfile', userInfos)
                        .then(async (response) => {
                            commit('profileInfos', response.data[0]);
                            commit('setStatus', '');
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } catch (err) {
                    commit('setStatus', 'error_modify');
                    throw 'Unable to modify your profile 1 ';
                }
            } else {
                commit('setStatus', 'error_modify');
            }
        },
        uploadAvatar: async ({ commit }, avatarformData) => {
            try {
                await instance
                    .put('/profile/uploadAvatar', avatarformData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    .then(async (response) => {
                        commit('updateAvatar', response.data);
                        commit('setStatus', '');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch (err) {
                commit('setStatus', 'error_modify');
                throw 'Unable to modify your profile 2 ';
            }
        },
        uploadBanner: async ({ commit }, bannerFormData) => {
            try {
                await instance
                    .put('/profile/uploadBanner', bannerFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    .then(async (response) => {
                        commit('updateBanner', response.data);
                        commit('setStatus', '');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch (err) {
                commit('setStatus', 'error_modify');
                throw 'Unable to modify your profile 3 ';
            }
        },
        saveDrafts: async ({ commit, getters }, postData) => {
            commit('setStatus', 'loading.saving');

            const userId = getters.getUserId;

            let postDraftData = {
                userId: userId,
                postText: postData.postText,
            };

            let draftFormData = new FormData();
            draftFormData.append('image', postData.postImage);
            draftFormData.append('content', JSON.stringify(postDraftData));

            console.log(postData.postImage);
            console.log(postDraftData);

            if (postData.postImage == null) {
                try {
                    await instance
                        .post('/post/savedraft', postDraftData, {
                            headers: {
                                Authorization: 'Bearer ' + getters.getToken,
                            },
                        })
                        .then(async () => {
                            commit('setStatus', '');
                        })
                        .catch(function (error) {
                            commit('setStatus', 'error_save');
                            console.log(error);
                        });
                } catch (err) {
                    commit('setStatus', 'error_save');
                    throw 'Unable to save your draft ';
                }
            } else {
                try {
                    await instance
                        .post('/post/savedraft', draftFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: 'Bearer ' + getters.getToken,
                            },
                        })
                        .then(async () => {
                            commit('setStatus', '');
                        })
                        .catch(function (error) {
                            commit('setStatus', 'error_save');
                            console.log(error);
                        });
                } catch (err) {
                    commit('setStatus', 'error_save');
                    throw 'Unable to save your draft ';
                }
            }
        },
        logout: ({ commit }) => {
            commit('setStatus', '');
            commit('logout');
        },
    },
});
