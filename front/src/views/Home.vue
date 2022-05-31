<template>
  <v-app>
      <v-snackbar
         v-model="snackbar"
         :timeout="1000000000"
      >
         {{ accountError }}
      </v-snackbar>
      <div v-if="getUsernameAvatar != null">
         <div class="flex-center d-md-none">
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
         <div class="mt-7 d-md-none" v-if="searchBarOverlay">
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
         <nav-bar-mobile class="d-md-none" :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @searchBarOn="searchBarOverlay = !searchBarOverlay" />
         <nav-bar class="d-none d-md-block" :home="0" :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
         
         <v-main>
            <v-overlay :z-index="zIndex" :value="overlayPost">
               <create-post :mode="mode" @overlayClose="postOverlayHide" />
            </v-overlay>
            <div class="flex-center flex-column mg-pa-gap-0" v-if="posts.length >= 0">
               <div class="resp-div-post flex-center flex-column mg-pa-gap-0">
                  <home-create-post :name="getUsernameAvatar.name" :username="getUsernameAvatar.username" :avatar="getUsernameAvatar.profilePicture" />
               </div>
               <div class="resp-div-post flex-center flex-column mg-pa-gap-0">
                  <posts class="mg-pa-gap-0 border-radius-15" v-for="post in posts" :key="post.id" :userLiked="userLiked" :comments="post.comments" :likes="post.likes" :date="post.createdAt" :avatar="post.avatar" :content="post.content" :image="post.image" :video="post.video" :name="post.name" :username="post.username" :id="post.id" :commentavatar="getUsernameAvatar.profilePicture" @overlayCom="goForPost" />
               </div>
            </div>
         </v-main>
      </div>
      <div v-else>
         <div class="flex-center d-md-none">
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
         <div class="mt-7 d-md-none" v-if="searchBarOverlay">
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
         <nav-bar-mobile class="d-md-none" @searchBarOn="searchBarOverlay = !searchBarOverlay" @login="overlayLogin" />
         <nav-bar class="d-none d-md-block" :home="0" @login="overlayLogin" />
         <v-main>
            <v-overlay :z-index="zIndex" :value="overlayLog">
               <login :mode="mode" @login="overlayLogin" />
            </v-overlay>
            <div class="flex-center flex-column mg-pa-gap-0" v-if="posts.length > 0">
               <div class="resp-div-post flex-center flex-column mg-pa-gap-0">
                  <posts class="mg-pa-gap-0 border-radius-15" v-for="post in posts" :key="post.id" :userLiked="userLiked" :comments="post.comments" :likes="post.likes" :date="post.createdAt" :avatar="post.avatar" :content="post.content" :image="post.image" :video="post.video" :name="post.name" :username="post.username" :id="post.id" @overlayCom="goForPost" />
               </div>
            </div>
            <div v-else class="flex-center">
               <span>
                  Aucune publication n'a été trouvé. Vous pouvez vous inscrire pour publier votre premier post.
               </span>
            </div>
         </v-main>
      </div>
  </v-app>
</template>

<script>

import NavBar from '../components/NavBar.vue';
import Posts from '../components/Post.vue';
import Login from '../components/Login.vue'
import CreatePost from '../components/createPost.vue';
import HomeCreatePost from '../components/HomeCreatePost.vue';
import NavBarMobile from '../components/NavBarMobile.vue';

export default {
    name: 'Home',
    data () {
      return {
          getUsernameAvatar: this.$store.state.userInfos,
          mode: 'signup',
          overlayPost: false,
          overlayLog: false,
          overlayComments: false,
          zIndex: 1,
          posts: [],
          loadSinglePostError: '',
          singlePost: null,
          snackbar: false,
          accountError: null,

          searchBarOverlay: false,
          allProfiles: null,
          searchBar: null,

          userLiked: [],
        };
      },
      components: {
         NavBar,
         Posts,
         Login,
         CreatePost,
         HomeCreatePost,
         NavBarMobile
      },
      created(){
         if (this.$store.state.user.isLoggedIn){
            this.getAllLikes()
         }
      },
      mounted () {
         if (this.getUsernameAvatar == null && this.$store.state.user.isLoggedIn){
            this.snackbar = true;
            this.accountError = 'ERREUR : Vous n\'avez pas encore fini votre inscription, veuillez vous reconnecter pour finaliser votre inscription !';
         }
         this.getAllPosts()
         this.getAllProfile()
         // this.getAllComments();
         setInterval(() => {
            this.getAllPosts()
            this.getAllProfile()
         }, 1800000);
      },
      methods: {
         async getAllLikes(){
            const response = await fetch('http://localhost:3000/api/post/getAllLikes')
            const data = await response.json();
            let username = ''
            let array = ''
            if (this.$store.state.user.isLoggedIn){
               username = this.$store.state.userInfos.username
               array = data.filter(e => e.username == username)
            } else {
               username = ''
            }
            this.userLiked = array;
         },
         async getAllProfile() {
            const response = await fetch ('http://localhost:3000/api/profile/getAllProfiles')
            const data = await response.json();
            this.allProfiles = data
         },
         redirectToProfile(profile){
            this.$router.push(`/profile/${profile.username}`);
            this.$router.go()
         },
         async getAllPosts(){
            const response = await fetch('http://localhost:3000/api/post/getAllPosts')
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
               // data[i].createdAt = data[i].createdAt.substring(0, 19).split('T').join(' ');
               const date1 = new Date();
               const date2 = new Date(data[i].createdAt);

               const diffTime = Math.abs(date2 - date1);
               const diffSeconds = Math.ceil(diffTime / (1000));
               const diffMins = Math.ceil(diffTime / (1000 * 60));
               const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
               const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

               if (diffSeconds <= 60 ){
                  data[i].createdAt = (diffSeconds - 1) + "sec"
               } else if (diffSeconds >= 60 && diffMins <= 60){
                  data[i].createdAt = (diffMins - 1) + "min"
               } else if (diffMins >= 60 && diffHours <= 24) {
                  data[i].createdAt = (diffHours - 1) + "h"
               } else {
                  data[i].createdAt = (diffDays - 1) + 'j'
               }
            }
            this.posts = data;
         },
         postOverlay() {
            this.mode = 'createPost'
            this.overlayPost = true
         },
         postOverlayHide(){
            this.overlayPost = false
         },
         goForPost(event){
            const singlePost = this.posts.find(element => element.id == event);
            this.$router.push(`/${singlePost.username}/${singlePost.id}`);
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
      }
  }
</script>

<style scoped>
.border-radius{
  border-radius: 25px;
}
.overlay-content {
  max-width: 960px;
}
.mg-pa-gap-0{
   margin: 0;
   padding: 0;
   gap: 15px;
}
@media screen and (min-width: 961px) {
   .v-main{
      padding: 60px 0 0 0 !important;
   }
}
</style>
