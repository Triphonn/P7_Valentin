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
.clear-pa-mg{
  padding: 0 !important;
  margin: 0 !important;
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
  width: 100%;
}
.width-80{
  width: 80%;
}
.border-bottom-gray{
  border-bottom: 1px solid rgb(47, 51, 54);
  border-radius: 0 !important;
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
  background-color: rgba(0, 0, 0, 1) !important;
}
.icon-basic{
  color: rgb(113, 118, 123) !important;
  min-height: 20px;
}
.padding-basic{
  padding: 7px;
}
.cursor{
  cursor: pointer;
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
}

body {
  background-color: rgba(0, 0, 0, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
}

img {
  background-size: cover;
  object-fit: cover;
  max-width: 100%;
  border-radius: 8px;
}
</style>