<template>
    <v-app>
        <nav-bar :username="userInfos.username" :profilePicture="userInfos.profilePicture"/>
        <v-main>
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
                        v-if="userInfos.banner == null"
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
                                <img
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
                                <v-list-item-action-text
                                    >{{ userInfos.bio }}</v-list-item-action-text
                                >
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
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-overlay>
                </v-row>
            </v-card>
        </v-main>
    </v-app>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    name: 'Profile',

    components: {
        NavBar,
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
            zIndex: 0,
            mode: 'home',
            loading: false,
            userInfos: this.$store.state.profileInfos,
            
            defaultBanner:
                this.$store.state.profileInfos.banner ||
                'https://cdn.discordapp.com/attachments/843841677004374049/970734533924253797/banner-default.jpg',
            profilePicture:
                this.$store.state.profileInfos.profilePicture,
        };
    },
    props: {
        source: String,
    },
    mounted () {
        if (this.userInfos.username != this.$route.params.username){
            this.getProfile();
            this.loading = true
            console.log(this.loading);
            setTimeout(() => {
                this.$router.go()
            }, 50);
        } else {
            this.loading = false
        }
    },
    computed: {
        profileInfos() {
            return this.$store.getters.getProfileInfos;
        },
        userBanner: function () {
            if (this.$store.state.profileInfos.banner != null && this.mode != 'modifying') {
                return this.$store.state.profileInfos.banner;
            } else {
                return this.defaultBanner;
            }
        },
        userAvatar: function() {
            if (this.$store.state.profileInfos.banner != null && this.mode != 'modifying') {
                return this.$store.state.profileInfos.profilePicture;
            } else {
                return this.profilePicture;
            }
        },
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user', 'profileInfos']),
    },
    methods: {
        onBannerChange(e) {
            this.mode = 'modifying';
            let urlCreator = window.URL || window.webkitURL;
            this.banner = e;
            this.defaultBanner = urlCreator.createObjectURL(this.banner);
        },
        onPPChange(e) {
            this.mode = 'modifying';
            let urlCreator = window.URL || window.webkitURL;
            this.avatar = e;
            this.profilePicture = urlCreator.createObjectURL(this.avatar);
        },
        modifyProfile: function () {
            const self = this;
            this.$store.dispatch('modifyProfile', {banner: this.banner, avatar: this.avatar, name: this.name, bio: this.bio})
            .then(function () {
               self.$router.go()
            }, function (error) {
            console.log(error);
            })
        },
        getProfile: function () {
            const username = this.$route.params.username;
            this.getOneProfile(username);
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
