<template>
  <v-container class="main-container bg-color width-100">
    <v-card class="main-post-hover bg-color width-100 flex-column border-bottom-gray">
      <v-row class="test-singlepost no-wrap main-card tr-bg-color cursor width-100" @click.stop="goForPost">
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
        <div class="width-100 flex-column-start resp-text-content">
          <v-row class="no-wrap flex-between gap-5 width-100">
            <div class="no-wrap flex-left gap-5 width-100">

              <div class="flex-center text-hover-white cursor div-resp">
                <v-card-title class="fs-15 text-resp" @click.stop="goToProfile()">{{ name }}</v-card-title>
              </div>
              <div class="flex-center cursor div-resp">
                <v-card-subtitle class="text-resp" @click.stop="goToProfile()">@{{ username }}</v-card-subtitle>
              </div>
              <div class="flex-center div-resp">
                <v-card-subtitle>·</v-card-subtitle>
              </div>
              <div class="flex-center div-resp">
                <v-card-subtitle class="text-resp">{{ date }}</v-card-subtitle>
              </div>
            </div>
            <div v-if="user.isLoggedIn" class="flex-center text-center icon-basic tr-color">
                <v-menu offset-y v-if="checkPost" :disabled="!checkPost" rounded left>
                  <template v-slot:activator="{ on, attrs }">
                    <svg v-bind="attrs" v-on="on" class="cursor" style="width:24px;height:24px" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
                    </svg>
                  </template>
                  <v-list class="clear-pa-mg flex-end width-100">
                    <v-list-item class="cursor list-item-basic" @click="editPostOverlay" v-if="username == userInfos.username">
                      <v-list-item-title>Éditer le post</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="cursor list-item-basic" @click="deleteOnePost">
                      <v-list-item-title>Supprimer le post</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </div>
          </v-row>
          <div v-if="!editPostMode" class="pr-8 content-post">
            <div class="mb-3 width-100 div-resp mh-100">
              <v-card-text v-if="contentModified != content" class="text-content" @click.stop="">{{ contentModified }}</v-card-text>
              <v-card-text v-else class="text-content" style="cursor: text;" @click.stop="">{{ content }}</v-card-text>
            </div>
            <div v-if="videoId" class="mb-3 width-100">
              <iframe class="embed-file" :src="videoId" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="mb-3 width-100">
              <div class="img-width">
                <v-img
                  v-if="image"
                  class="img-file"
                  :src="image"
                  @click.stop="imageHD = true"
                >
                </v-img>
                <video v-if="video" ref="videoRef" :src="video" class="img-file" id="video-container" width="500px" controls onloadstart="this.volume=0" @click.stop="imageHD = true">
                </video>
              </div>
              <v-overlay @click.stop="imageHD = false" :z-index="zIndex" :value="imageHD">
                <v-img
                  class="big-img-file normal-cursor"
                  width="80%"
                  :src="image"
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
                <video v-if="video" ref="videoRef" :src="video" class="big-img-file normal-cursor" id="video-container" onloadstart="this.volume=0.4" autoplay controls>
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
                </video>
              </v-overlay>
            </div>
          </div>
          <div v-else>
            <v-card-text>
              <v-form>
                  <v-textarea
                      class="form-row clear-pa-mg"
                      type="post"
                      v-model="postEdit"
                      auto-grow
                      dense
                      counter="200"
                      clearable
                      color="third"
                      @click:clear="postEdit = ''"
                      @click.stop=""
                  >
                  </v-textarea>
                  <div v-if="previewImageEdit" class="flex-row-top width-150-150">
                    <v-img v-if="previewImageEdit" class="img-file" width="150px" height="150px" :src="previewImageEdit" >
                    </v-img>
                    <div class="width-50 icon-basic tr-color cursor padding-basic">
                      <v-icon v-if="previewImageEdit" @click.stop="previewPost = 'deleted', previewImageEdit = ''" dense size="24" color="secondary">
                        mdi-close
                      </v-icon>
                    </div>
                  </div>
                  <div v-if="previewVideoEdit" class="flex-row-top">
                    <video v-if="previewVideoEdit" ref="videoRef" :src="previewVideoEdit" class="img-file" id="video-container" width="300px" height="200px" controls>
                    </video>
                    <div class="width-50 icon-basic tr-color cursor padding-basic">
                      <v-icon v-if="previewVideoEdit" @click.stop="previewPost = 'deleted', previewVideoEdit = ''" dense size="24" color="secondary">
                        mdi-close
                      </v-icon>
                    </div>
                  </div>
              </v-form>
            </v-card-text>
            <div class="width-100 mt-3">
              <div class="row flex-between px-16 width-100 mb-2">
                  <div @click.stop="">
                      <v-btn color="third" @click.stop="editPostMode = !editPostMode" class="button button-radius">        
                          <span>Annuler</span>
                      </v-btn>
                  </div>
                  <v-card-actions class="form-row clear-pa-mg">
                      <div @click.stop="">
                        <div class="width-50 row icon-basic tr-color icon-bottom-bar cursor flex-center padding-basic mr-4">
                            <v-file-input class="text-field-post" hide-input @blur="search = ''" prepend-icon="mdi-image-plus" @change="previewEditImage" accept="image/*, video/*" />
                        </div>
                      </div>
                      <v-spacer></v-spacer>
                      <v-btn color="third" @click.stop="editOnePost" class="button button-radius" :disabled="!validatedFields" :loading="edited">        
                          <span v-if="status == 'loading'">Modification en cours...</span>
                          <span v-else>Modifier</span>
                      </v-btn>
                  </v-card-actions>
              </div>
            </div>
          </div>
          <div class="row flex-between width-80 mb-2 width-100" v-if="!editPostMode">
            <div>
              <div class="row icon-basic tr-color icon-bottom-bar" @click.stop="overlayComment()">
                <div>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>
                  <span>{{ comments }}</span>
                </div>
              </div>
            </div>
            <div>
              <div class="row icon-basic tr-color icon-bottom-bar" @click.stop="postLike">
                <div v-if="loadingLiked">
                  <v-progress-circular
                    indeterminate
                    color="third"
                    :size="27"
                    :width="3"
                  ></v-progress-circular>
                </div>
                <div v-else>
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>
                  <span v-if="likesModified != likes">{{ likesModified }}</span>
                  <span v-else>{{ likes }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="overlayPostComment" @click.stop="">
              <v-textarea
                @click.stop=""
                class="form-row clear-pa-mg search-bar"
                label="Poster un commentaire"
                id="comment"
                name="comment"
                type="comment"
                v-model="commentTextArea"
                auto-grow
                rows="1"
                outlined
                dense
                flat
                clearable
                counter="200"
                @click:clear="commentTextArea = ''"
                color="third"
              >
              </v-textarea>
            <div class="width-100">
                <div class="row flex-between width-100 mb-2">
                    <v-card-actions class="form-row clear-pa-mg">
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
      {{ globalError }}
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

         globalError: null,
         snackbar: false,

         editPostMode: false,
         postEdit: this.content,
         imageEdit: null,
         previewImageEdit: '',
         previewPost: null,
         previewVideoEdit: '',

         edited: false,
         loadingLiked: false,
         userLikedArray: this.userLiked,
         videoId: null,
         likesModified: this.likes,
         contentModified: this.content,
         }
      },
      props: {
        id: Number,
        name: String,
        username: String,
        avatar: String,
        commentavatar: String,
        comments: Number,
        content: String,
        image: String,
        video: String,
        date: String,
        likes: Number,
        userLiked: Array,
      },
      created(){
        this.getUrl()
      },
      computed: {
        //// Validate the differents text-fields 
        validatedFields: function () {
          if (this.overlayPostComment){
            if (this.commentTextArea != "" && this.commentTextArea.length <= 200 && !this.commentTextArea.match(/^\s*$/)) {
               return true;
            } else {
               return false;
            }
          } else if (this.editPostMode) {
            if ((this.postEdit != "" && this.postEdit.length <= 200 && !this.postEdit.match(/^\s*$/)) && (this.postEdit != this.content || this.previewImageEdit != this.image || this.previewVideoEdit != this.video)){
              return true
            } else {
              return false
            }
          }
        },
        ////// check if user can edit/delete
        checkPost: function(){
          if ((this.username == this.$store.state.userInfos.username && this.user.isLoggedIn) || (this.$store.state.isAdmin === 1)){
            return true
          } else {
            return false
          }
        },
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user', 'userInfos'])
      },
      methods: {
        ///////// Turn youtube links into video embed and then delete the link in the text field so the post is softer
        createYoutubeEmbed (key) {
          return 'https://www.youtube.com/embed/' + key + '';
        },
        transformYoutubeLinks (text) {
          if (!text) return text;
          const self = this;

          const linkreg = /(?:)<a([^>]+)>(.+?)<\/a>/g;
          const fullreg = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
          const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;

          let resultHtml = text;  

          // get all the matches for youtube links using the first regex
          const match = text.match(fullreg);
          if (match && match.length > 0) {
            // get all links and put in placeholders
            const matchlinks = text.match(linkreg);
            if (matchlinks && matchlinks.length > 0) {
              for (var i=0; i < matchlinks.length; i++) {
                resultHtml = resultHtml.replace(matchlinks[i], "#placeholder" + i + "#");
              }
            }

            // now go through the matches one by one
            for (var i=0; i < match.length; i++) {
              // get the key out of the match using the second regex
              let matchParts = match[i].split(regex);
              // replace the full match with the embedded youtube code
              resultHtml = resultHtml.replace(match[i], self.createYoutubeEmbed(matchParts[1]));
            }

            // ok now put our links back where the placeholders were.
            if (matchlinks && matchlinks.length > 0) {
              for (var i=0; i < matchlinks.length; i++) {
                resultHtml = resultHtml.replace("#placeholder" + i + "#", matchlinks[i]);
              }
            }
          }
          return resultHtml;
        },
        linkifyYouTubeURLs(text) {
          let re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
          return text.replace(re).split('undefined').join('');
        },
        getUrl(){
          const fullreg = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
          let youtubeId = ''
          if (this.contentModified.match(fullreg)){
            youtubeId = this.content.match(fullreg).join()
            this.videoId = (this.transformYoutubeLinks(youtubeId))
            this.contentModified = this.linkifyYouTubeURLs(this.contentModified)
          } else {
          }
        },
        /////// Function to go to user's profile when click on username/name/avatar shown on posts
        goToProfile: function () {
          this.$router.push(`/profile/${this.username}`);
          this.$router.go()
        },
        ////// Function to go to the post I clicked on
        goToPost: function() {
          this.$router.push(`/${this.username}/${this.id}`);
          this.$router.go()
        },
        ////////// Active comments overlay to comment one post
        overlayComment(){
          if (this.user.isLoggedIn){
            this.overlayPostComment = this.overlayPostComment ? false : true
            this.commentTextArea = ''
          } else {
            this.snackbar = true
            this.globalError = 'Vous devez être connecté pour commenter des publications.'
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
        previewEditImage(e) {
            let urlCreator = window.URL || window.webkitURL;
            this.previewPost = e;
            if(e.type.startsWith("video")){
              this.previewVideoEdit = urlCreator.createObjectURL(this.previewPost);
              this.previewImageEdit = ''
            } else {
              this.previewImageEdit = urlCreator.createObjectURL(this.previewPost);
              this.previewVideoEdit = ''
            }
        },
        postComment: function(){
          this.postOneComment({postId: this.id, content: this.commentTextArea, image: this.imageComment})
          this.$router.go()
        },
        postLike(){
          if (this.user.isLoggedIn){
            this.loadingLiked = true
            const username = this.$store.state.userInfos.username
            const found = this.userLikedArray.find(x => x.postId == this.id)
            if (found){
              this.postOneLike({postId: this.id, username: username})
              setTimeout(() => {
                this.loadingLiked = false
              }, 500);
              /////////// Add userId in an array to check if user liked or not
              this.likesModified = this.likesModified - 1
              this.userLikedArray = this.userLikedArray.filter(e => e.postId != this.id, 1)
            } else {
              this.loadingLiked = true
              this.postOneLike({postId: this.id, username: username})
              setTimeout(() => {
                this.loadingLiked = false
              }, 500);
              this.userLikedArray.push({postId: this.id, username})
              this.likesModified = this.likesModified + 1
            }
          } else {
            ////// you cant like if you are not connected
            this.snackbar = true
            this.globalError = 'Vous devez être connecté pour liker des publications.'
          }
        },
        deleteOnePost: function(){
          this.deletePost({postId: this.id})
          this.$router.go()
        },
        editPostOverlay(){
          this.editPostMode = true;
          if (this.image){
            this.previewImageEdit = this.image
          } else {
            this.previewVideoEdit = this.video
          }
        },
        goForPost(){
          if (!this.editPostMode) {
            this.$emit('overlayCom', this.id)
          }
        },
        editOnePost () {
          this.edited = true
          this.editPost({postId: this.id, content: this.postEdit, image: this.previewPost})
          setTimeout(() => {
            this.edited = false
            this.$router.go();
          }, 1000);
        },
        ...mapActions(['postOneComment', 'deletePost', 'editPost', 'postOneLike']),
      }
   }
</script>

<style scoped>
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
  white-space: pre-line;
  overflow: hidden;
  font-family: 'Chirp', sans-serif;
}

.mh-100{
  max-height: 125px;
}

</style>
