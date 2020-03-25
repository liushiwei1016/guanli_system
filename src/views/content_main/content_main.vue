<template>
   <div class="content_main">
      <router-view></router-view>
   </div>
</template>

<script>
  export default {
    name: "content_main",
  }
</script>

<style scoped>
   .content_main /deep/ .el-card {
      margin-top: 20px!important;
   }
</style>
