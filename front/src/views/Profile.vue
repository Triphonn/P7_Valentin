<template>
    <v-app>
        <div v-if="getUsernameAvatar != null">
            <div class="flex-center d-md-none">
                <a href="/">
                    <v-img
                    alt="Groupomania Logo"
                    class="shrink mr-2"
                    contain
                    src="../assets/icon-left-font-monochrome-white.png"
                    transition="scale-transition"
                    width="200"
                    />
                </a>
            </div>
            <div class="mt-7 d-md-none" v-if="searchBarOverlay">
                <v-autocomplete
                    v-model="searchBar"
                    :items="allProfiles"
                    no-data-text="Aucun profil correspondant."
                    clearable
                    hide-details
                    item-value="username"
                    item-text="username"
                    label="Qui recherchez-vous ?"
                    append-icon=""
                    dense
                    flat
                    outlined
                    color="secondary"
                    class="search-bar"
                    return-object
                >
                    <template v-slot:item="{ item }">
                        <v-list-item-avatar class="mr-3 clear-pa-mg" size="30" @click="redirectToProfile(item)">
                                <img
                                :src="item.profilePicture"
                                alt="Photo de profil"
                                class="border-radius"
                                />
                        </v-list-item-avatar>
                        <div class="get-profile-force flex-left-center" @click="redirectToProfile(item)"
                        ><span class="name-text">{{ item.name }}</span>
                            <span class="username-text ml-3">@{{ item.username }}</span>
                        </div>
                    </template>
                </v-autocomplete>
            </div>
            <nav-bar-mobile class="d-md-none" :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @searchBarOn="searchBarOverlay = !searchBarOverlay" />
            <nav-bar class="d-none d-md-block" :home="1" :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
            <v-main>
                <v-overlay :z-index="zIndex" :value="overlayPost">
                    <create-post :mode="mode" @overlayClose="postOverlayHide" />
                </v-overlay>
            </v-main>
        </div>
        <div v-else>
            <div class="flex-center d-md-none">
                <a href="/">
                    <v-img
                        alt="Groupomania Logo"
                        class="shrink mr-2"
                        contain
                        src="../assets/icon-left-font-monochrome-white.png"
                        transition="scale-transition"
                        width="200"
                    />
                </a>
            </div>
            <div class="mt-7 d-md-none" v-if="searchBarOverlay">
                <v-autocomplete
                    v-model="searchBar"
                    :items="allProfiles"
                    no-data-text="Aucun profil correspondant."
                    clearable
                    hide-details
                    item-value="username"
                    item-text="username"
                    label="Qui recherchez-vous ?"
                    append-icon=""
                    dense
                    flat
                    outlined
                    color="secondary"
                    class="search-bar"
                    return-object
                >
                    <template v-slot:item="{ item }">
                        <v-list-item-avatar class="mr-3 clear-pa-mg" size="30" @click="redirectToProfile(item)">
                                <img
                                :src="item.profilePicture"
                                alt="Photo de profil"
                                class="border-radius"
                                />
                        </v-list-item-avatar>
                        <div class="get-profile-force flex-left-center" @click="redirectToProfile(item)"
                        ><span class="name-text">{{ item.name }}</span>
                            <span class="username-text ml-3">@{{ item.username }}</span>
                        </div>
                    </template>
                </v-autocomplete>
            </div>

            <nav-bar-mobile class="d-md-none" @searchBarOn="searchBarOverlay = !searchBarOverlay" @login="overlayLogin" />
            <nav-bar class="d-none d-md-block" :home="1" @login="overlayLogin" />

            <v-overlay :z-index="zIndex" :value="overlayLog">
                <login :mode="loginmode" @login="overlayLogin" />
            </v-overlay>
        </div>
        <v-main v-if="mode == 'not_found'" class="test">
            <v-snackbar
                    v-model="snackbar"
                    :timeout="2500"
                >
                    {{ getProfileError }}
                </v-snackbar>
            <v-col
                cols="12"
                md="4"
                v-if="loading"
                style="margin: 0 auto; max-width: 950px"
            >
                <v-skeleton-loader
                type="image, table-heading, list-item-two-line"
                ></v-skeleton-loader>
            </v-col>
        </v-main>

        <v-main v-else class="test">
            <v-col
                cols="12"
                md="4"
                v-if="loading"
                style="margin: 0 auto; max-width: 950px"
            >
                <v-skeleton-loader
                type="image, table-heading, list-item-two-line"
                ></v-skeleton-loader>
            </v-col>
            <v-card v-else style="border-radius: 25px !important;" class="mx-auto test border-radius-25" max-width="950" tile>
                <v-row style="margin: 0;" class="width-100">
                    <v-img
                        v-if="!userInfos || userInfos.banner == null "
                        class="img-file resp-banner"
                        height="200"
                        src="https://cdn.discordapp.com/attachments/843841677004374049/970734533924253797/banner-default.jpg"
                    ></v-img>
                    <v-img
                        v-else
                        class="img-file resp-banner"
                        height="200"
                        :src="bannerData"
                    ></v-img>
                </v-row>
                <v-row class="bg-color border-basic border-bottom-gray-profile width-100" style="margin: 0; flex-wrap: nowrap">
                    <v-col>
                        <v-list-item class="resp-list-item">
                            <v-list-item-avatar class="resp-list-avatar" size="100">
                                <v-img
                                    class="avatar-22"
                                    :src="avatarData"
                                    alt="Photo de profil"
                                />
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title
                                    class="title"
                                    >{{ nameData }}</v-list-item-title
                                >
                                <v-list-item-subtitle
                                    >@{{ userInfos.username }}</v-list-item-subtitle
                                >
                                <div class="d-none d-md-flex flex-column-start">
                                    <v-list-item-action-text style="margin: 2px 0 10px 0"
                                        >{{ bioData }}
                                    </v-list-item-action-text>
                                    <span>
                                        <v-icon class="resp-icon">mdi-calendar-month</v-icon>
                                        <v-list-item-action-text class="resp-join-date" style="margin-left: 5px;"
                                            >A rejoint Groupomania en {{ dateProfile }}
                                            </v-list-item-action-text>
                                    </span>
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item class="d-md-none mg-pa-gap-0 ml-5">
                            <v-list-item-action-text class="text-preline"
                                >{{ userInfos.bio }}</v-list-item-action-text
                            >
                            <span>
                                <v-icon class="resp-icon">mdi-calendar-month</v-icon>
                                <v-list-item-action-text class="resp-join-date" style="margin-left: 5px;"
                                    >A rejoint Groupomania en {{ dateProfile }}</v-list-item-action-text
                                >
                            </span>
                        </v-list-item>
                        <v-btn v-if="userInfos.userId == user.userId" color="primary" @click="overlay = !overlay, editModeTrue" class="button button-radius d-md-none">      
                            <span>Editer le profil</span>
                        </v-btn>
                        <v-btn v-if="userInfos.userId != user.userId && isAdmin" color="primary" @click="overlayDelete = true, overlay = false, mode = 'deleteAccount'" class="button button-radius d-md-none" style="color: red;">      
                            <span>Supprimer le compte</span>
                        </v-btn>
                    </v-col>
                    <v-btn v-if="userInfos.userId != user.userId && isAdmin" color="red" @click="overlayDelete = true, overlay = false, mode = 'deleteAccount'" style="postition: absolute; top: 35px; right: 20px;" class="button button-radius d-none d-md-block">      
                      <span>Supprimer le compte</span>
                    </v-btn>
                    <v-btn v-if="userInfos.userId == user.userId" style="postition: absolute; top: 35px; right: 20px;" color="primary" @click="overlay = !overlay, editModeTrue" class="button button-radius d-none d-md-block">      
                      <span>Editer le profil</span>
                    </v-btn>
                    <v-overlay :z-index="zIndex" :value="overlay">
                        <div class="test-resp">
                            <v-card class="border-radius-15 edit-card test-resp">
                                    <v-toolbar dark color="primary">
                                        <v-app-bar-nav-icon>
                                            <v-btn
                                            depressed
                                            fab
                                            icon
                                            color="primary"
                                            @click="overlay = false"
                                            >
                                                <v-icon dense color="secondary">
                                                mdi-close
                                                </v-icon>
                                            </v-btn>
                                        </v-app-bar-nav-icon>
                                        <v-toolbar-title>Éditer le profil</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            depressed
                                            color="primary"
                                            class="button button-radius"
                                            @click="modifyProfile()"
                                            :disabled="!validatedFields"
                                        >
                                            <span>Enregistrer</span>
                                        </v-btn>
                                    </v-toolbar>
                                    <v-card-text>
                                        <v-form>
                                            <div>
                                                <v-card height="200px" @mouseover="bannerHover = true" @mouseleave="bannerHover = false">
                                                    <img class="width-100 img-file clear-pa-mg" height="200px" :src="userBanner" />

                                                    <v-overlay class="clear-pa-mg" absolute :z-index="zIndex" :value="bannerHover" >
                                                        <v-file-input hide-input prepend-icon="mdi-camera-outline" @change="onBannerChange" accept="image/*">
                                                        </v-file-input>
                                                    </v-overlay>
                                                </v-card>
                                            </div>
                                            <v-list-item-avatar size="100" @mouseover="PPHover = true" @mouseleave="PPHover = false">
                                                <img
                                                    class="avatar-22 ml-5"
                                                    :src="userAvatar"
                                                    alt="Photo de profil"
                                                />
                                                <v-overlay absolute :z-index="zIndex" :value="PPHover" >
                                                    <v-file-input hide-input prepend-icon="mdi-camera-outline" @change="onPPChange" accept="image/*">
                                                    </v-file-input>
                                                </v-overlay>
                                            </v-list-item-avatar>
                                            <v-text-field
                                                color="secondary"
                                                class="form-row mg-15"
                                                name="name"
                                                label="Prénom/Nom"
                                                type="text"
                                                placeholder=""
                                                counter="20"
                                                :rules="[rules.length(20)]"
                                                v-model="name"
                                            ></v-text-field>
                                            <v-textarea
                                                color="secondary"
                                                class="form-row mg-15"
                                                id="bio"
                                                name="bio"
                                                label="Bio"
                                                type="bio"
                                                counter="100"
                                                :rules="[rules.length(100)]"
                                                v-model="bio"
                                                auto-grow
                                            ></v-textarea>
                                            <div class="padding-bottom mg-auto flex-center">
                                                <v-btn color="primary" @click="overlayDelete = true, overlay = false, mode = 'deleteAccount'" class="button button-radius mt-2" style="color: red;">        
                                                    <span>Supprimer définitivement son compte</span>
                                                </v-btn>
                                            </div>
                                        </v-form>
                                    </v-card-text>
                                </v-card>
                            </div>
                        </v-overlay>
                        <v-overlay :z-index="zIndex" :value="overlayDelete">
                        <v-card class="elevation-12 test-resp" width="600px">
                                <v-toolbar dark color="primary">
                                    <v-app-bar-nav-icon>
                                        <v-btn
                                        depressed
                                        fab
                                        icon
                                        color="primary"
                                        @click="overlayDelete = false"
                                        >
                                            <v-icon dense color="secondary">
                                            mdi-close
                                            </v-icon>
                                        </v-btn>
                                    </v-app-bar-nav-icon>
                                    <v-toolbar-title>Suppression du compte</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form>
                                        <div class="px-4 pt-2">
                                            <span>Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte. <br> <span>Veuillez taper <b style="color: red">{{ this.userInfos.username }}</b> et confirmer votre <b style="color: red;">mot de passe</b> pour supprimer définitivement votre compte.</span></span>
                                        </div>
                                        <v-text-field
                                            color="secondary"
                                            class="form-row mg-15"
                                            id="deleteConfirm"
                                            name="deleteConfirm"
                                            label="Confirmation"
                                            type="text"
                                            v-model="deleteConfirm"
                                        ></v-text-field>
                                        <v-text-field
                                            color="secondary"
                                            class="form-row mg-15"
                                            id="password"
                                            name="password"
                                            label="Mot de passe"
                                            type="password"
                                            :error-messages="deleteErrors"
                                            v-model="password"
                                        ></v-text-field>
                                        <div class="padding-bottom mg-auto flex-center">
                                            <v-btn color="red" @click="deleteAccount" class="button button-radius" :disabled="!validatedFields">
                                                <span v-if="status == 'loading'">Suppression en cours...</span>
                                                <span v-else>Supprimer définitivement son compte</span>
                                            </v-btn>
                                        </div>
                                    </v-form>
                                </v-card-text>
                            </v-card>
                        </v-overlay>
                    </v-row>
                </v-card>
                <div v-if="loaded">
                    <div class="flex-center flex-column mg-pa-gap-0 pt-5 resp-post-profile" v-if="posts.length > 0">
                        <div v-if="mode != 'loading'" class="resp-div-post flex-center flex-column mg-pa-gap-0">
                            <posts class="mg-pa-gap-0 border-radius-15" v-for="post in posts" :key="post.id" :userLiked="userLiked" :likes="post.likes" :date="post.createdAt" :avatar="post.avatar" :content="post.content" :image="post.image" :video="post.video" :name="post.name" :username="post.username" :id="post.id" :comments="post.comments" @overlayCom="goForPost" />
                        </div>
                    </div>
                    <div v-else class="flex-center">
                        <span>
                                Cette personne n'a pas encore posté de publications.
                        </span>
                    </div>
                </div>
        </v-main>
    </v-app>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import Posts from '../components/Post.vue';
