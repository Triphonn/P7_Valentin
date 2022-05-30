<template>
    <div class="flex-center">
        <v-card class="main-post-hover bg-color width-40 mt-4 flex-column border-bottom-gray">
            <v-row class="test-singlepost no-wrap main-card tr-bg-color cursor width-100" @click.stop="overlayCom">
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
                <div class="width-100 flex-column-start">
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
                            <v-list-item class="cursor list-item-basic" @click="deleteOneComment">
                                <v-list-item-title>Supprimer</v-list-item-title>
                            </v-list-item>
                            </v-list>
                        </v-menu>
                        </div>
                    </v-row>
                    <div class="pr-8 content-post">
                        <div class="mb-3 width-100 div-resp resp-content div-text-resp text-resp">
                            <v-card-text v-if="contentModified != content" class="text-content div-text-resp">{{ contentModified }}</v-card-text>
                            <v-card-text v-else class="text-content div-text-resp">{{ content }}</v-card-text>
                        </div>
                        <div v-if="videoId" class="mb-3 width-100">
                            <iframe class="embed-file" :src="videoId" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            </v-row>
        </v-card>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
   name: 'comments',

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


         edited: false,
         loadingLiked: false,
         userLiked: null,
         videoId: null,
         contentModified: this.content,
         }
      },
      props: {
        id: Number,
        name: String,
        username: String,
        avatar: String,
        content: String,
        date: String,
        postId: Number,
      },
      created(){
        this.getUrl()
      },
      computed: {
        checkPost: function(){
          if ((this.username == this.$store.state.userInfos.username && this.user.isLoggedIn) || (this.$store.state.isAdmin === 1)){
            return true
          } else {
            return false
          }
        },
        ...mapState(['status', 'user', 'userInfos'])
      },
      methods: {
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
        deleteOneComment(){
          this.deleteComment({commentId: this.id, username: this.username, postId: this.postId})
          this.$router.go()
        },
        goToProfile: function () {
          this.$router.push(`/profile/${this.username}`);
          this.$router.go()
        },
        ...mapActions(['deleteComment']),
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
  white-space: inherit;
  font-family: 'Chirp', sans-serif;
}

</style>
