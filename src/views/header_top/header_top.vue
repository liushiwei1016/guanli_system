<template>
   <div class="topBox">
      <div class="icon" @click="CollapseClick">
         <i v-if="isCollapse" class="el-icon-s-unfold"></i>
         <i v-else class="el-icon-s-fold"></i>
      </div>
      <el-button type="primary" size="mini" @click="logoutClick">退出</el-button>
   </div>
</template>

<script>
  export default {
    name: "header_top",
    data() {
      return {}
    },
    props: {
      isCollapse: {
        type: Boolean
      }
    },
    methods: {
      CollapseClick() {
        this.$emit('CollapseClick')
      },
      logoutClick() {
        this.$confirm('是否退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
          //清除 sessionStorage 里保存的 token 值
          window.sessionStorage.clear();
          //跳转到登录页
          this.$router.push('/login')
        }).catch(() => {
          //这里一定要加catch方法，否则取消会报错
        })
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>
   .topBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 20px;
      box-shadow: 0 1px 2px 2px rgba(255, 255, 255, 0.2);
      background-color: #fff;
   }

   .icon {
      width: 30px;
      height: 30px;
      font-size: 30px;
      color: #616161;
      cursor: pointer;
   }
</style>
