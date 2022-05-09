<template>
    <v-app>
        <div v-if="getUsernameAvatar != null">
            <nav-bar :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
            <v-main>
                <v-overlay :z-index="zIndex" :value="overlayPost">
                    <create-post :mode="mode" @overlayClose="postOverlayHide" />
                </v-overlay>
            </v-main>
        </div>
        <div v-else>
            <nav-bar @login="overlayLogin" />
            <v-overlay :z-index="zIndex" :value="overlayLog">
                <login :mode="mode" />
            </v-overlay>
        </div>
        <v-main v-if="mode == 'not_found'">
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

        <v-main v-else>
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
            <v-card v-else class="mx-auto" max-width="950" tile>
                <v-row style="margin: 0;">
                    <v-img
                        v-if="!userInfos || userInfos.banner == null "
                        class="img-file"
                        height="200"
                        src="https://cdn.discordapp.com/attachments/843841677004374049/970734533924253797/banner-default.jpg"
                    ></v-img>
                    <v-img
                        v-else
                        class="img-file"
                        height="200"
                        :src="userInfos.banner"
                    ></v-img>
                </v-row>
                <v-row style="margin: 0; flex-wrap: nowrap">
                    <v-col>
                        <v-list-item>
                            <v-list-item-avatar size="100">
                                <v-img
                                    class="avatar-22"
                                    :src="userInfos.profilePicture"
                                    alt="Photo de profil"
                                />
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title
                                    class="title"
                                    >{{ userInfos.name }}</v-list-item-title
                                >
                                <v-list-item-subtitle
                                    >@{{ userInfos.username }}</v-list-item-subtitle
                                >
                                <v-list-item-action-text style="margin: 2px 0 10px 0"
                                    >{{ userInfos.bio }}</v-list-item-action-text
                                >
                                <span>
                                    <v-icon>mdi-calendar-month</v-icon>
                                    <v-list-item-action-text style="margin-left: 5px;"
                                        >A rejoint Groupomania en {{ dateProfile }}</v-list-item-action-text
                                    >
                                </span>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-btn v-if="userInfos.userId == user.userId" style="postition: absolute; top: 35px; right: 20px;" color="primary" @click="overlay = !overlay" class="button">      
                      <span>Editer le profil</span>
                    </v-btn>
                    <v-overlay :z-index="zIndex" :value="overlay">
                      <v-card class="elevation-12" width="600px">
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
                                    class="button"
                                    @click="modifyProfile()"
                                >
                                    <span>Enregistrer</span>
                                </v-btn>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <div>
                                        <v-card @mouseover="bannerHover = true" @mouseleave="bannerHover = false">
                                            <img class="img-file" width="100%" height="200px" :src="userBanner" />

                                            <v-overlay absolute :z-index="zIndex" :value="bannerHover" >
                                                <v-file-input hide-input prepend-icon="mdi-camera-outline" @change="onBannerChange" accept="image/*">
                                                </v-file-input>
                                            </v-overlay>
                                        </v-card>
                                    </div>
                                    <v-list-item-avatar size="100" @mouseover="PPHover = true" @mouseleave="PPHover = false">
                                        <img
                                            class="avatar-22"
                                            :src="userAvatar"
                                            alt="Photo de profil"
                                        />
                                        <v-overlay absolute :z-index="zIndex" :value="PPHover" >
                                            <v-file-input hide-input prepend-icon="mdi-camera-outline" @change="onPPChange" accept="image/*">
                                            </v-file-input>
                                        </v-overlay>
                                    </v-list-item-avatar>
                                    <v-text-field
                                        class="form-row"
                                        name="name"
                                        label="Prénom/Nom"
                                        type="text"
                                        placeholder=""
                                        v-model="name"
                                    ></v-text-field>
                                    <v-textarea
                                        class="form-row"
                                        id="bio"
                                        name="bio"
                                        label="Bio"
                                        type="bio"
                                        v-model="bio"
                                        auto-grow
                                    ></v-textarea>
                                    <v-btn color="primary" @click="overlayDelete = true, overlay = false, mode = 'deleteAccount'" class="button" style="color: red;">        
                                        <span>Supprimer définitivement son compte</span>
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-overlay>
                    <v-overlay :z-index="zIndex" :value="overlayDelete">
                      <v-card class="elevation-12" width="600px">
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
                                    <span>Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte. <br> <span>Veuillez taper <b style="color: red">{{ this.userInfos.username }}</b> et confirmer votre <b style="color: red;">mot de passe</b> pour supprimer définitivement votre compte.</span></span>
                                    <v-text-field
                                        class="form-row"
                                        id="deleteConfirm"
                                        name="deleteConfirm"
                                        label="Confirmation"
                                        type="text"
                                        v-model="deleteConfirm"
                                    ></v-text-field>
                                    <v-text-field
                                        class="form-row"
                                        id="password"
                                        name="password"
                                        label="Mot de passe"
                                        type="password"
                                        :error-messages="deleteErrors"
                                        v-model="password"
                                    ></v-text-field>
                                    <v-btn color="primary" @click="deleteAccount" class="button" style="color: red;" :disabled="!validatedFields">        
                                        <span v-if="status == 'loading'">Suppression en cours...</span>
                                        <span v-else>Supprimer définitivement son compte</span>
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-overlay>
                </v-row>
            </v-card>
            <div v-if="posts.length >= 0 && loading == false">
                <posts v-for="post in posts" :key="post._id" :content="post.content" :file="post.file" :name="post.name" :username="post.username" />
            </div>
        </v-main>
    </v-app>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import Posts from '../components/Post.vue';
