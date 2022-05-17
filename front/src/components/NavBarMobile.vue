<template>
    <v-bottom-navigation
    color="third"
    horizontal
    class="fixed-bar mg-pa-gap-0"
  >
    <v-btn @click.stop="goToHome">
        <div class="flex-column-center reverse">
            <span>Accueil</span>

            <v-icon class="clear-pa-mg">mdi-home</v-icon>
        </div>
    </v-btn>

    <v-btn>
        <div class="flex-column-center reverse">
            <span>Search</span>

            <v-icon class="clear-pa-mg">mdi-magnify</v-icon>
        </div>
    </v-btn>

    <v-btn v-if=" user.isLoggedIn == true " @click="goToProfile()">
        <div class="flex-column-center reverse">
          <span>Profil</span>
            <v-avatar class="pp-2" size="24" right>
              <img
                  :src="profilePicture"
                  alt="Photo de profil"
              >
            </v-avatar>
        </div>
    </v-btn>
    <v-btn v-else>
        <div class="flex-column-center reverse">
            <span>S'inscrire</span>

            <v-icon class="clear-pa-mg">mdi-login-variant</v-icon>
        </div>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
   name: 'NavBarMobile',

  data: function () {
      return {
         mode: 'home',
         overlay: false,
         value: null,
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
        goToHome: function () {
          this.$router.go('/')
        },
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
.fixed-bar{
    position: fixed !important; bottom: 0 !important;
    z-index: 99;
    background-color: var(--v-fourth-base) !important;
}
.reverse{
    flex-direction: column-reverse !important;
}
.mg-pa-gap-0{
    flex-basis: 1 !important;
    justify-content: space-evenly !important;
}
</style>
