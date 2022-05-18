<template>
   <v-container class="main-container bg-color width-100">
      <v-layout column align-center justify-center>
            <v-flex xs12 sm8 md4>
               <v-card class="bg-color width-100 flex-column border-bottom-gray">
                     <v-btn
                        depressed
                        fab
                        icon
                        color="primary"
                        @click="draftTab"
                        >
                           <v-icon dense color="secondary">
                              mdi-close
                           </v-icon>
                     </v-btn>
                  <v-card-text style="margin-top: -25px;">
                     <v-form>
                        <v-textarea
                           class="form-row mg-15"
                           id="postTextArea"
                           name="postTextArea"
                           label="Quoi de neuf ?"
                           type="post"
                           color="third"
                           v-model="postTextArea"
                           auto-grow
                           dense
                           clearable
                           @click:clear="postTextArea = ''"
                           counter="200"
                           :rules="[rules.length(200)]"
                        >
                        </v-textarea>
                        <div v-if="previewImage" class="flex-row-top width-150-150">
                          <v-img v-if="previewImage" class="img-file" width="150px" height="150px" :src="previewImage" >
                          </v-img>
                          <div class="width-50 icon-basic tr-color cursor padding-basic">
                            <v-icon v-if="previewImage" @click.stop="previewPost = 'deleted', previewImage = null" dense size="24" color="secondary">
                              mdi-close
                            </v-icon>
                          </div>
                        </div>
                        <div v-if="previewVideo" class="flex-row-top">
                          <video v-if="previewVideo" ref="videoRef" :src="previewVideo" class="img-file" id="video-container" width="300px" height="200px" controls>
                          </video>
                          <div class="width-50 icon-basic tr-color cursor padding-basic">
                            <v-icon v-if="previewVideo" @click.stop="previewPost = null, previewVideo = null" dense size="24" color="secondary">
                              mdi-close
                            </v-icon>
                          </div>
                        </div>
                     </v-form>
                  </v-card-text>
                  <v-snackbar
                     v-model="snackbarPost"
                     :timeout="1500"
                  >
                     {{ postError }}
                  </v-snackbar>
                  <div class="width-100">
                     <div class="row flex-between px-16 width-100 mb-2">
                        <div>
                           <div class="width-50 row icon-basic tr-color icon-bottom-bar cursor flex-center padding-basic">
                                 <v-file-input class="text-field-post" hide-input @blur="search = ''" prepend-icon="mdi-image-plus" @change="previewImageContent" accept="image/*, video/*" />
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
            </v-flex>
      </v-layout>
   </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'createPost',
    data () {
      return {
          mode: 'createPost',
          snackbarPost: false,
          zIndex: 1,
          posts: [],
          previewPost: null,
          previewImage: null,
          previewVideo: null,
          postTextArea: '',
          postError: '',
          overlayClosingVerif: false,
          rules: {
             length: len => v => (v || '').length <= len || `Vous avez atteint le maximum de charactères (${len})`,
          }
        };
    },
    computed: {
        validatedFields: function () {
            if (this.postTextArea != "" && this.postTextArea.length >= 5 && this.postTextArea.length <= 200) {
                return true;
            } else {
                return false;
            }
        },
         
        ...mapState(['status', 'profileInfos'])
    },
    methods: {
         createSinglePost(){
            const self = this;

            this.$store.dispatch('createPost', {postText: this.postTextArea, postImage: this.previewPost})
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
         draftTab(){
            this.overlayClose();
            this.clearPost();
         },
         overlayClose: function () {
           this.$emit('overlayClose')
         },
         clearPost () {
            this.postTextArea = '', this.overlayClose(), this.previewPost = null, this.previewImage = null
         },
         previewImageContent(e) {
            let urlCreator = window.URL || window.webkitURL;
            this.previewPost = e;
            console.log(e);
            if(e.type.startsWith("video")){
              this.previewVideo = urlCreator.createObjectURL(this.previewPost);
              this.previewImage = null
            } else {
              this.previewImage = urlCreator.createObjectURL(this.previewPost);
              this.previewVideo = null
            }
        },
    }
  }
</script>

<style scoped>
.overlay-content {
  max-width: 960px;
}
.flex{
  width: 500px;
}
.mg-15{
    margin-right: 15px;
    margin-left: 15px;
}
.border-radius{
  border-radius: 25px;
}
.ml-small{
  margin-left: 2px;
}
.mg-auto{
  margin: 0 auto;
}
.width-64{
  width: 64px;
}
.width-24{
  width: 24px !important;
}
.comment-looker{
  display: flex;
  align-items: left;
  justify-content: flex-start;
}
.border-bottom-gray{
  border-bottom: 1px solid rgb(47, 51, 54);
  border-radius: 15px !important;
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
.mr-5{
  margin-right: 5px;
}
.fs-15{
  font-size: 15px;
  font-weight: 700;
}
.main-container{
  transition-duration: 0.2s;
  border-radius: 15px;
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