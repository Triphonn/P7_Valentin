<template>
    <v-main>
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
        <posts :id="singlePost._id" :content="singlePost.content" :file="singlePost.file" :name="singlePost.name" :username="singlePost.username" />
    </v-main>
    
                <!-- <v-list-item-avatar size="100" @mouseover="PPHover = true" @mouseleave="PPHover = false">
                 <img
                    class="avatar-22"
                    src="https://cdn.discordapp.com/attachments/843841677004374049/973269325408522250/ksM_DTxy_400x400.jpg"
                    alt="Photo de profil"
                  />
                  <v-overlay absolute :z-index="zIndex" :value="PPHover" >
                    <v-card>
                      <v-card-title>test</v-card-title>
                    </v-card>
                  </v-overlay>
                </v-list-item-avatar> -->
    <!-- <v-item-group>
      <v-container>
        <v-col>
          <v-col
            cols="2"
            md="7"
            style="margin: 0 auto"
          >
            <v-item>
              <v-card
                class="align-center"
                dark
                height="40vh"
              >
              <v-card-title>{{ name }}</v-card-title>
              <v-card-subtitle style="cursor: pointer" @click="goToProfile()">@{{ username }}</v-card-subtitle>
              <v-card-text>{{ content }}</v-card-text>
              <v-img v-if="file" :src="file" style="height: 15vh"></v-img>
              </v-card>
            </v-item>
          </v-col>
        </v-col>
      </v-container>
    </v-item-group> -->
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Posts from '../components/Post.vue';

export default {
   name: 'SinglePost',

  data: function () {
      return {
         mode: 'home',
         overlay: false,
         PPHover: false,
         loadSinglePostError: '',
         singlePost: null,
         zIndex: 99999999999999,
         }
      },
      components:{
        Posts
      },
      mounted (){
        this.getSinglePost();
        setInterval(() => {
            this.getSinglePost()
        }, 300000);
      },
      computed: {
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user', 'profileInfos'])
      },
      methods: {
          async getSinglePost(){
            const username = this.$route.params.username;
            const id = this.$route.params.id;

            const response = await fetch(`http://localhost:3000/api/post/${username}/post/${id}`)
            const data = await response.json();
            console.log(data);
            if (data || data != null){
              data.createdAt = data.createdAt.substring(0, 19).split('T').join(' ');       
            } else {
              console.log('test');
              this.loadSinglePostError = 'Cette publication n\'est pas disponible.';
              console.log(this.loadSinglePostError);
            }

            this.singlePost = data;
            console.log(this.singlePost._id);
        },
          goToProfile: function () {
            this.$router.push(`/profile/${this.username}`);
            this.$router.go()
          },
          goToPost: function() {
            this.$router.push(`/${this.username}/status/${this.id}`);
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
         }
      }
   }
</script>
