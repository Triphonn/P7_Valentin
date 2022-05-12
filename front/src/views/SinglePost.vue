<template>
  <v-app>
    <div v-if="getUsernameAvatar != null">
      <nav-bar :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
      <v-main class="width-850 border-basic">
         <v-overlay :z-index="zIndex" :value="overlayPost">
            <create-post :mode="mode" @overlayClose="postOverlayHide" />
         </v-overlay>
            <v-col
              cols="12"
              md="4"
              v-if="loading"
              style="margin: 0 auto; max-width: 950px; border: 5px solid red"
            >
              <v-skeleton-loader
                type="image, table-heading, list-item-two-line"
              ></v-skeleton-loader>
            </v-col>
            <div class="flex-center flex-column width-850" v-if="singlePost || singlePost != null">
              <posts class="mg-pa-gap-0 width-846 mr-1" :key="singlePost.id" :avatar="singlePost.avatar" :content="singlePost.content" :file="singlePost.file" :name="singlePost.name" :username="singlePost.username"  :id="singlePost.id" :comments="comments" :commentavatar="getUsernameAvatar.profilePicture"/>
              <div v-for="comment in comments" :key="comment.id">
                <v-row class="no-wrap main-card tr-bg-color cursor width-100" @click="goToPost">
                  <div class="avatar-22 flex-column-start">
                    <v-list-item-avatar class="mr-1" size="50" @mouseover="PPHover = true" @mouseleave="PPHover = false" @click.stop="goToProfile()">
                        <img
                            :src="comment.avatar"
                            alt="Photo de profil"
                        />
                        <v-overlay absolute :z-index="zIndex" :value="PPHover" >
                        </v-overlay>
                    </v-list-item-avatar>
                  </div>
                  <div class="width-100">
                    <v-row class="no-wrap flex-between gap-5 width-100">
                      <div class="no-wrap flex-left gap-5 width-100">

                        <div class="flex-center text-hover-white cursor">
                          <v-card-title class="fs-15" @click.stop="goToProfile()">{{ comment.name }}</v-card-title>
                        </div>
                        <div class="flex-center cursor">
                          <v-card-subtitle @click.stop="goToProfile()">@{{ comment.username }}</v-card-subtitle>
                        </div>
                        <div class="flex-center">
                          <v-card-subtitle>·</v-card-subtitle>
                        </div>
                        <div class="flex-center">
                          <v-card-subtitle>2h</v-card-subtitle>
                        </div>
                      </div>
                      <div class="flex-center icon-basic tr-color">
                        <svg class="cursor" style="width:24px;height:24px" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
                        </svg>
                      </div>
                    </v-row>
                    <div class="mb-3 width-100">
                      <v-card-text class="text-content">{{ comment.content }}</v-card-text>
                    </div>
                    <div class="mb-3 width-100">
                      <v-img
                        v-if="comment.file"
                        class="img-file"
                        :src="comment.file"
                        @click.stop="imageHD = true"
                    ></v-img>
                      <v-overlay @click.stop="imageHD = false" :z-index="zIndex" :value="imageHD">
                        <v-img
                          class="big-img-file normal-cursor"
                          width="40vw"
                          :src="comment.file"
                        >
                        <v-btn
                          depressed
                          fab
                          icon
                          color="primary"
                          right
                          @click.stop="imageHD = false"
                          style="float: right;"
                          >
                          <v-icon dense color="primary">
                            mdi-close
                          </v-icon>
                        </v-btn>
                        </v-img>
                      </v-overlay>
                    </div>
                  </div>
                </v-row>
              </div>
            </div>
      </v-main>
    </div>
    <div v-else>
      <nav-bar @login="overlayLogin" />
      <v-main>
         <v-overlay :z-index="zIndex" :value="overlayLog">
            <login :mode="mode" @login="overlayLogin" />
         </v-overlay>
         <div class="flex-center flex-column border-basic" v-if="singlePost || singlePost != null">
            <posts class="mg-pa-gap-0 width-850" :key="singlePost.id" :avatar="singlePost.avatar" :content="singlePost.content" :file="singlePost.file" :name="singlePost.name" :username="singlePost.username"  :id="singlePost.id" :comments="comments"/>
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
   name: 'SinglePost',

  data: function () {
      return {
         mode: 'home',
         getUsernameAvatar: this.$store.state.userInfos,
         snackbarPost: false,
         overlayPost: false,
         overlayLog: false,

         overlay: false,
         PPHover: false,
         loading: false,
         imageHD: false,

         comments: null,
         loadSinglePostError: '',
         singlePost: null,
         zIndex: 99999999999999,
         }
      },
      components: {
         NavBar,
         Posts,
         Login,
         CreatePost,
         HomeCreatePost,
      },
      mounted (){
        this.getSinglePost();
        this.getAllComments();
        setInterval(() => {
            this.getSinglePost()
            this.getAllComments();
        }, 300000);
      },
      methods: {
        async getAllComments(){
          const id = this.$route.params.id;
          console.log(id);

          const response = await fetch(`http://localhost:3000/api/post/getcomments/${id}/coms`)
          const data = await response.json();
          for (let i = 0; i < data.length; i++) {
              data[i].createdAt = data[i].createdAt.substring(0, 19).split('T').join(' ');
              console.log(data[i].id);
          }
          console.log(data);
          this.comments = data;
        },
        async getSinglePost(){
          const username = this.$route.params.username;
          const id = this.$route.params.id;

          const response = await fetch(`http://localhost:3000/api/post/${username}/${id}`)
          const data = await response.json();
          if (data || data != null){
            data.createdAt = data.createdAt.substring(0, 19).split('T').join(' ');       
          } else {
            console.log('test');
            this.loadSinglePostError = 'Cette publication n\'est pas disponible.';
            console.log(this.loadSinglePostError);
          }
          this.singlePost = data;
        },
        goToProfile: function () {
          this.$router.push(`/profile/${this.username}`);
          this.$router.go()
        },
        goToPost: function() {
          this.$router.push(`/${this.username}/status/${this.id}`);
          this.$router.go()
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
.width-846{
  width: 846px !important;
}
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
.ml-small{
  margin-left: 2px;
}
.mg-auto{
  margin: 0 auto;
}
.width-64{
  width: 64px;
}
.comment-looker{
  display: flex;
  align-items: left;
  justify-content: flex-start;
}
.gray-bar{
  width: 2px;
  background-color: rgb(51, 54, 57);
  margin-left: auto;
  margin-right: auto;
  margin-top: 4px;
  height: 100%;
}
.img-file{
  max-width: 500px;
  background-size: cover;
  border-radius: 15px;
  object-fit: cover;
}
.big-img-file{
  max-width: 1500px;
  background-size: cover;
  border-radius: 15px;
  object-fit: cover;
}
.icon-bottom-bar svg{
  fill: currentcolor;
  width: 1.25em;
  height: 1.25em;
  color: rgb(113, 118, 123);
}
.icon-bottom-bar:hover{
  color: rgb(256,212,212) !important;
}
.icon-bottom-bar:hover svg{
  background-color: rgba(256, 212, 212, 0.1);
  border-radius: 20px;
}
.main-post-hover:hover{
  transition-duration: 0.2s;
  background-color: rgba(255, 255, 255, 0.03) !important;
}
.icon-basic:hover{
  color: rgb(256,212,212) !important;
}
.icon-basic:hover svg{
  background-color: rgba(256, 212, 212, 0.1);
  border-radius: 20px;
}
.mr-5{
  margin-right: 5px;
}
.fs-15{
  font-size: 15px;
  font-weight: 700;
}
.main-container{
  transition-duration: 0.2s;
  width: 32vw;
  border-radius: 0;
}
.main-card{
  padding-right: 20px;
  padding-left: 16px;
  margin-bottom: -1px;
}
.gap-5{
  gap: 5px;
}
.subtitle{
  margin-top: 22px !important;
}
.no-wrap{
  flex-wrap: nowrap;
}
.avatar-22{
  padding: 0 10px 0 0;
}
.text-content{
  width: 30vw;
  color: inherit;
  font: inherit;
  white-space: inherit;
  font-family: 'Chirp', sans-serif;
}
</style>
