<template>
    <v-bottom-navigation
      color="third"
      horizontal
      class="fixed-bar width-button"
    >
    <v-btn @click.stop="goToHome">
        <div class="flex-column-center reverse">
            <span>Accueil</span>

            <v-icon class="clear-pa-mg">mdi-home</v-icon>
        </div>
    </v-btn>

    <v-btn @click.stop="searchBarOverlay()">
        <div class="flex-column-center reverse">
            <span>Search</span>

            <v-icon class="clear-pa-mg">mdi-magnify</v-icon>
        </div>
    </v-btn>

      <v-btn @click="goToProfile">
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
      <v-btn @click="logout">
          <div class="flex-column-center reverse">
            <span>Déconnexion</span>

            <v-icon class="clear-pa-mg">mdi-logout-variant</v-icon>
        </div>
      </v-btn>
    <v-btn v-if="!user.isLoggedIn" @click="login" class="width-btn-basic">
        <div class="flex-column-center reverse">
            <span>Se connecter</span>

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
         allProfiles: null,
         searchBar: null,
         searchBarOn: false,
         overlayLogout: false,
         zIndex: 0,
         }
      },
      props: {
        username: String,
        profilePicture: String,
      },
      computed: {
        getFilteredProfiles(item, queryText, itemText){
          return itemText.toLocaleLowerCase().startsWith(queryText.toLocaleLowerCase())
        },
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user', 'profileInfos'])
      },
      methods: {
        async getAllProfile() {
          const response = await fetch ('http://localhost:3000/api/profile/getAllProfiles')
          const data = await response.json();
          this.allProfiles = data
        },
        redirectToProfile(profile){
          this.$router.push(`/profile/${profile.username}`);
          this.$router.go()
        },
        goToHome: function () {
          this.$router.push('/')
          this.$router.go()
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
        },
        searchBarOverlay(){
          this.$emit('searchBarOn')
        },
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
.width-button button{
  width: 25% !important;
  padding: 0 !important;
}
</style>
