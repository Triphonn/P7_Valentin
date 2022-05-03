<template>
  <v-app>
    <div v-if="user != null">
      <nav-bar :username="user.username" :profilePicture="user.profilePicture" :loading="loading" @createpost="postOverlay" />
    </div>
    <div v-else>
      <nav-bar @login="overlayLogin" />
    </div>
    <v-main>
         <v-overlay :z-index="zIndex" :value="overlayPost">
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
                                 class="form-row"
                                 id="post"
                                 name="post"
                                 label="Quoi de neuf ?"
                                 type="post"
                                 v-model="postTextArea"
                                 auto-grow
                                 dense
                                 counter="120"
                                 :rules="[rules.length(120)]"
                              >
                              </v-textarea>
                              <img v-if="previewImage" class="img-file" width="100%" height="200px" :src="previewImage" />
                              <v-alert dense type="info" v-if="passwordFeedback && mode == 'signup'" color='primary'>
                                 {{ passwordFeedback }}
                              </v-alert>
                           </v-form>
                        </v-card-text>
                        <v-snackbar
                           v-model="snackbar"
                           :timeout="1500"
                        >
                           {{ postError }}
                        </v-snackbar>
                        <v-card-actions class="form-row">
                           <v-file-input hide-input prepend-icon="mdi-image-outline" @change="previewImageContent" accept="image/*" />       
                           <v-spacer></v-spacer>
                           <v-btn color="primary" @click="createSinglePost()" class="button" :disabled="!validatedFields" v-if="mode == 'createPost'">        
                              <span v-if="status == 'loading'">Publication en cours...</span>
                              <span v-else>Publier</span>
                           </v-btn>
                        </v-card-actions>
                     </v-card>
                  </v-flex>
               </v-layout>
            </v-container>
         </v-overlay>
      <v-overlay :z-index="zIndex" :value="overlayLog">
         <v-container ma-0 pa-0 fluid fill-height>
            <v-layout column align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title v-if="mode == 'signup'">Inscription</v-toolbar-title>
                        <v-toolbar-title v-else>Connexion</v-toolbar-title>
                     </v-toolbar>
                     <span class="login_btn" v-if="mode == 'signup'">Vous avez déjà un compte ? <span class="card__action" @click="switchToLogin()">Se connecter</span></span>
                     <span class="login_btn" v-else>Tu n'as pas encore de compte ? <span class="card__action" @click="switchToCreateAccount()">Créer un compte</span></span>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                              class="form-row"
                              name="email"
                              label="Email"
                              type="text"
                              :error-messages="emailErrors"
                              @input="$v.email.$touch()"
                              @blur="$v.email.$touch()"
                              v-model="email"
                           ></v-text-field>
                           <v-text-field
                              class="form-row"
                              id="password"
                              name="password"
                              label="Password"
                              type="password"
                              :error-messages="passwordErrors"
                              @input="$v.password.$touch()"
                              @blur="$v.password.$touch()"
                              v-model="password"
                           ></v-text-field>
                           <v-alert dense type="info" v-if="passwordFeedback && mode == 'signup'" color='primary'>
                              {{ passwordFeedback }}
                           </v-alert>
                        </v-form>
                     </v-card-text>
                     <v-snackbar
                        v-model="snackbar"
                        :timeout="1500"
                     >
                        {{ loginError }}
                     </v-snackbar>
                     <v-card-actions class="form-row">
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="createAccount()" class="button" :disabled="disabled" v-if="mode == 'signup'">        
                           <span v-if="status == 'loading'">Création en cours...</span>
                           <span v-else>Créer mon compte</span>
                        </v-btn>
                        <v-btn color="primary" @click="login()" class="button" :class="{'button--disabled' : !validatedFields}" v-else>        
                           <span v-if="status == 'loading'">Connexion en cours...</span>
                           <span v-else>Se connecter</span>
                        </v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
        </v-overlay>
      </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'
import zxcvbn from 'zxcvbn'

import NavBar from '../components/NavBar.vue';