import CreatePost from '../components/createPost.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    name: 'Profile',

    components: {
        NavBar,
        Posts,
        CreatePost,
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
            previewMode: '',
            overlayLog: false,

            loading: false,
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

            password: '',
            overlayDelete: false,
            deleteErrors: '',
            deleteConfirm: '',

            getUsernameAvatar: this.$store.state.userInfos,

            userInfos: this.$store.state.profileInfos,
            
            defaultBanner: 'https://cdn.discordapp.com/attachments/843841677004374049/970734533924253797/banner-default.jpg',
            profilePicture: 'https://cdn.discordapp.com/attachments/843841677004374049/970734533924253797/banner-default.jpg',
        };
    },
    mounted () {
        if (this.userInfos == null && this.mode != 'not_found') {
            this.getProfile();
            this.mode = 'not_found'
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.$router.push('/')
            }, 2500);
        } else {
            if (this.userInfos.username != this.$route.params.username){
                this.getProfile();
                this.loading = true
            } else {
                this.loading = false
            }
        }
        this.getPostsSingleUser()
        setInterval(() => {
            this.getPostsSingleUser()
        }, 1800000);

    },
    computed: {
        profileInfos() {
            return this.$store.getters.getProfileInfos;
        },
        dateProfile: function () {
            const month = parseInt(this.userInfos.createdAt.substring(5, 7));
            const year = parseInt(this.userInfos.createdAt.substring(0, 4));
            const arr = [{id: 1, val: 'janvier'}, {id: 2, val: 'février'}, {id: 3, val: 'mars'}, {id: 4, val: 'avril'}, {id: 5, val: 'mai'}, {id: 6, val: 'juin'}, {id: 7, val: 'juillet'}, {id: 8, val: 'août'}, {id: 9, val: 'septembre'}, {id: 10, val: 'octobre'}, {id: 11, val: 'novembre'}, {id: 12, val: 'décembre'}]
            const index = arr.find((el) => el.id === month)
            return `${index.val}`+ ` ${year}`;
        },
        userBanner: function () {
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
            } else if (this.mode == 'deleteAccount'){
                if (this.deleteConfirm == this.userInfos.username && this.password != "") {
                    return true
                } else {
                    return false
                }
            }

        },
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user']),
    },
    methods: {
        async getPostsSingleUser(){
            const username = this.$route.params.username;
            const response = await fetch(`http://localhost:3000/api/post/getAllPosts/${username}`)
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
               data[i].createdAt = data[i].createdAt.substring(0, 19).split('T').join(' ');
            }
            this.posts = data;
        },
        deleteAccount(){
            const self = this
            
            let today = new Date();
            let dateToday = today.toISOString().substring(0, 19).split('T').join(' ');

            this.$store.dispatch('deleteAccount', {usernameConfirm: this.deleteConfirm, password: this.password, deleteDate: dateToday})
            .then(function () {
                setTimeout(() => {
                    console.log(self.status);
                    if (self.status != 'error_delete'){
                        self.$router.push('/');
                        self.$store.dispatch('logout')
                    } else {
                        self.deleteErrors = 'Mot de passe incorrect'
                    }
                }, 1500);
                
            })
            .catch((error) => {
              console.log(error);
            })
        },
        createSinglePost(){
            const self = this;

            let today = new Date();
            let dateToday = today.toISOString().substring(0, 19).split('T').join(' ');

            this.$store.dispatch('createPost', {postText: this.postTextArea, postImage: this.imagePost, date: dateToday})
            .then(function () {
               if (self.status != 'error_save'){
                  self.$router.go();
               } else {
                  self.snackbarPost = true;
                  self.postError = 'Erreur de sauvegarde du brouillon';
               }
            })
            .catch((error) => {
              console.log(error);
              this.snackbarPost = true;
              this.postError = 'Erreur de sauvegarde du brouillon';
            })
        },
        draftTab(){
            if (!this.validatedFields) {
               this.overlayPost = false;
               this.clearPost();
               
            } else {
               this.overlayClosingVerif = true
            }
        },
        clearPost () {
            this.postTextArea = '', this.overlayPost = false, this.overlayClosingVerif = false, this.imagePost = null, this.previewImage = null
        },
        saveDrafts() {
            const self = this;
            this.$store.dispatch('saveDrafts', {postText: this.postTextArea, postImage: this.imagePost})
            .then(function () {
               if (self.status != 'error_save'){
                  self.$router.go();
               } else {
                  self.snackbarPost = true;
                  self.postError = 'Erreur de sauvegarde du brouillon';
               }
            })
            .catch((error) => {
              console.log(error);
              self.snackbarPost = true;
              self.postError = 'Erreur de sauvegarde du brouillon';
            })
        },
        postOverlay() {
            this.mode = 'createPost'
            this.overlayPost = true
        },
        postOverlayHide(){
            this.overlayPost = false
         },
        previewImageContent(e) {
            this.mode = 'createPost';
            let urlCreator = window.URL || window.webkitURL;
            this.imagePost = e;
            this.previewImage = urlCreator.createObjectURL(this.imagePost);
        },
        onBannerChange(e) {
            this.mode = 'modifying';
            let urlCreator = window.URL || window.webkitURL;
            this.banner = e;
            this.defaultBanner = urlCreator.createObjectURL(this.banner);
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
                    self.$router.go()
               } else {
                    self.snackbar = true;
                    self.getProfileError = 'Profil inconnu, retour à l\'accueil.';
               }
            })
            .catch((error) => {
              console.log(error);
            })
        },
        overlayLogin (event) {
            if ( event == 1 ) {
               this.mode = 'signup'
               this.overlayLog = true
            } else {
               this.mode = 'login'
               this.overlayLog = true
            }
        },
        ...mapActions(['getOneProfile'])
    },
};
</script>

<style scoped>
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
</style>
