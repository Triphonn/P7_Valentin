<template>
  <v-app>
    <div v-if="getUsernameAvatar != null">
      <nav-bar :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
      <v-main v-if="posts.length >= 0">
         <v-overlay :z-index="zIndex" :value="overlayPost">
            <create-post :mode="mode" @overlayClose="postOverlayHide" />
         </v-overlay>
         <posts v-for="post in posts" :key="post._id" :content="post.content" :file="post.file" :name="post.name" :username="post.username" />
      </v-main>
    </div>
    <div v-else>
      <nav-bar @login="overlayLogin" />
      <v-main v-if="posts.length >= 0">
         <v-overlay :z-index="zIndex" :value="overlayLog">
            <login :mode="mode" />
         </v-overlay>
         <posts v-for="post in posts" :key="post._id" :content="post.content" :file="post.file" :name="post.name" :username="post.username"/>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

import NavBar from '../components/NavBar.vue';
import Posts from '../components/Post.vue';
import Login from '../components/Login.vue'
import CreatePost from '../components/createPost.vue';

export default {
    name: 'Home',
    data () {
      return {
          getUsernameAvatar: this.$store.state.userInfos,
          mode: 'signup',
          snackbarPost: false,
          overlayPost: false,
          overlayLog: false,
          zIndex: 1,
          posts: [],
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
         Posts,
         Login,
         CreatePost,
      },
      mounted () {
         this.getAllPosts()
         setInterval(() => {
            this.getAllPosts()
         }, 1800000);
      },
      computed: {
         closeVerification() {
            this.overlayClosingVerif = true;
         },
         
         ...mapState(['status', 'profileInfos'])
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
