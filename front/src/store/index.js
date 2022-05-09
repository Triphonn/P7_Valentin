import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
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
            paths: ['user', 'profileInfos', 'userInfos'],
        }),
    ],
    state: {
        status: '',
        user: user,
        profileInfos: null,
        userInfos: null,
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
        },
        profileInfos: function (state, profileInfos) {
            state.profileInfos = profileInfos;
        },
        setUserInfos: function (state, userInfos) {
            state.userInfos = userInfos;
        },
        updateBanner: function (state, banner) {
            state.profileInfos.banner = banner;
            state.userInfos.banner = banner;
        },
        updateAvatar: function (state, profilePicture) {
            state.profileInfos.profilePicture = profilePicture;
            state.userInfos.profilePicture = profilePicture;
        },
        logout: function (state) {
            state.user = {
                userId: -1,
                token: '',
                isLoggedIn: false,
            };
            state.profileInfos = null;
            state.userInfos = null;
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
        createProfile: ({ commit, getters }, profileInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                commit;
                instance
                    .post('/profile/create', profileInfos, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: 'Bearer ' + getters.getToken,
                        },
                    })
                    .then(function (response) {
                        commit('setStatus', 'profileCreated');
                        commit('profileInfos', response.data.Profile);
                        commit('setUserInfos', response.data.Profile);
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
                        .get(`/profile/verifyprofile/${userId}`, {
                            headers: {
                                Authorization: 'Bearer ' + getters.getToken,
                            },
                        })
                        .then(function (response) {
                            console.log(response);
                            commit('setStatus', 'profileCreated');
                            commit('profileInfos', response.data);
                            commit('setUserInfos', response.data);
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
                        if (response.data == null) {
                            console.log('test data null');
                            commit('profileInfos', response.data);
                            commit('setStatus', 'error_get');
                        } else {
                            commit('profileInfos', response.data);
                            commit('setStatus', '');
                        }
                    })
                    .catch(function (error) {
                        commit('profileInfos', null);
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

            if (ProfileInfos.banner != null) {
                let bannerFormData = new FormData();
                bannerFormData.append('image', ProfileInfos.banner);
                bannerFormData.append('userId', userId);
                dispatch('uploadBanner', bannerFormData);
            }
            if (ProfileInfos.avatar != null) {
                let avatarformData = new FormData();
                avatarformData.append('image', ProfileInfos.avatar);
                avatarformData.append('userId', userId);
                dispatch('uploadAvatar', avatarformData);
            }
            if (ProfileInfos.name != '' || ProfileInfos.bio != '') {
                try {
                    let userInfos = {
                        userId: userId,
                        name: ProfileInfos.name,
                        bio: ProfileInfos.bio,
                    };
                    await instance
                        .put('/profile/modifyProfile', userInfos, {
                            headers: {
                                Authorization: 'Bearer ' + getters.getToken,
                            },
                        })
                        .then(async (response) => {
                            commit('profileInfos', response.data);
                            commit('setUserInfos', response.data);
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
        uploadAvatar: async ({ commit, getters }, avatarformData) => {
            try {
                await instance
                    .put('/profile/uploadAvatar', avatarformData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: 'Bearer ' + getters.getToken,
                        },
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
        uploadBanner: async ({ commit, getters }, bannerFormData) => {
            try {
                await instance
                    .put('/profile/uploadBanner', bannerFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: 'Bearer ' + getters.getToken,
                        },
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
        createPost: async ({ commit, getters }, postData) => {
            commit('setStatus', 'loading.saving');

            const userId = getters.getUserId;

            let postDraftData = {
                userId: userId,
                postText: postData.postText,
                date: postData.date,
            };

            let draftFormData = new FormData();
            draftFormData.append('image', postData.postImage);
            draftFormData.append('content', JSON.stringify(postDraftData));

            if (postData.postImage == null) {
                try {
                    await instance
                        .post('/post/create', postDraftData, {
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
                        .post('/post/create', draftFormData, {
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
        deleteAccount: async ({ commit, getters }, deleteConfirm) => {
            commit('setStatus', 'loading');

            const userId = getters.getUserId;

            let deleteData = {
                userId: userId,
                username: deleteConfirm.usernameConfirm,
                password: deleteConfirm.password,
                date: deleteConfirm.deleteDate,
            };
            try {
                await instance
                    .post('/profile/delete', deleteData, {
                        headers: {
                            Authorization: 'Bearer ' + getters.getToken,
                        },
                    })
                    .then(async () => {
                        setTimeout(() => {
                            commit('setStatus', '');
                        }, 1750);
                    })
                    .catch(function (error) {
                        setTimeout(() => {
                            commit('setStatus', 'error_delete');
                        }, 1500);
                        console.log(error);
                    });
            } catch (err) {
                commit('setStatus', 'error_delete');
                throw 'Unable to delete your account ';
            }
        },
        logout: ({ commit }) => {
            commit('setStatus', '');
            commit('logout');
        },
    },
});
