<template>
   <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
         <!--搜索添加-->
         <el-row :gutter="20">
            <el-col :span="10">
               <el-input placeholder="请输入内容"
                         v-model="query"
                         clearable
                         @clear="getGoodsList"
               >
                  <el-button slot="append"
                             icon="el-icon-search"
                             @click="getGoodsList"
                  >
                  </el-button>
               </el-input>
            </el-col>
            <el-col :span="3">
               <el-button type="primary" @click="addGoods">添加商品</el-button>
            </el-col>
         </el-row>
         <!--表格-->
         <el-table :data="goodsList" border style="width: 100%" class="goodsList" v-loading="loading">
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
            <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
            <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
            <el-table-column label="创建时间" prop="add_time" width="140px">
               <template slot-scope="scope">
                  {{scope.row.add_time | dataFormat}}
               </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
               <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                  <el-button type="danger"
                             icon="el-icon-delete"
                             size="mini"
                             @click="removeGoodClick(scope.row.goods_id)"
                  ></el-button>
               </template>
            </el-table-column>
         </el-table>
         <!--分页-->
         <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :page-sizes="[10, 20, 30, 40]"
                 :current-page="this.pagenum"
                 :page-size="this.pagesize"
                 layout="total, sizes, prev, pager, next, jumper"
                 :total="this.total">
         </el-pagination>
      </el-card>
   </div>
</template>

<script>
  import {getGoodsListData, removeGoods} from "../../../network/request_Fn/contentMain";

  export default {
    name: "goods",
    data() {
      return {
        loading: true,
        goodsList: [],
        query: '',//查询参数
        pagenum: 1,//当前页码
        pagesize: 10,//每页显示条数
        total: null //总条数
      }
    },
    //过滤器，定义时间过滤器
    filters: {
      dataFormat: function (value) {
        //创建时间对象
        const date = new Date(value);
        //年月日
        const y = date.getFullYear();
        // padStart(2, '0') 不足两位数用0补充
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        //时分秒
        const hh = date.getHours().toString().padStart(2, '0');
        const mm = date.getMinutes().toString().padStart(2, '0');
        const ss = date.getSeconds().toString().padStart(2, '0');
        //返回的时间格式
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
      }
    },
    mounted() {
      this.getGoodsList();
    },
    methods: {
      getGoodsList() {
        getGoodsListData(this.query, this.pagenum, this.pagesize).then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.goodsList = res.data.goods;
            this.total = res.data.total;
            this.pagenum = Number(res.data.pagenum);
            this.loading = false
          } else {
            this.$message.error('商品列表数据请求失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //当每页大小发生改变时触发
      handleSizeChange(val) {
        //当前的每页大小
        this.pagesize = val;
        this.getGoodsList()
      },
      //当页码发生改变时触发
      handleCurrentChange(val) {
        this.pagenum = val;
        this.getGoodsList()
      },
      //点击添加商品
      addGoods() {
        this.$router.push('/addGoods')
      },
      //删除商品
      removeGoodClick(id) {
        this.$confirm('此操作将永久删除该商品，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeGoods(id).then(res => {
            if (res.meta.status === 200) {
              this.$message.success('删除成功');
              this.getGoodsList()
            } else {
              this.$message.error('删除失败')
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
        })

      }
    }
  }
</script>

<style scoped>
   .goodsList {
      font-size: 12px;
   }
</style>
