<template>
  <div id="app">
    <button class="goToMainBtn" @click="goToMain"><img src="./assets/MydaysLogo.png"></button>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
    // 현재 페이지가 Home 이면 이동안되게 변경 예정 
    goToMain(){
      this.$router.push("/calendar");
      this.$router.go();
    }
  }
}
</script>

<style>
@font-face {
    font-family: 'KyoboHand';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
#app {
  font-family: 'KyoboHand','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: large;
}
.goToMainBtn{
  border: none;
  background-color: white;
  height: 15vh;
  margin-bottom: 7vh;
}

.goToMainBtn:hover {
 opacity: 0.7;
}

.goToMainBtn > img{
  height: 15vh;
  object-fit:cover
}
</style>
