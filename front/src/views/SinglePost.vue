<template>
  <v-app>
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
        <nav-bar class="d-none d-md-block" :username="getUsernameAvatar.username" :profilePicture="getUsernameAvatar.profilePicture" @createpost="postOverlay" />
        <v-main>
            <v-overlay :z-index="zIndex" :value="overlayPost">
               <create-post :mode="mode" @overlayClose="postOverlayHide" />
            </v-overlay>
            <div class="flex-center flex-column mg-pa-gap-0" v-if="singlePost">
               <div class="resp-div-post flex-center flex-column mg-pa-gap-0">
                  <posts class="mg-pa-gap-0 border-radius-15 height-singlepost" :key="singlePost.id" :likes="singlePost.likes" :date="singlePost.createdAt" :avatar="singlePost.avatar" :content="singlePost.content" :image="singlePost.image" :video="singlePost.video" :name="singlePost.name" :username="singlePost.username" :id="singlePost.id" :comments="comments" />
               </div>
            </div>
            <comments v-for="comment in comments" :key="comment.id" :date="comment.createdAt" :avatar="comment.avatar" :content="comment.content" :name="comment.name" :username="comment.username" :id="comment.id" />
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
        <nav-bar class="d-none d-md-block" @login="overlayLogin" />
        <v-main>
          <v-overlay :z-index="zIndex" :value="overlayLog">
              <login :mode="mode" @login="overlayLogin" />
          </v-overlay>
            <div class="flex-center flex-column mg-pa-gap-0" v-if="singlePost">
                <div class="resp-div-post flex-center flex-column mg-pa-gap-0">
                  <posts class="mg-pa-gap-0 border-radius-15 height-singlepost" :key="singlePost.id" :likes="singlePost.likes" :date="singlePost.createdAt" :avatar="singlePost.avatar" :content="singlePost.content" :image="singlePost.image" :video="singlePost.video" :name="singlePost.name" :username="singlePost.username" :id="singlePost.id" :comments="comments" />
                </div>
            </div>
            <comments v-for="comment in comments" :key="comment.id" :date="comment.createdAt" :avatar="comment.avatar" :content="comment.content" :name="comment.name" :username="comment.username" :id="comment.id" />
        </v-main>
    </div>
    <v-snackbar
      v-model="snackbarPost"
      :timeout="5500"
    >
      {{ loadSinglePostError }}
    </v-snackbar>
  </v-app>
</template>

<script>

import NavBar from '../components/NavBar.vue';
import Posts from '../components/Post.vue';
import Login from '../components/Login.vue'
import CreatePost from '../components/createPost.vue';
import HomeCreatePost from '../components/HomeCreatePost.vue';
import NavBarMobile from '../components/NavBarMobile.vue';
import { mapState } from 'vuex';
import Comments from '../components/comments.vue';

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
         searchBarOverlay: false,
         allProfiles: null,
         searchBar: null,
         zIndex: 99999999999999,
         }
      },
      components: {
         NavBar,
         Posts,
         Login,
         CreatePost,
         HomeCreatePost,
         NavBarMobile,
            Comments
      },
      mounted (){
        this.getSinglePost();
        this.getAllComments();
        this.getAllProfile()
        setInterval(() => {
            this.getSinglePost()
            this.getAllComments();
            this.getAllProfile()
        }, 300000);
      },
      computed: {
        checkPost: function(){
          if (this.comment.username == this.$store.state.userInfos.username && this.user.isLoggedIn){
            return true
          } else {
            return false
          }
        },
        ...mapState(['status', 'user', 'userInfos'])
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
        async getAllComments(){
          const id = this.$route.params.id;

          const response = await fetch(`http://localhost:3000/api/post/getcomments/${id}/coms`)
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
          this.comments = data;
        },
        async getSinglePost(){
          const username = this.$route.params.username;
          const id = this.$route.params.id;

          const response = await fetch(`http://localhost:3000/api/post/${username}/${id}`)
          const data = await response.json();
          if (data || data != null){
               const date1 = new Date();
               const date2 = new Date(data.createdAt);

               const diffTime = Math.abs(date2 - date1);
               const diffSeconds = Math.ceil(diffTime / (1000));
               const diffMins = Math.ceil(diffTime / (1000 * 60));
               const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
               const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

               if (diffSeconds <= 60 ){
                  data.createdAt = (diffSeconds - 1) + "sec"
               } else if (diffSeconds >= 60 && diffMins <= 60){
                  data.createdAt = (diffMins - 1) + "min"
               } else if (diffMins >= 60 && diffHours <= 24) {
                  data.createdAt = (diffHours - 1) + "h"
               } else {
                  data.createdAt = (diffDays - 1) + 'j'
               }
            this.singlePost = data;
          } else {
            this.snackbarPost = true
            this.loadSinglePostError = 'Cette publication n\'est pas disponible.';
            setTimeout(() => {
              this.$router.push('/')
            }, 5500);
          }
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
.button-radius{
  border-radius: 20px;
}
.v-overlay__content{
  display: flex !important;
  width: 50% !important;
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
  background-color: var(--v-background-base);
  margin-left: auto;
  margin-right: auto;
  margin-top: 4px;
  height: 100%;
}
.red-liked{
  color: rgb(249, 24, 128) !important;
}
.img-file{
  max-width: 406px;
  max-height: 400px;
  background-size: cover;
  border-radius: 15px;
  object-fit: cover;
}
.img-width{
  width: 100%;
}
.big-img-file{
  max-width: 1500px;
  max-height: 800px;
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
  background-color: var(--v-fourth-base);
  border-radius: 20px;
}
.icon-basic:hover{
  color: var(--v-third-base) !important;
}
.icon-basic:hover svg{
  background-color: var(--v-primary-base);
  border-radius: 20px;
}
.list-item-basic:hover{
  background-color: rgba(255, 255, 255, 0.03) !important;
}
.list-item-basic{
  background-color: var(--v-primary-base) !important;
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
  border-radius: 15px;
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
