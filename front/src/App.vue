<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
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
  padding: 0;
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
  max-width: 100%;
  border-radius: 8px;
}
</style>