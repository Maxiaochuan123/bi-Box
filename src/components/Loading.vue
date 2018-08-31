<template>
  <div class="loding" v-if="showLoading">
    <div class="loader">
      <div class="ball-scale-multiple">
        <div  v-for="(item,index) in 3" :key="index"></div>
      </div>
    </div>
  </div>
</template>

<script>
 export default {
   name: "loding",
   props:{
     showLoading: Boolean
   }
 }
</script>
<style lang="scss" scoped>
  @import  url("../../static/style/loadding.css");

  .loding{
    position:absolute;
    width: 322px;
    height: 100%;
    background-color: #0e223eeb;
    z-index: 10000;

  .loader{
    margin: 120% auto 0;

    .ball-scale-multiple{
      width: 88px;
      margin: 24px auto 0;
      div{
        width: 100px;
        height: 100px;
        background-color: #698ab9b0;
      }
    } 
  }
 }
</style>