export default {
    name: 'Home',
    data () {
      return {
          user: this.$store.state.profileInfos,
          mode: 'signup',
          email: '',
          password: '',
          disabled: true,
          emailError: '',
          passwordError: '',
          passwordFeedback: '',
          loginError: '',
          snackbar: false,
          overlayLog: false,
          overlayPost: false,
          zIndex: 1,
          post: '',
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
      components: {
      NavBar,
      },
      props: {
         source: String,
      },
      mounted () {
         const userId = this.$store.state.user.userId;
         if (userId != -1) {
            this.overlayLog = false;
         }
      },
      mixins: [validationMixin],
      validations: {
         email: {
            required,
            email
         },
         password: {
            required,
            minLength: minLength(8)
         }
      },
      computed: {
         closeVerification() {
            this.overlayClosingVerif = true;
         },
         emailErrors() {
            const errors = [];
            if (this.mode == 'login') return errors;
            if (!this.$v.email.$dirty) return errors;
            !this.$v.email.required && errors.push('L\'email est requis');
            !this.$v.email.email && errors.push('L\'email n\'est pas valide');
            this.emailError = errors.length != 0;
            this.disabled = !this.emailError && !this.passwordError && this.validatedFields ? false : true;
            return errors;
         },

         passwordErrors() {
            const errors = [];
            if (this.mode == 'login') return errors;
            if (!this.$v.password.$dirty) return errors;
            !this.$v.password.required && errors.push('Le mot de passe est requis');
            !this.$v.password.minLength && errors.push('Le mot de passe doit contenir au moins 8 caractères');
            const passwordSecure = zxcvbn(this.password);
            if (passwordSecure.score < 2) {
            errors.push(passwordSecure.feedback.warning);
            this.passwordFeedback = passwordSecure.feedback.suggestions[0];
            } else {
            this.passwordFeedback = '';
            }
            this.passwordError = errors.length != 0;
            this.disabled = !this.emailError && !this.passwordError && this.validatedFields ? false : true;
            return errors;
         },

         validatedFields: function () {
            if (this.mode == 'signup') {
            if (this.email != "" && this.password != "") {
               return true;
            } else {
               return false;
            }
            } else if (this.mode == 'login'){
               if (this.email != "" && this.password != "") {
                  return true;
               } else {
                  return false;
               }
            } else if (this.mode == 'createPost'){
               if (this.postTextArea != "" && this.postTextArea.length >= 5 && this.postTextArea.length <= 120) {
                  return true;
               } else {
                  return false;
               }
            }
         },
         
         ...mapState(['status', 'profileInfos'])
      },
      methods: {
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
               }
            })
            .catch((error) => {
               console.log('bite');
              console.log(error);
              this.snackbar = true;
              this.postError = error;
            })
         },
         postOverlay() {
            this.mode = 'createPost'
            this.overlayPost = true
         },
         previewImageContent(e) {
            this.mode = 'createPost';
            let urlCreator = window.URL || window.webkitURL;
            this.imagePost = e;
            this.previewImage = urlCreator.createObjectURL(this.imagePost);
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
        switchToCreateAccount () {
            this.mode = 'signup';
        },
        switchToLogin () {
            this.mode = 'login';
        },
        verifyProfile () {
            const self = this;
            const userId = self.$store.state.user.userId;
            this.$store.dispatch('verifyProfile')
            .then(function () {
               if (self.$store.state.status == 'profileCreated' || self.$store.state.profileInfos != null) {
                  self.$router.go();
               }
            })           
            .catch((error) => {
              console.log(error);
              this.$router.push(`/createProfile/${userId}`);
            })
        },
        login () {
            const self = this;
            this.$store.dispatch('login', {
               email: this.email,
               password: this.password,
            })
            .then(function () {
              self.verifyProfile();
            })
            .catch((error) => {
               console.log(error);
               this.snackbar = true;
               this.loginError = 'Adresse mail et/ou mot de passe invalide';
            })
            
        },
        createAccount () {
            const self = this;
            this.$store.dispatch('createAccount', {
               email: this.email,
               password: this.password,
            }).then(function () {
            self.login();
            })
            .catch((error) => {
               console.log(error);
               this.snackbar = true;
               this.loginError = 'Adresse mail déjà utilisée';
            })
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
</style>
