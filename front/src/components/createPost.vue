<template>
        <v-container ma-0 pa-0 fluid fill-height>
            <v-layout column align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12">
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
                           <v-overlay :z-index="zIndex" :value="overlayClosingVerif">
                              <v-card
                                 elevation="2"
                              >
                              <v-card-title>Enregistrer la publication ?</v-card-title>

                              <v-card-text>Vous pouvez enregistrer ceci pour l'envoyer plus tard depuis vos brouillons. </v-card-text>

                              <v-card-actions>
                                 <v-btn
                                    text
                                    class="button"
                                    @click="saveDrafts"
                                 >
                                 Enregistrer
                                 </v-btn>
                              </v-card-actions>
                              <v-card-actions>
                                 <v-btn
                                    text
                                    class="button"
                                    @click="clearPost"
                                 >
                                 Supprimer
                                 </v-btn>
                              </v-card-actions>
                              </v-card>
                           </v-overlay>
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
                                 counter="120"
                                 :rules="[rules.length(120)]"
                              >
                              </v-textarea>
                              <img v-if="previewImage" class="img-file" width="100%" height="200px" :src="previewImage" />
                           </v-form>
                        </v-card-text>
                        <v-snackbar
                           v-model="snackbarPost"
                           :timeout="1500"
                        >
                           {{ postError }}
                        </v-snackbar>
                        <v-card-actions class="form-row">
                           <v-file-input hide-input prepend-icon="mdi-image-outline" @change="previewImageContent" accept="image/*" />       
                           <v-spacer></v-spacer>
                           <v-btn color="primary" @click="createSinglePost()" class="button" :disabled="!validatedFields">        
                              <span v-if="status == 'loading'">Publication en cours...</span>
                              <span v-else>Publier</span>
                           </v-btn>
                        </v-card-actions>
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
          imagePost: null,
          previewImage: null,
          postTextArea: '',
          postError: '',
          overlayClosingVerif: false,
          rules: {
             length: len => v => (v || '').length <= len || `Vous avez atteint le maximum de charactères (${len})`,
          }
        };
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
        draftTab(){
            console.log(this.mode);
            if (!this.validatedFields) {
               this.overlayClose();
               this.clearPost();
            } else {
               this.overlayClosingVerif = true
            }
        },
        overlayClose: function () {
           this.$emit('overlayClose')
        },
        clearPost () {
            this.postTextArea = '', this.overlayClose(), this.overlayClosingVerif = false, this.imagePost = null, this.previewImage = null
        },
        saveDrafts() {
            const self = this;
            this.$store.dispatch('saveDrafts', {postText: this.postTextArea, postImage: this.imagePost})
            .then(function () {
               if (self.status != 'error_save'){
                  self.$router.go();
               } else {
                  self.snackbarPost = true;
                  self.postError = 'Erreur de la sauvegarde du brouillon';
               }
            })
            .catch((error) => {
              console.log(error);
              self.snackbarPost = true;
              self.postError = 'Erreur de la sauvegarde du brouillon';
            })
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
</style>