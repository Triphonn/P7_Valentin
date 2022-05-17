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
.normal-cursor{
  cursor: default;
}
.width-50p{
  width: 50px;
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
.border-radius-15{
  border-radius: 15px !important;
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
.flex-left{
  display: flex;
  align-items: left;
  justify-content: left;
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

.div-resp{
  overflow: hidden !important;
}

@media screen and (max-width: 960px) {
  .resp-div-post {
    width: 100% !important;
  }
  .v-main{
    padding: 35px 0 50px 0 !important;
  }
  .img-file{
    width: 350px;
  }
}

@media screen and (max-width: 500px) {
  .img-file{
    width: 150px;
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