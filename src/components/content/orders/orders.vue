<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索框-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容"
                    v-model="ordersInfo.query"
                    clearable
                    @clear="getOrdersListData"
          >
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getOrdersListData"
            >
            </el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="ordersData.goods" stripe border>
        <el-table-column label="#" type="index" align="center" width="50"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="150" align="center"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === 1" type="success" size="small">已付款</el-tag>
            <el-tag v-else type="danger" size="small">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="170" align="center">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyAddress"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="logisticsClick"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ordersInfo.pagenum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="ordersInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ordersData.total">
      </el-pagination>

      <!--修改地址对话框-->
      <el-dialog title="修改地址" :visible.sync="addressFormVisible" @close="addressFormClose">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRefs" label-width="100px">
          <el-form-item label="省市区/县" prop="city">
            <el-cascader
                v-model="addressForm.city"
                :options="citydata"
                :props="propCity"
                expandTrigger="hover"
                @change="handleCityChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailedAddress">
            <el-input v-model="addressForm.detailedAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addressFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <!--查看物流对话框-->
      <el-dialog title="查看物流信息" :visible.sync="wuliuInfoVisible">
        <!--时间线-->
        <el-timeline>
          <el-timeline-item
              v-for="(item, index) in wuliuInfo"
              :key="index"
              :timestamp="item.time">
            {{item.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {getOrdersData, getWuliuInfo} from "network/request_Fn/contentMain";
  import citydata from './citydata'

  export default {
    name: "orders",
    data() {
      return {
        //请求数据
        ordersInfo: {
          query: '',
          //当前页码
          pagenum: 1,
          //每页显示条数
          pagesize: 10
        },
        ordersData: {},
        addressForm: {
          city: [],
          detailedAddress: ''
        },
        //地址级联数据
        citydata,
        propCity: {
          value: 'value',
          label: 'label',
          children: 'children'
        },
        wuliuId: '1106975712662',
        wuliuInfo: {},
        wuliuInfoVisible: false,
        addressFormVisible: false,
        addressFormRules: {
          city: [
            {required: true, message: '请选择省市区/县', trigger: 'blur'}
          ],
          detailedAddress: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
        },

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
      this.getOrdersListData()
    },
    methods: {
      //获取订单列表数据
      getOrdersListData() {
        getOrdersData(this.ordersInfo).then(res => {
          if (res.meta.status === 200) {
            this.ordersData = res.data
            console.log(this.ordersData);
          }
        }).catch(err => {
          console.log(err);
          this.$message.error('接口请求失败，请联系管理员')
        })
      },
      //当每页大小发生变化时触发
      handleSizeChange(val) {
        this.ordersInfo.pagesize = val
        this.getOrdersListData()
      },
      //当页码发生变化时触发
      handleCurrentChange(val) {
        this.ordersInfo.pagenum = val
        this.getOrdersListData()
      },
      modifyAddress() {
        this.addressFormVisible = true
      },
      //监听地址变化
      handleCityChange(e) {
        this.addressForm.city = e
      },
      //关闭对话框，清空表单数据
      addressFormClose() {
        this.$refs.addressFormRefs.resetFields()
      },
      //点击查看物流
      logisticsClick() {
        getWuliuInfo(this.wuliuId).then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.wuliuInfo = res.data
            this.wuliuInfoVisible = true
          }

        }).catch(err => {
          console.log(err);
          this.$message.error('接口请求失败，联系管理员')
        })
      }

    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>
