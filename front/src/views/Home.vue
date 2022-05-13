<template>
  <v-app>
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
         <nav-bar-mobile v-if="isMobile" />
         <nav-bar v-else :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
         
         <v-main>
            <v-overlay :z-index="zIndex" :value="overlayPost">
               <create-post :mode="mode" @overlayClose="postOverlayHide" />
            </v-overlay>
            <div class="flex-center flex-column mg-pa-gap-0" v-if="posts.length >= 0">
               <home-create-post :name="getUsernameAvatar.name" :username="getUsernameAvatar.username" :avatar="getUsernameAvatar.profilePicture" />
               <posts class="mg-pa-gap-0 border-radius-25" v-for="post in posts" :key="post.id" :avatar="post.avatar" :content="post.content" :file="post.file" :name="post.name" :username="post.username" :id="post.id" :comments="comments" :commentavatar="getUsernameAvatar.profilePicture" @overlayCom="commentsOverlay" />
               <v-overlay :z-index="zIndex" :value="overlayComments" v-if="overlayComments">
                  <posts class="mg-pa-gap-0 width-850" :key="singlePost.id" :avatar="singlePost.avatar" :content="singlePost.content" :file="singlePost.file" :name="singlePost.name" :username="singlePost.username"  :id="singlePost.id" :comments="comments" :commentavatar="getUsernameAvatar.profilePicture" />
               </v-overlay>
            </div>
         </v-main>
      </div>
      <div v-else>
         <nav-bar @login="overlayLogin" />
         <v-main>
            <v-overlay :z-index="zIndex" :value="overlayLog">
               <login :mode="mode" @login="overlayLogin" />
            </v-overlay>
            <div class="flex-center flex-column border-basic" v-if="posts.length >= 0">
               <posts class="mg-pa-gap-0" v-for="post in posts" :key="post.id" :avatar="post.avatar" :content="post.content" :file="post.file" :name="post.name" :username="post.username" :id="post.id" :comments="comments" />
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
               data[i].createdAt = data[i].createdAt.substring(0, 19).split('T').join(' ');
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
.flex{
  width: 500px;
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
