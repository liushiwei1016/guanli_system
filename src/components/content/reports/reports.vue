<template>
   <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>数据统计</el-breadcrumb-item>
         <el-breadcrumb-item>统计报表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
         <!-- 一，准备展示的容器-->
         <div id="myECharts" style="width: 100%;height: 500px"></div>
      </el-card>
   </div>
</template>

<script>
  import {getReportsData} from "../../../network/request_Fn/contentMain";
  //二，导入echarts插件
  import echarts from 'echarts'
  import _ from 'lodash'

  export default {
    name: "reports",
    data() {
      return {
        datalist: {},
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#141440'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        },
      }
    },
    created() {

    },
    mounted() {
      this.getReports();
    },
    methods: {
      ceshi() {
        // 三，创建echarts实例
        var myEcharts = echarts.init(document.getElementById('myECharts'));
        // 四，设置配置项（ _.merge 是用来合并对象的）
        var result = _.merge(this.datalist, this.options);
        // 五，展示数据
        myEcharts.setOption(result)
      },
      getReports() {
        getReportsData().then(res => {
          if (res.meta.status === 200) {
            this.datalist = res.data;
            this.ceshi()
          } else {
            this.$message.error('数据请求失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },

    }
  }
</script>

<style scoped>

</style>
