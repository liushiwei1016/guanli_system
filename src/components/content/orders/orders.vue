<template>
   <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>订单管理</el-breadcrumb-item>
         <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
   </div>
</template>

<script>
  export default {
    name: "orders"
  }
</script>

<style scoped>

</style>
