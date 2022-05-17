<template>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
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
      <v-spacer></v-spacer>
      <v-col v-if=" user.isLoggedIn == true " class="flex-row">
        <v-spacer></v-spacer>
          <v-btn
            text
            @click.stop="createpost"
          >
          <v-icon>mdi-plus-box</v-icon>
          </v-btn>
          <v-skeleton-loader
            type="avatar"
            v-if="profilePicture == null"
          ></v-skeleton-loader>
          <v-btn v-else @click="goToProfile()" text>
            {{username}}
            <v-spacer></v-spacer>
              <v-avatar class="pp-2" size="35" right>
                <img
                  :src="profilePicture"
                  alt="Photo de profil"
                >
              </v-avatar>
          </v-btn>
          <v-btn @click.prevent="logout()" text>
              <span>Déconnexion</span>
          </v-btn>
      </v-col>
      <div v-else>

          <v-btn
            text
            @click="signup"
          >
          <span>S'inscrire</span>
          </v-btn>
        <v-btn
          text
          @click="login"
        >
        <span>Se connecter</span>
        </v-btn>
      </div>
    </v-app-bar>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
   name: 'NavBar',

  data: function () {
      return {
         mode: 'home',
         overlay: false,
         zIndex: 0,
         }
      },
      props: {
        username: String,
        profilePicture: String,
      },
      computed: {
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user', 'profileInfos'])
      },
      methods: {
        goToProfile: function () {
            this.$router.push(`/profile/${this.username}`);
            this.$router.go()
        },
        logout: function() {
            this.$store.dispatch('logout')
            // this.$router.push('/')
            this.$router.go('/')
         },
         signup: function () {
           this.$emit('login', 1)
         },
         login: function () {
           this.$emit('login', 0)
         },
         createpost: function () {
           this.$emit('createpost')
         }
      }
   }
</script>

<style scoped>
.mr-2{
  text-decoration: none;
  color: white;
}
.av-22{
  cursor: pointer;
}
.flex-row{
  display: flex;
  flex-direction: row;
}
</style>
