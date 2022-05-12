<template>
  <v-app>
    <div v-if="getUsernameAvatar != null">
      <nav-bar :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
      <v-main>
         <v-overlay :z-index="zIndex" :value="overlayPost">
            <create-post :mode="mode" @overlayClose="postOverlayHide" />
         </v-overlay>
         <div class="flex-center flex-column border-basic mg-pa-gap-0" v-if="posts.length >= 0">
            <home-create-post :name="getUsernameAvatar.name" :username="getUsernameAvatar.username" :avatar="getUsernameAvatar.profilePicture" />
            <posts class="mg-pa-gap-0" v-for="post in posts" :key="post.id" :avatar="post.avatar" :content="post.content" :file="post.file" :name="post.name" :username="post.username" :id="post.id" :comments="comments" :commentavatar="getUsernameAvatar.profilePicture"/>
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

export default {
    name: 'Home',
    data () {
      return {
          getUsernameAvatar: this.$store.state.userInfos,
          mode: 'signup',
          overlayPost: false,
          overlayLog: false,
          zIndex: 1,
          posts: [],
          comments: [],
        };
      },
      components: {
         NavBar,
         Posts,
         Login,
         CreatePost,
         HomeCreatePost,
      },
      mounted () {
         this.getAllPosts()
         setInterval(() => {
            this.getAllPosts()
         }, 1800000);
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
         postOverlay() {
            this.mode = 'createPost'
            this.overlayPost = true
         },
         postOverlayHide(){
            this.overlayPost = false
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
.overlay-content {
  max-width: 960px;
}
.flex{
  width: 500px;
}
.mg-pa-gap-0{
   margin: 0;
   padding: 0;
   gap: 0;
}
.v-main{
   padding: 35px 0 0 0 !important;
}
</style>
