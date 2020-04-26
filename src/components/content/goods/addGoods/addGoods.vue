<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon>
      </el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRefs" label-width="100px" label-position="top">
        <el-tabs tab-position="left"
                 v-model="activeIndex"
                 :before-leave="beforeTableave"
                 @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="propsCate"
                  expandTrigger="hover"
                  @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {getGoodCateGoriesData, getParamsData} from "network/request_Fn/contentMain";

  export default {
    name: "addGoods",
    data() {
      return {
        activeIndex: 0,
        //表单数据
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          //商品所属的分类数组
          goods_cat: []
        },
        //验证规则
        addFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'}
          ],
          goods_cat: [
            {required: true, message: '请选择商品分类', trigger: 'blur'}
          ],
        },
        //商品分类数据
        cateList: [],
        propsCate: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //动态参数列表数据
        manyTabData:{}
      }
    },

    computed: {
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        } else {
          return null
        }
      }
    },

    mounted() {
      this.getGoodCateGoriesList()
    },

    methods: {
      getGoodCateGoriesList() {
        getGoodCateGoriesData().then(res => {
          this.cateList = res.data
        }).catch(err => {
          console.log(err);
          this.message.error('接口请求失败！')
        })
      },

      //级联选择器选中项发生变化时触发
      handleChange() {
        console.log(this.addForm.goods_cat);
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },

      //tabs标签页跳转时触发 activeName 即将进入的，oldActiveName 即将离开的
      beforeTableave(activeName, oldActiveName) {
        console.log(oldActiveName)
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },

      //tab 被选中时触发
      tabClicked() {
        console.log(this.cateId);
        if (this.activeIndex === '1') {
          getParamsData(this.cateId, 'many').then(res => {
            this.manyTabData = res.data
          }).catch(err => {
            console.log(err);
            this.$message.error('接口请求失败！')
          })
        }
      }
    }

  }
</script>

<style scoped>

</style>
