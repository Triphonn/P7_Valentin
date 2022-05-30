<template>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center flex-left flex-auto">
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
      <div class="flex-column-center flex-auto search-bar">
        <v-autocomplete
          v-model="searchBar"
          :items="allProfiles"
          no-data-text="Aucun profil correspondant."
          clearable
          hide-details
          item-value="username"
          item-text="username"
          label="Qui recherchez-vous ?"
          append-icon=""
          dense
          flat
          outlined
          color="third"
          class="search-bar"
          return-object
        >
          <template v-slot:item="{ item }">
            <v-list-item-avatar class="mr-3 clear-pa-mg" size="30" @click="redirectToProfile(item)">
                  <img
                      :src="item.profilePicture"
                      alt="Photo de profil"
                      class="border-radius"
                  />
            </v-list-item-avatar>
            <div class="get-profile-force flex-left-center" @click="redirectToProfile(item)"
              ><span class="name-text">{{ item.name }}</span>
                <span class="username-text ml-3">@{{ item.username }}</span>
            </div>
          </template>
        </v-autocomplete>
      </div>
      <div v-if=" user.isLoggedIn == true " class="flex-auto flex-end">
          <v-btn
            text
            v-if="home"
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
              <v-avatar class="pp-2 ml-1" size="35" right>
                <img
                  :src="profilePicture"
                  alt="Photo de profil"
                >
              </v-avatar>
          </v-btn>
          <v-btn @click.prevent="logout()" text>
              <span>Déconnexion</span>
          </v-btn>
      </div>
      <div v-else class="flex-auto flex-end">

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
         allProfiles: null,
         searchBar: null,
         PPHover: false,
         zIndex: 0,
        }
      },
      props: {
        home: Number,
        username: String,
        profilePicture: String,
      },
      mounted(){
        this.getAllProfile()
        setInterval(() => {
          this.getAllProfile()
        }, 1800000);
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
.border-radius{
  border-radius: 25px;
}
</style>
