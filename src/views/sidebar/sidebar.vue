<template>
   <div class="box">
      <el-menu
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#409EFF"
              :collapse="isCollapse"
              router
              :collapse-transition="false"
              :unique-opened="true"
              :default-active="activePath"
      >
         <div class="title">
            <img src="~img/douyulogo.png">
            <h1>自动化运维平台</h1>
         </div>
         <!--一级菜单-->
         <el-submenu :index="item.path.toString()" v-for="item in menuList" :key="item.id">
            <template slot="title">
               <!--图标-->
               <i :class="iconfontObj[item.id]"></i>
               <!--图标-->
               <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.path.toString()"
                          v-for="subItem in item.children"
            >
               <template slot="title">
                  <!--图标-->
                  <i class="el-icon-aim"></i>
                  <!--文本-->
                  <span>{{subItem.authName}}</span>
               </template>
            </el-menu-item>
         </el-submenu>
      </el-menu>
   </div>
</template>

<script>
  import {getNavMenuData} from "../../network/request_Fn/sidebar";

  export default {
    name: "sidebar",
    props: {
      isCollapse: {
        type: Boolean
      }
    },
    data() {
      return {
        menuList: [],
        iconfontObj: {
          '125': 'iconfont icon-users',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',
        },
        activePath: ''
      }
    },

    mounted() {
      this.getMenuList();
      //刷新保留原有状态
      let start = window.location.href.lastIndexOf('/');
      let path = window.location.href.slice(start + 1);
      this.activePath = path;
    },

    methods: {
      getMenuList() {
        //获取菜单列表数据
        getNavMenuData().then(res => {
          if (res.meta.status === 200) {
            this.menuList = res.data;
            // console.log(this.menuList);
          } else {
            this.$message({
              type: 'error',
              message: res.meta.msg
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
    }
  }
</script>

<style scoped>
   @import "~css/element-ui.scss";

   .title {
      height: 60px;
      display: flex;
      align-items: center;
      padding-left: 20px;
   }

   .title h1 {
      color: #fff;
      display: inline-block;
      vertical-align: middle;
      font-size: 20px;
      margin: 0 0 0 12px;
      font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      white-space: nowrap;
   }

   .box {
      width: auto;
      height: 100%;
   }

   .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 250px;
      min-height: 100%;
   }

   .iconfont {
      padding-right: 5px;
   }
</style>
