<template>
   <div class="box_main">
      <el-container>
         <el-aside width="auto">
            <sidebar :isCollapse="isCollapse"></sidebar>
         </el-aside>
         <el-container>
            <el-header>
               <header_top :isCollapse="isCollapse" @CollapseClick="CollapseClick"></header_top>
            </el-header>
            <el-main>
               <content_main></content_main>
            </el-main>
         </el-container>
      </el-container>
   </div>
</template>

<script>
  import Sidebar from "./sidebar/sidebar";
  import Header_top from "./header_top/header_top";
  import Content_main from "./content_main/content_main";

  export default {
    name: "home",
    components: {
      Content_main,
      Header_top,
      Sidebar
    },
    data() {
      return {
        isCollapse: false
      }
    },
    mounted() {
      window.onresize = () => {
        var clientWidth = document.body.clientWidth;
        if (clientWidth < 800) {
          this.isCollapse = true
        } else {
          this.isCollapse = false
        }
      }
    },

    methods: {
      CollapseClick() {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>

<style scoped>
   .box_main {
      width: 100%;
      height: 100%;
   }
</style>
