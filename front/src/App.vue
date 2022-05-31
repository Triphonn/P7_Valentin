<template>
  <router-view :style="{background: $vuetify.theme.themes[theme].background}"></router-view>
</template>

<script>

export default {
  name: 'App',
  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  }
}
</script>

<style>
.text-preline{
  white-space: pre-line !important;
}
.all-profile{
  gap: 2px;
  border-radius: 25px;
}
.profile-searched{
  border-radius: 25px;
}
.normal-cursor{
  cursor: default;
}
.width-50p{
  width: 50px;
}
.width-40{
  width: 40% !important;
}
.width-50{
  width: 50% !important;
}
.clear-pa-mg{
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}
.v-input__prepend-outer{
  margin: 0 !important;
}
.text-field-post {
  padding-top: 0 !important;
  margin-top: 0 !important;
}
.text-basic{
  color: inherit;
  font: inherit;
  white-space: inherit;
  font-family: 'Chirp', sans-serif;
  display: inline;
  font-size: 15px;
}
.width-100{
  width: 100% !important;
}
.card__action{
  color:#2196F3;
  text-decoration: underline;
}
.card__action:hover {
  cursor:pointer;
}
.width-80{
  width: 80%;
}
.width-90{
  max-width: 85%;
}
.width-850{
  width: 850px !important;
}
.border-bottom-gray{
  border-bottom: 1px solid rgb(47, 51, 54);
  border-radius: 15px !important;
}
.border-bottom-gray-profile{
  border-bottom: 1px solid rgb(47, 51, 54);
}
.border-basic{
  border-left: 1px solid rgb(47, 51, 54);
  border-right: 1px solid rgb(47, 51, 54);
}
.transform-Y-bottom{
  transform: translateY(20px);
}
.text-hover-white:hover{
  text-decoration: underline;
  color: rgb(231, 233, 234) !important;
}
.tr-color{
  transition-property: color;
}
.tr-bg-color{
  transition-property: background-color;
}
.bg-color{
  background-color: var(--v-fourth-base) !important;
}
.big-bg-color{
  background-color: var(--v-background-base) !important;
}
.border-radius-15{
  border-radius: 15px !important;
}
.name-text{
  font-size: 15px;
}
.get-profile-force{
  flex-wrap: nowrap !important;
  min-height: 40px !important;
  flex: 1 1 100% !important;
  letter-spacing: normal !important;
  outline: none !important;
  padding: 0 0 !important;
  text-decoration: none !important;
}
.search-bar-mobile{
  position: absolute !important;
  bottom: 50px !important;
}
.edit-card{
  width: 600px;
}
.logout-menu{
  width: auto;
  height: 100%;
  position: relative; bottom: 30px;
}
.height-singlepost .main-post-hover .content-post{
  min-height: 150px;
}
.resp-text-content{
  max-width: 90% !important;
}
.width-btn-basic{
  width: 80px;
}
.search-bar{
  max-width: 600px !important;
  padding-right: 50px;
  width: 100%;
}
.username-text{
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}
.icon-basic{
  color: rgb(113, 118, 123) !important;
  min-height: 20px;
}
.width-150-150{
  width: 150px;
  height: 150px;
}
.padding-basic{
  padding: 7px !important;
}
.padding-bottom{
  padding-bottom: 20px !important;
}
.mg-auto{
  margin-left: auto !important;
  margin-right: auto !important;
}
.cursor{
  cursor: pointer;
}
video {
  object-fit: fill;
}
.flex-between{
  display: flex;
  justify-content: space-between;
}
.flex-column-start{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.flex-column-center{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.flex-column-reverse-center{
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
}
.flex-row-center{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.flex-row-evenly{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.flex-center{
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-row-top{
  display: flex;
  align-items: top;
}
.flex-row-basic{
  display: flex;
  flex-direction: row;
}
.flex-end{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.flex-auto{
  width: 33% !important;
}
.flex-left{
  display: flex;
  align-items: left;
  justify-content: left;
}
.flex-left-center{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.v-card__subtitle, .v-card__text, .v-card__title {
  color: inherit;
  font: inherit;
  white-space: inherit;
  font-family: 'Chirp', sans-serif;
  display: inline;
  padding: 0 !important;
}
.v-card__subtitle{
  color: rgb(113, 118, 123) !important;
}
.v-card__title, .v-card__text{
  color: rgb(231, 233, 234) !important;
}
.v-card__text{
  font-weight: 400;
}
.row{
  margin: 0 !important;
}
.mr-2{
  text-decoration: none;
  color: rgb(230, 230, 230);
}
.mw-100{
  max-width: 100%;
}
.input:focus { 
    outline: none !important;
    border-color: #719ECE;
    box-shadow: 0 0 10px #719ECE;
}
.text-resp{
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}

.div-text-resp{
  max-width: 700px !important;
}

.div-resp{
  overflow: hidden !important;
}

.embed-file{
  max-width: 650px;
  max-height: 500px;
  width: 100%;
  height: 375px;
  background-size: cover;
  object-fit: cover;
}

@media screen and (max-width: 960px) {
  .resp-div-post {
    width: 100% !important;
  }
  .v-main{
    padding: 35px 0 50px 0 !important;
  }
  .img-file{
    width: 400px;
  }
  .embed-file{
    height: 250px;
  }
  .resp-list-item{
    flex-direction: row !important;
    min-height: 0px !important;
    padding: 0 !important;
  }
  .resp-join-date{
    font-size: 11px !important;
  }
  .resp-icon{
    font-size: 16px !important;
  }
  .resp-banner{
    max-height: 150px !important;
  }
  .v-menu__content{
    margin-left: -11px;
  }
  .search-bar{
    max-width: 960px !important;
    width: 100%;
  }
}

@media screen and (max-width: 500px) {
  .img-file{
    width: 150px;
  }
  .embed-file{
    height: 200px;
  }
  
}

@media screen and (max-width: 600px) {
  .resp-text-content{
    max-width: 80% !important;
  }
  .test-resp{
    max-width: 960px !important;
    width: 100% !important;
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .resp-div-post {
    width: 80% !important;
  }
}

@media screen and (min-width: 1264px) {
  .resp-div-post {
    width: 50% !important;
  }
}


@font-face {
    font-family: 'Chirp';
    src: url('./assets/fonts/chirp-bold-web.ttf'),
         url('./assets/fonts/chirp-heavy-web.ttf'),
         url('./assets/fonts/chirp-medium-web.ttf'),
         url('./assets/fonts/chirp-regular-web.ttf'),
}

* {
  font-family: 'Chirp', sans-serif;
  color: inherit;
  font: inherit;
  white-space: inherit;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

span{
  white-space: pre-line;
  max-height: 55px;
  overflow: hidden;
}

#app {
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.test{
  max-width: 100%;
  width: 100% !important;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

body {
  background-color: var(--v-background-base);
  min-height: 100vh;
  padding: 20px;
}

img {
  background-size: cover;
  object-fit: cover;
  max-width: 100%;
  border-radius: 8px;
}
</style>