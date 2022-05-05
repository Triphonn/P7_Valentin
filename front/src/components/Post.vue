<template>
    <v-item-group>
      <v-container>
        <v-col>
          <v-col
            cols="2"
            md="4"
            style="margin: 0 auto"
          >
            <v-item>
              <v-card
                class="align-center"
                dark
                height="25vh"
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
    </v-item-group>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
   name: 'Posts',

  data: function () {
      return {
         mode: 'home',
         overlay: false,
         zIndex: 0,
         }
      },
      props: {
        _id: Number,
        name: String,
        username: String,
        content: String,
        file: String,
      },
      computed: {
        ...mapGetters(['getProfileInfos']),
        ...mapState(['status', 'user', 'profileInfos'])
      },
      methods: {
          goToProfile: function () {
            this.$router.push(`/profile/${this.username}`);
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
