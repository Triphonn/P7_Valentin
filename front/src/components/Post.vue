<template>
  <v-container class="main-container bg-color width-100">
    <v-card class="main-post-hover bg-color width-100 flex-column border-bottom-gray">
      <v-row class="no-wrap main-card tr-bg-color cursor width-100" @click="goToPost">
        <div class="avatar-22 flex-column-start">
          <v-list-item-avatar class="mr-1" size="50" @mouseover="PPHover = true" @mouseleave="PPHover = false" @click.stop="goToProfile()">
              <img
                  :src="avatar"
                  alt="Photo de profil"
              />
              <v-overlay absolute :z-index="zIndex" :value="PPHover" >
              </v-overlay>
          </v-list-item-avatar>
          <!-- <div v-if="comments.length >= 1" class="gray-bar"></div> -->
        </div>
        <div class="width-100">
          <v-row class="no-wrap flex-between gap-5 width-100">
            <div class="no-wrap flex-left gap-5 width-100">

              <div class="flex-center text-hover-white cursor">
                <v-card-title class="fs-15" @click.stop="goToProfile()">{{ name }}</v-card-title>
              </div>
              <div class="flex-center cursor">
                <v-card-subtitle @click.stop="goToProfile()">@{{ username }}</v-card-subtitle>
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
            <v-card-text class="text-content">{{ content }}</v-card-text>
          </div>
          <div class="mb-3 width-100">
            <v-img
              v-if="file"
              class="img-file"
              :src="file"
              @click.stop="imageHD = true"
           ></v-img>
            <v-overlay @click.stop="imageHD = false" :z-index="zIndex" :value="imageHD">
              <v-img
                class="big-img-file normal-cursor"
                width="40vw"
                :src="file"
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
          <div class="row flex-between width-80 mb-2 width-100">
            <div>
              <div class="row icon-basic tr-color icon-bottom-bar" @click.stop="overlayComment()">
                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>
              </div>
            </div>
            <div>
              <div class="row icon-basic tr-color icon-bottom-bar">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M22,11L12,21L2,11H8V3H16V11H22M12,18L17,13H14V5H10V13H7L12,18Z" /></svg>
              </div>
            </div>
            <div>
              <div class="row icon-basic tr-color icon-bottom-bar">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M16,13V21H8V13H2L12,3L22,13H16M7,11H10V19H14V11H17L12,6L7,11Z" /></svg>
              </div>
            </div>
          </div>
          <div v-if="overlayPostComment">
              <v-textarea
                @click.stop=""
                class="form-row clear-pa-mg"
                id="comment"
                name="comment"
                type="comment"
                v-model="commentTextArea"
                auto-grow
                rows="1"
                dense
                clearable
                color="third"
              >
              </v-textarea>
              <img v-if="previewImage" class="img-file" width="100px" height="100px" :src="previewImage" />
            <div class="width-100">
                <div class="row flex-between px-16 width-100 mb-2">
                    <div>
                        <div class="width-50 row icon-basic tr-color icon-bottom-bar cursor flex-center padding-basic">
                            <v-file-input @click.stop="" class="text-field-post" hide-input @blur="search = ''" prepend-icon="mdi-image-plus" @change="previewImageContent" accept="image/*" />
                        </div>
                    </div>
                    <v-card-actions class="form-row clear-pa-mg">
                        <v-spacer></v-spacer>
                        <v-btn color="third" @click.stop="postComment()" class="button button-radius" :disabled="!validatedFields">        
                            <span v-if="status == 'loading'">Publication en cours...</span>
                            <span v-else>Publier</span>
                        </v-btn>
                    </v-card-actions>
                </div>
            </div>
          </div>
        </div>
      </v-row>
      <!-- <v-row v-if="comments.length >= 1" class="cursor comment-looker main-post-hover no-wrap main-card tr-bg-color cursor width-100">
        <div class="bloc-post avatar-22 flex-column-start width-64 ml-small">
          <v-list-item-avatar class="mr-1 " size="35" @click.stop="goToProfile()">
            <img
              :src="avatar"
              alt="Photo de profil"
            />
          </v-list-item-avatar>
        </div>
        <div class="flex-center text-basic">
          <span>Afficher la discussion</span>
        </div>
      </v-row> -->
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="1500"
    >
      {{ commentError }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
   name: 'Posts',

  data: function () {
      return {
         mode: 'home',
         overlay: false,
         PPHover: false,
         PPHover2: false,
         imageHD: false,
         previewImage: null,
         imageComment: null,
         zIndex: 99999999999999,
         overlayPostComment: false,
         commentTextArea: "",
         commentError: null,
         snackbar: false
         }
      },
      props: {
        id: Number,
        name: String,
        username: String,
        avatar: String,
        commentavatar: String,
        comments: Array,
        content: String,
        file: String,
      },
      computed: {
        validatedFields: function () {
            if (this.commentTextArea != "" ) {
               return true;
            } else {
               return false;
            }
        },
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user', 'profileInfos'])
      },
      methods: {
          goToProfile: function () {
            this.$router.push(`/profile/${this.username}`);
            this.$router.go()
          },
          goToPost: function() {
            this.$router.push(`/${this.username}/${this.id}`);
            this.$router.go()
          },
          logout: function() {
            this.$store.dispatch('logout')
            this.$router.push('/')
            this.$router.go()
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
         overlayComment(){
           if (this.user.isLoggedIn){
              this.overlayPostComment = this.overlayPostComment ? false : true
           } else {
             this.snackbar = true
             this.commentError = 'Vous devez être connecté pour commenter des publications.'
           }
         },
        clearPost () {
            this.commentTextArea = '', this.imageComment = null, this.previewImage = null
        },
        previewImageContent(e) {
            let urlCreator = window.URL || window.webkitURL;
            this.imageComment = e;
            this.previewImage = urlCreator.createObjectURL(this.imageComment);
        },
        postComment: function(){
          this.postOneComment({postId: this.id, content: this.commentTextArea, image: this.imageComment})
        },
         ...mapActions(['postOneComment']),
      }
   }
</script>

<style scoped>
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
