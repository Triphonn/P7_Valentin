<template>
    <v-container ma-0 pa-0 fluid fill-height style="width: 100% !important;">
        <v-layout column align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12" rounded="lg">
                    <v-toolbar dark color="primary" class="layout align-center justify-center">
                        <v-toolbar-title v-if="mode == 'signup'" >Inscription</v-toolbar-title>
                        <v-toolbar-title v-else>Connexion</v-toolbar-title>
                    </v-toolbar>
                    <div style="margin: 10px auto; margin-bottom: 0px;" class="layout align-center justify-center">
                        <span class="login_btn" v-if="mode == 'signup'">Vous avez déjà un compte ? <span class="card__action" @click="switchToLogin">Se connecter</span></span>
                        <span class="login_btn" v-else>Tu n'as pas encore de compte ? <span class="card__action" @click="switchToCreateAccount">Créer un compte</span></span>
                    </div>
                    <v-card-text style="padding-top: 0px">
                        <v-form>
                           <v-text-field
                              color="secondary"
                              class="form-row mg-15"
                              name="email"
                              label="Email"
                              type="text"
                              :error-messages="emailErrors"
                              @input="$v.email.$touch()"
                              @blur="$v.email.$touch()"
                              v-model="email"
                           ></v-text-field>
                           <v-text-field
                              color="secondary"
                              class="form-row mg-15"
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
                        <v-btn color="third" @click="createAccount()" class="button button-radius" :disabled="disabled" v-if="mode == 'signup'" :loading="loading_button">        
                           <span>Créer mon compte</span>
                        </v-btn>
                        <v-btn color="third" @click="login()" class="button button-radius" :class="{'button--disabled' : !validatedFields}" v-else :loading="loading_button">        
                           <span>Se connecter</span>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'
import zxcvbn from 'zxcvbn'

export default {
    name: 'Login',
    data () {
      return {
          email: '',
          password: '',
          disabled: true,
          emailError: '',
          passwordError: '',
          passwordFeedback: '',
          loginError: '',
          snackbar: false,
          overlayLog: false,
          zIndex: 1,
          loading_button: false,
        };
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
    props: {
        mode: String
    },
    computed: {
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
            }
        },
         
         ...mapState(['status', 'profileInfos'])
      },
      methods: {
        clearData(){
            this.email = '', 
            this.password = ''
            this.emailError = '',
            this.passwordError = '',
            this.passwordFeedback = ''
        },
        switchToCreateAccount () {
            this.clearData();
            this.$emit('login', 1)
        },
        switchToLogin () {
            this.clearData();
            this.$emit('login', 0)
        },
        verifyProfile () {
            const self = this;
            const userId = self.$store.state.user.userId;
            this.$store.dispatch('verifyProfile')
            .then(function () {
                setTimeout(() => {
                    if (self.$store.state.status == 'profileCreated' || self.$store.state.userInfos != null) {
                        self.$router.go();
                    }
                }, 500);
            })           
            .catch((error) => {
              console.log(error);
              this.$router.push(`/createProfile/${userId}`);
            })
        },
        login () {
            this.loading_button = true
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
               this.loading_button = false
               this.snackbar = true;
               this.loginError = 'Adresse mail et/ou mot de passe invalide';
            })
            
        },
        createAccount () {
            this.loading_button = true
            const self = this;
            this.$store.dispatch('createAccount', {
               email: this.email,
               password: this.password,
            }).then(function () {
                setTimeout(() => {
                    self.login();
                }, 500);
            })
            .catch((error) => {
               console.log(error);
               this.loading_button = false
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
.mg-15{
    margin-right: 15px;
    margin-left: 15px;
}
.button-radius{
    border-radius: 20px;
}
</style>