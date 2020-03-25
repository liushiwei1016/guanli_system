<template>
   <div>
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>权限管理</el-breadcrumb-item>
         <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!--卡片-->
      <el-card>
         <el-table :data="RightsListData" border stripe v-loading="loading">
            <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
               <template slot-scope="scope">
                  <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                  <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
                  <el-tag v-else type="warning">三级</el-tag>
               </template>
            </el-table-column>
         </el-table>
      </el-card>
   </div>
</template>

<script>
  import {getRightsData} from "../../../network/request_Fn/contentMain";

  export default {
    name: "rights",
    data() {
      return {
        loading: true,
        //权限列表数据
        RightsListData: [],
        //权限列表接口请求方式
        type: 'list'
      }
    },
    mounted() {
      this.getRightsList()
    },
    methods: {
      getRightsList() {
        getRightsData(this.type).then(res => {
          if (res.meta.status === 200) {
            this.RightsListData = res.data;
            this.loading = false
          } else {
            this.$message.error("权限列表获取失败")
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>

<style scoped>

</style>
