<template>
  <v-app>
      <v-snackbar
         v-model="snackbar"
         :timeout="1000000000"
      >
         {{ accountError }}
      </v-snackbar>
      <div v-if="getUsernameAvatar != null">
         <div v-if="isMobile" class="flex-center">
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
         <nav-bar-mobile v-if="isMobile" :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" />
         <nav-bar v-else :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
         
         <v-main>
            <v-overlay :z-index="zIndex" :value="overlayPost">
               <create-post :mode="mode" @overlayClose="postOverlayHide" />
            </v-overlay>
            <div class="flex-center flex-column mg-pa-gap-0" v-if="posts.length >= 0">
               <div class="resp-div-post flex-center flex-column mg-pa-gap-0">
                  <home-create-post :name="getUsernameAvatar.name" :username="getUsernameAvatar.username" :avatar="getUsernameAvatar.profilePicture" />
               </div>
               <div class="resp-div-post flex-center flex-column mg-pa-gap-0">
                  <posts class="mg-pa-gap-0 border-radius-15" v-for="post in posts" :key="post.id" :date="post.updatedAt" :avatar="post.avatar" :content="post.content" :image="post.image" :video="post.video" :name="post.name" :username="post.username" :id="post.id" :comments="comments" :commentavatar="getUsernameAvatar.profilePicture" @overlayCom="commentsOverlay" />
               </div>
               <div class="width-50">
                  <v-overlay :z-index="zIndex" :value="overlayComments" v-if="overlayComments">
                     <posts class="mg-pa-gap-0 width-850" :key="singlePost.id" :avatar="singlePost.avatar" :date="singlePost.updatedAt" :content="singlePost.content" :image="post.image" :video="post.video" :name="singlePost.name" :username="singlePost.username"  :id="singlePost.id" :comments="comments" :commentavatar="getUsernameAvatar.profilePicture" />
                  </v-overlay>
               </div>
            </div>
         </v-main>
      </div>
      <div v-else>
         <div v-if="isMobile" class="flex-center">
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
         <nav-bar-mobile v-if="isMobile" />
         <nav-bar v-else @login="overlayLogin" />
         <v-main>
            <v-overlay :z-index="zIndex" :value="overlayLog">
               <login :mode="mode" @login="overlayLogin" />
            </v-overlay>
            <div class="flex-center flex-column mg-pa-gap-0" v-if="posts.length >= 0">
               <div class="resp-div-post flex-center flex-column mg-pa-gap-0">
                  <posts class="mg-pa-gap-0 border-radius-15" v-for="post in posts" :key="post.id" :date="post.updatedAt" :avatar="post.avatar" :content="post.content" :image="post.image" :video="post.video" :name="post.name" :username="post.username" :id="post.id" :comments="comments" @overlayCom="commentsOverlay" />
               </div>
               <div class="width-50">
                  <v-overlay :z-index="zIndex" :value="overlayComments" v-if="overlayComments">
                     <posts class="mg-pa-gap-0 width-850" :key="singlePost.id" :avatar="singlePost.avatar" :date="singlePost.updatedAt" :content="singlePost.content" :image="post.image" :video="post.video" :name="singlePost.name" :username="singlePost.username"  :id="singlePost.id" :comments="comments" />
                  </v-overlay>
               </div>
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
import { mapMutations, mapState } from 'vuex';

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
          comments: [],
          loadSinglePostError: '',
          singlePost: null,
          snackbar: false,
          accountError: null
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
      mounted () {
         if (this.getUsernameAvatar == null && this.$store.state.user.isLoggedIn){
            this.snackbar = true;
            this.accountError = 'ERREUR : Vous n\'avez pas encore fini votre inscription, veuillez vous reconnecter pour finaliser votre inscription !';
         }
         this.getAllPosts()
         this.checkIsMobile()
         // this.getAllComments();
         setInterval(() => {
            this.getAllPosts()
         }, 1800000);

         setInterval(() => {
            this.getAllComments();
         }, 300000);
      },
      computed: {
         ...mapState(['isMobile'])
      },
      methods: {
         async getAllPosts(){
            const response = await fetch('http://localhost:3000/api/post/getAllPosts')
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
               // data[i].createdAt = data[i].createdAt.substring(0, 19).split('T').join(' ');
               const date1 = new Date();
               const date2 = new Date(data[i].updatedAt);

               const diffTime = Math.abs(date2 - date1);
               const diffSeconds = Math.ceil(diffTime / (1000));
               const diffMins = Math.ceil(diffTime / (1000 * 60));
               const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
               const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

               if (diffSeconds <= 60 ){
                  data[i].updatedAt = (diffSeconds - 1) + "sec"
               } else if (diffSeconds >= 60 && diffMins <= 60){
                  data[i].updatedAt = (diffMins - 1) + "min"
               } else if (diffMins >= 60 && diffHours <= 24) {
                  data[i].updatedAt = (diffHours - 1) + "h"
               } else {
                  data[i].updatedAt = (diffDays - 1) + 'j'
               }
            }
            this.posts = data;
         },
         async getAllComments(id){
            const response = await fetch(`http://localhost:3000/api/post/getcomments/${id}/coms`)
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
               data[i].createdAt = data[i].createdAt.substring(0, 19).split('T').join(' ');
               console.log(data[i].id);
            }
            this.comments = data;
         },
         checkIsMobile() {
            if( screen.width <= 960 ) {
               this.setMobileMode(true)
            }
            else {
               this.setMobileMode(false) 
            }
         },
         postOverlay() {
            this.mode = 'createPost'
            this.overlayPost = true
         },
         postOverlayHide(){
            this.overlayPost = false
         },
         commentsOverlay(event){
            this.overlayComments = true
            this.singlePost = this.posts.find(element => element.id == event);
            console.log(this.singlePost);
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
         ...mapMutations(['setMobileMode'])
      }
  }
</script>

<style scoped>
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
