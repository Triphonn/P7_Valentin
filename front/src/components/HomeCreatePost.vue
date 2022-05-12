<template>
  <v-container class="main-container bg-color width-100">
    <v-card class="main-post-hover bg-color width-100 flex-column border-bottom-gray">
        <v-col class="no-wrap main-card tr-bg-color cursor width-100">
            <div class="flex-column-center">
                <div class="flex-center">
                    <span>Bienvenue, {{name}}</span>
                </div>
                <v-list-item-avatar class="mr-1 mt-2 clear-pa-mg" size="50" @mouseover="PPHover = true" @mouseleave="PPHover = false" @click="goToProfile()">
                    <img
                        :src="avatar"
                        alt="Photo de profil"
                    />
                    <v-overlay absolute :z-index="zIndex" :value="PPHover" >
                    </v-overlay>
                </v-list-item-avatar>
            </div>
            <v-card outlined color="transparent" class="mt-4 width-100">
                <v-card-text>
                    <v-form>
                        <v-textarea
                            class="form-row"
                            id="postTextArea"
                            name="postTextArea"
                            label="Quoi de neuf ?"
                            type="post"
                            v-model="postTextArea"
                            auto-grow
                            dense
                            counter="120"
                            clearable
                            color="third"
                            :rules="[rules.length(120)]"
                        >
                        </v-textarea>
                        <img v-if="previewImage" class="img-file" width="100px" height="100px" :src="previewImage" />
                    </v-form>
                </v-card-text>
                <v-snackbar
                    v-model="snackbarPost"
                    :timeout="1500"
                >
                    {{ postError }}
                </v-snackbar>
            </v-card>
        
        </v-col>
        <div class="width-100">
            <div class="row flex-between px-16 width-100 mb-2">
                <div>
                    <div class="width-50 row icon-basic tr-color icon-bottom-bar cursor flex-center padding-basic">
                        <v-file-input class="text-field-post" hide-input @blur="search = ''" prepend-icon="mdi-image-plus" @change="previewImageContent" accept="image/*" />
                    </div>
                </div>
                <v-card-actions class="form-row clear-pa-mg">
                    <v-spacer></v-spacer>
                    <v-btn color="third" @click="createSinglePost()" class="button button-radius" :disabled="!validatedFields">        
                        <span v-if="status == 'loading'">Publication en cours...</span>
                        <span v-else>Publier</span>
                    </v-btn>
                </v-card-actions>
            </div>
        </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
   name: 'HomeCreatePost',

    data: function () {
      return {
        mode: 'home',
        snackbarPost: false,
        zIndex: 1,
        posts: [],
        imagePost: null,
        previewImage: null,
        postTextArea: '',
        postError: '',
        overlayClosingVerif: false,
        rules: {
            length: len => v => (v || '').length <= len || `Vous avez atteint le maximum de charactères (${len})`,
        },
        overlay: false,
        PPHover: false,
        previewImage: false,
        zIndex: 99999999999999,
        }
    },
    props: {
        name: String,
        username: String,
        avatar: String,
    },
    computed: {
        closeVerification() {
            this.overlayClosingVerif = true;
        },

        validatedFields: function () {
            if (this.postTextArea != "" && this.postTextArea.length >= 5 && this.postTextArea.length <= 120) {
                return true;
            } else {
                return false;
            }
            
        },
         
        ...mapState(['status', 'profileInfos'])
    },
    methods: {
        goToProfile: function () {
            this.$router.push(`/profile/${this.username}`);
            this.$router.go()
        },
        goToPost: function() {
            this.$router.push(`/${this.username}/status/${this.id}`);
            this.$router.go()
        },
        logout: function() {
            this.$store.dispatch('logout')
            this.$router.push('/')
            this.$router.go()
        },
        signup: function () {
            this.$emit('login', 1)
        },
        login: function () {
            this.$emit('login', 0)  
        },
        createpost: function () {
            this.$emit('createpost')
        },
        createSinglePost(){
            const self = this;

            this.$store.dispatch('createPost', {postText: this.postTextArea, postImage: this.imagePost})
            .then(function () {
               if (self.status != 'error_save'){
                  self.$router.go();
               } else {
                  self.snackbarPost = true;
                  self.postError = 'Erreur de publication, veuillez réessayer.';
               }
            })
            .catch((error) => {
              console.log(error);
              this.snackbarPost = true;
              this.postError = 'Erreur de publication, veuillez réessayer.';
            })
        },
        clearPost () {
            this.postTextArea = '', this.imagePost = null, this.previewImage = null
        },
        previewImageContent(e) {
            let urlCreator = window.URL || window.webkitURL;
            this.imagePost = e;
            this.previewImage = urlCreator.createObjectURL(this.imagePost);
        },
      }
   }
</script>

<style scoped>
.ml-small{
  margin-left: 2px;
}
.mg-auto{
  margin: 0 auto;
}
.width-64{
  width: 64px;
}
.comment-looker{
  display: flex;
  align-items: left;
  justify-content: flex-start;
}
.border-bottom-gray{
  border-bottom: 1px solid rgb(47, 51, 54);
  border-radius: 0 !important;
}
.gray-bar{
  width: 2px;
  background-color: rgb(51, 54, 57);
  margin-left: auto;
  margin-right: auto;
  margin-top: 4px;
  height: 100%;
}
.button-radius{
    border-radius: 20px;
}
.img-file{
  background-size: cover;
  border-radius: 15px;
  object-fit: cover;
}
.icon-bottom-bar svg{
  fill: currentcolor;
  width: 1.25em;
  height: 1.25em;
  color: rgb(113, 118, 123);
}
.icon-bottom-bar:hover{
  color: rgb(256,212,212) !important;
}
.icon-bottom-bar:hover svg{
  background-color: rgba(256, 212, 212, 0.1);
  border-radius: 20px;
}
.width-100{
  width: 100%;
}
.width-80{
  width: 80%;
}
.main-post-hover:hover{
  transition-duration: 0.2s;
  background-color: rgba(255, 255, 255, 0.03) !important;
}
.icon-basic:hover{
  color: rgb(256,212,212) !important;
}
.icon-basic:hover{
  background-color: rgba(256, 212, 212, 0.1);
  border-radius: 20px;
}
.mr-5{
  margin-right: 5px;
}
.fs-15{
  font-size: 15px;
  font-weight: 700;
}
.main-container{
  transition-duration: 0.2s;
  width: 32vw;
  border-radius: 0;
}
.container{
    padding: 0;
}
.main-card{
  padding-right: 16px;
  padding-left: 16px;
  margin-bottom: -1px;
}
.gap-5{
  gap: 5px;
}
.subtitle{
  margin-top: 22px !important;
}
.no-wrap{
  flex-wrap: nowrap;
}
.text-content{
  width: 30vw;
  color: inherit;
  font: inherit;
  white-space: inherit;
  font-family: 'Chirp', sans-serif;
}
</style>
