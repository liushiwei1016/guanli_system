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
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name"
                          v-for="item in manyTabData"
                          :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border
                             size="mini"
                             :label="item1" v-for="(item1,index) in item.attr_vals"
                             :key="index">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyTabData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                action="http://47.115.124.102:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headersObj"
                :on-success="handleSuccess"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4" class="goodsContent">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!--图片预览对话框-->
      <el-dialog class="previewBox" title="图片预览" :visible.sync="previewVisible" width="50%">
        <img :src="previewPath" class="previewImg" alt="">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {getGoodCateGoriesData, getParamsData, addGoos} from "network/request_Fn/contentMain";

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
          goods_cat: [],
          pics: [],
          goods_introduce: '',
          attrs: []
        },
        cloneAddForm: {},
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
        manyTabData: [],
        //静态参数列表数据
        onlyTabData: [],
        //上传图片接口的请求头(因为图片上传接口没有走axios，所以请求头里面没有token值，需要手动添加)
        headersObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        //预览图片路径
        previewPath: '',
        //图片预览对话框默认隐藏
        previewVisible: false
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
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },

      //tabs标签页跳转时触发 activeName 即将进入的，oldActiveName 即将离开的
      beforeTableave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },

      //tab 被选中时触发
      tabClicked() {
        if (this.activeIndex === '1') {
          getParamsData(this.cateId, 'many').then(res => {
            if (res.meta.status === 200) {
              res.data.forEach(item => {
                item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
              })
              this.manyTabData = res.data
            } else {
              this.$message.error('数据获取失败！')
            }
          }).catch(err => {
            console.log(err);
            this.$message.error('接口请求失败！')
          })
        } else if (this.activeIndex === '2') {
          getParamsData(this.cateId, 'only').then(res => {
            if (res.meta.status === 200) {
              this.onlyTabData = res.data
              console.log(this.onlyTabData);
            } else {
              this.$message.error('数据获取失败！')
            }

          }).catch(err => {
            console.log(err);
            this.$message.error('接口请求失败！')
          })
        }
      },
      //处理图片预览效果
      handlePreview(file) {
        console.log(file);
        this.previewVisible = true
        this.previewPath = file.response.data.url
      },
      //处理图片移除
      handleRemove(file) {
        //1、获取将要删除的图片临时路径
        const removePath = file.response.data.tmp_path
        //2、从 pics 图片数组中查找到要删除图片的索引值
        const index = this.addForm.pics.findIndex(res => {
            return res.pic === removePath
          }
        )
        //3、通过 splice 方法删除
        this.addForm.pics.splice(index, 1)
        console.log(this.addForm.pics)
      },
      //监听图片上传成功
      handleSuccess(response) {
        //1、拼接得到一个图片信息对象
        const imgObj = {pic: response.data.tmp_path}
        //2、将图片信息 push 到 pics 数组中
        this.addForm.pics.push(imgObj)
      },
      //添加商品按钮
      addGoods() {
        this.$refs.addFormRefs.validate(valid => {
          if (valid) {
            // this.cloneAddForm = this.addForm
            // this.cloneAddForm.goods_cat = this.cloneAddForm.goods_cat.join(',')
            this.addForm.goods_cat = this.addForm.goods_cat.join(',')
            //处理动态参数
            console.log(this.manyTabData);
            console.log(this.onlyTabData);
            this.manyTabData.forEach(item => {
              const newInfo = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals
              }
              this.addForm.attrs.push(newInfo)
            })
            //处理静态参数
            this.onlyTabData.forEach(item => {
              const newInfo = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals
              }
              this.addForm.attrs.push(newInfo)
            })
            addGoos(this.addForm).then(res => {
              console.log(res);
              if(res.meta.status===201){
                this.$message.success('添加成功')
                this.$router.push('/goods')
              }
            }).catch(err => {
              console.log(err)
              this.$message.error('接口请求失败，请联系管理员')
            })
            console.log(this.addForm)
          } else {
            this.$message.error('请填写表单必要项')
          }
        })
      }
    }

  }
</script>

<style scoped>
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .previewImg {
    width: 100%;
  }

  .addBtn {
    margin-top: 15px;
  }

  .goodsContent /deep/ .ql-container {
    min-height: 300px;
  }
</style>