import Login from '../components/Login.vue'
import CreatePost from '../components/createPost.vue';
import NavBarMobile from '../components/NavBarMobile.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
    name: 'Profile',

    components: {
        NavBar,
        Posts,
        CreatePost,
        NavBarMobile,
        Login
    },
    data () {
        return {       
            name: "",
            bio: "",
            banner: null,
            avatar: null,
            bannerHover: false,
            PPHover: false,
            overlay: false,
            zIndex: 1,
            mode: 'home',
            loginmode: "signup",
            previewMode: '',
            overlayLog: false,

            searchBarOverlay: false,
            allProfiles: null,
            searchBar: null,

            loaded: false,
            loading: true,
            getProfileError: '',
            snackbar: false,
            imagePost: null,
            previewImage: null,
            postTextArea: '',
            postError: '',
            overlayClosingVerif: false,
            overlayPost: false,
            snackbarPost: false,
            rules: {
                length: len => v => (v || '').length <= len || `Vous avez atteint le maximum de charactères (${len})`,
            },
            posts: [],
            comments: [],

            password: '',
            overlayDelete: false,
            deleteErrors: '',
            deleteConfirm: '',
            overlayComments: false,

            nameData: null,
            bioData: null,
            bannerData: null,
            avatarData: null,
            editMode: false,

            userLiked: null,

            getUsernameAvatar: this.$store.state.userInfos,

            userInfos: this.$store.state.profileInfos,
            
            defaultBanner: 'https://cdn.discordapp.com/attachments/843841677004374049/970734533924253797/banner-default.jpg',
            profilePicture: null,
        };
    },
    created(){
        this.getAllLikes()
    },
    mounted () {
        this.loading = true
        this.getProfile();

        this.getAllProfile()
        this.getPostsSingleUser()
        setInterval(() => {
            this.getAllProfile()
            this.getPostsSingleUser()
        }, 1800000);
    },
    computed: {
        getFilteredProfiles(item, queryText, itemText){
            return itemText.toLocaleLowerCase().startsWith(queryText.toLocaleLowerCase())
        },
        profileInfos() {
            return this.$store.getters.getProfileInfos;
        },
        dateProfile: function () {
            /////// replace the month signup date into month (ex: 01 -> janvier)
            const month = parseInt(this.userInfos.createdAt.substring(5, 7));
            const year = parseInt(this.userInfos.createdAt.substring(0, 4));
            const arr = [{id: 1, val: 'janvier'}, {id: 2, val: 'février'}, {id: 3, val: 'mars'}, {id: 4, val: 'avril'}, {id: 5, val: 'mai'}, {id: 6, val: 'juin'}, {id: 7, val: 'juillet'}, {id: 8, val: 'août'}, {id: 9, val: 'septembre'}, {id: 10, val: 'octobre'}, {id: 11, val: 'novembre'}, {id: 12, val: 'décembre'}]
            const index = arr.find((el) => el.id === month)
            return `${index.val}`+ ` ${year}`;
        },
        userBanner () {
            if (this.$store.state.profileInfos.banner != null && this.mode != 'modifying') {
                return this.$store.state.profileInfos.banner;
            } else {
                return this.defaultBanner;
            }
        },
        userAvatar: function() {
            if (this.$store.state.profileInfos.profilePicture != null && this.previewMode != 'avatar') {
                return this.$store.state.profileInfos.profilePicture;
            } else {
                return this.profilePicture
            }
        },
        editModeTrue(){
            this.editMode = true
            this.name = this.userInfos.name
            this.bio = this.userInfos.bio
        },
        closeVerification() {
            this.overlayClosingVerif = true;
        },
        validatedFields: function () {
            if (this.mode == 'createPost'){
               if (this.postTextArea != "" && this.postTextArea.length >= 5 && this.postTextArea.length <= 120) {
                  return true;
               } else {
                  return false;
               }
            } else if (this.editMode){
                if ((this.bio.length <= 100 && this.name.length <= 20) && (this.nameData != this.name || this.bioData != this.bio)){
                    return true
                } else {
                    return false
                }
            } else {
                if (this.deleteConfirm == this.userInfos.username && this.password != "") {
                    return true
                } else {
                    return false
                }
            }

        },
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user', 'isMobile', 'isAdmin']),
    },
    methods: {
        async getAllLikes(){
            const response = await fetch('http://localhost:3000/api/post/getAllLikes')
            const data = await response.json();
            let username = ''
            let array = ''
            if (this.$store.state.user.isLoggedIn){
               username = this.$store.state.userInfos.username
               array = data.filter(e => e.username == username)
            } else {
               username = ''
            }
            this.userLiked = array;
        },
        async getAllProfile() {
            const response = await fetch ('http://localhost:3000/api/profile/getAllProfiles')
            const data = await response.json();
            this.allProfiles = data
        },
        redirectToProfile(profile){
            this.$router.push(`/profile/${profile.username}`);
            this.$router.go()
        },
        async getPostsSingleUser(){
            this.mode = 'loading'
            const username = this.$route.params.username;
            const response = await fetch(`http://localhost:3000/api/post/getAllPosts`)
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
               // data[i].createdAt = data[i].createdAt.substring(0, 19).split('T').join(' ');
               const date1 = new Date();
               const date2 = new Date(data[i].createdAt);

               const diffTime = Math.abs(date2 - date1);
               const diffSeconds = Math.ceil(diffTime / (1000));
               const diffMins = Math.ceil(diffTime / (1000 * 60));
               const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
               const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
               
               if (diffSeconds <= 60 ){
                  data[i].createdAt = (diffSeconds - 1) + "sec"
               } else if (diffSeconds >= 60 && diffMins <= 60){
                  data[i].createdAt = (diffMins - 1) + "min"
               } else if (diffMins >= 60 && diffHours <= 24) {
                  data[i].createdAt = (diffHours - 1) + "h"
               } else {
                  data[i].createdAt = (diffDays - 1) + 'j'
               }
            }
            const dataFilter = data.filter(el => el.username == username)
            this.posts = dataFilter;
            setTimeout(() => {
                this.mode = ''
            }, 250);
        },
        deleteAccount(){
            const self = this
            
            let today = new Date();
            let dateToday = today.toISOString().substring(0, 19).split('T').join(' ');

            this.$store.dispatch('deleteAccount', {usernameConfirm: this.deleteConfirm, password: this.password, deleteDate: dateToday})
            .then(function () {
                setTimeout(() => {
                    if (self.status != 'error_delete' && self.$store.state.isAdmin != 1){
                        self.$router.push('/');
                        self.$store.dispatch('logout')
                    } else if (self.status != 'error_delete' && self.$store.state.isAdmin === 1){
                        self.$router.push('/');
                    } else {
                        self.deleteErrors = 'Erreur de suppression de compte, veuillez réessayer !'
                    }
                }, 1500);
                
            })
            .catch((error) => {
              console.log(error);
            })
        },
        postOverlay() {
            this.mode = 'createPost'
            this.overlayPost = true
        },
        postOverlayHide(){
            this.overlayPost = false
        },
        onBannerChange(e) {
            let urlCreator = window.URL || window.webkitURL;
            this.banner = e;
            this.defaultBanner = urlCreator.createObjectURL(this.banner);
            this.mode = 'modifying';
        },
        onPPChange(e) {
            this.previewMode = 'avatar';
            let urlCreator = window.URL || window.webkitURL;
            this.avatar = e;
            this.profilePicture = urlCreator.createObjectURL(this.avatar);
        },
        modifyProfile: function () {
            const self = this;
            this.$store.dispatch('modifyProfile', {banner: this.banner, avatar: this.avatar, name: this.name, bio: this.bio})
            .then(function () {
                self.overlay = false
                if (self.banner){
                    self.bannerData = self.defaultBanner
                } 
                if (self.avatar){
                    self.avatarData = self.profilePicture
                }
                self.nameData = self.name
                self.bioData = self.bio
            })
            .catch((error) => {
              console.log(error);
            })
        },
        getProfile () {
            const self = this;
            const username = this.$route.params.username;
            this.getOneProfile(username)
            .then(function () {
               if (self.status != 'error_get'){
                    if (self.$route.params.username != self.userInfos.username){
                        setTimeout(() => {
                            self.$router.go()
                        }, 200);
                    } else {
                        self.nameData = self.userInfos.name
                        self.bioData = self.userInfos.bio
                        self.bannerData = self.userInfos.banner
                        self.avatarData = self.userInfos.profilePicture
                        self.loading = false
                        setTimeout(() => {
                            self.loaded = true
                        }, 150);
                    }
               } else if (self.status == 'error_get'){
                    self.mode = 'not_found';
                    self.snackbar = true;
                    self.getProfileError = 'Profil inconnu, retour à l\'accueil.';
                    setTimeout(() => {
                        self.loading = false
                        self.$router.push('/')
                    }, 2500);
               }
            })
            .catch((error) => {
              console.log(error);
            })
        },
        commentsOverlay(event){
            this.overlayComments = true
            this.singlePost = this.posts.find(element => element.id == event);
        },
        overlayLogin (event) {
            if ( event == 1 ) {
               this.loginmode = 'signup'
               this.overlayLog = true
            } else {
               this.loginmode = 'login'
               this.overlayLog = true
            }
        },
        goForPost(event){
            const singlePost = this.posts.find(element => element.id == event);
            this.$router.push(`/${singlePost.username}/${singlePost.id}`);
        },
        ...mapActions(['getOneProfile']),
        ...mapMutations(['setStatus', 'setMobileMode'])
    },
};
</script>

<style scoped>
.button-radius{
    border-radius: 20px !important;
}
.border-radius{
    border-radius: 20px !important;
}
.v-application .primary--text{
  color: var(--v-third-base) !important;
}
.row{
    width: 950px;
}
.avatar-22 {
    border: 3px solid black;
}
.button {
  border-radius: 8px;
  border: none;
  padding: 16px;
  transition: .4s background-color;
}
.v-main{
   padding: 17px 0 0 0 !important;
   width: 950px;
}
.container{
    padding: 0 !important;
}
.mg-15{
    margin-right: 15px;
    margin-left: 15px;
}
.overlay-content {
  max-width: 960px;
}
.mg-pa-gap-0{
   margin: 0;
   padding: 0;
   gap: 15px;
}
@media screen and (max-width: 960px) {
    .resp-post-profile{
        padding-bottom: 35px !important;
    }
}
</style>
