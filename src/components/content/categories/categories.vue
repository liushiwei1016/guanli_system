<template>
   <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>商品管理</el-breadcrumb-item>
         <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
         <!--添加分类按钮-->
         <el-button type="primary" @click="addCateClick">添加分类</el-button>
         <!--表格-->
         <tree-table class="treeTabe"
                     :data="categoriesList"
                     :columns="columns"
                     show-index
                     index-text="#"
                     :expand-type="false"
                     border
                     :selection-type="false"
                     v-loading="loading"
         >
            <!--是否有效-->
            <template slot="isok" slot-scope="scope">
               <i class="el-icon-success"
                  v-if="scope.row.cat_deleted===false"
                  style="color: lightseagreen;font-size: 16px"
               ></i>
               <i class="el-icon-error"
                  v-else
                  style="color: red;font-size: 16px"
               ></i>
            </template>
            <!--排序-->
            <template slot="paixu" slot-scope="scope">
               <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
               <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
               <el-tag v-else type="warning">三级</el-tag>
            </template>
            <!--操作-->
            <template slot="caozuo" slot-scope="scope">
               <el-button type="primary"
                          icon="el-icon-edit"
                          size="mini"
                          @click="setCate(scope.row.cat_id)"
               >
               </el-button>
               <el-button type="danger"
                          icon="el-icon-delete"
                          size="mini"
                          @click="removeCateList(scope.row.cat_id)">
               </el-button>
            </template>
         </tree-table>
         <!--分页-->
         <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page="queryInfo.pagenum"
                 :page-sizes="[5, 10, 15, 20]"
                 :page-size="queryInfo.pagesize"
                 layout="total, sizes, prev, pager, next, jumper"
                 :total="total">
         </el-pagination>
         <!--添加分类弹框-->
         <el-dialog title="添加分类" :visible.sync="dialogFormVisible" @close="hiddenAddCate">
            <el-form :model="addCateFrom" :rules="rules" ref="ruleForm">
               <el-form-item label="分类名称：" prop="cat_name" label-width="100px">
                  <el-input v-model="addCateFrom.cat_name"></el-input>
               </el-form-item>
               <el-form-item label="父级分类：" label-width="100px">
                  <!-- options 用来指定数据源 -->
                  <!-- props 用来指定配置对象 -->
                  <el-cascader
                          v-model="selectKeys"
                          :props="cateProps"
                          expand-trigger="hover"
                          :options="parentOption"
                          clearable
                          change-on-select
                          @change="handleChange">
                  </el-cascader>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
               <el-button @click="dialogFormVisible = false">取 消</el-button>
               <el-button type="primary" @click="submitAdd">确 定</el-button>
            </div>
         </el-dialog>
         <!--编辑弹框-->
         <el-dialog title="编辑分类" :visible.sync="setFormVisible" @close="hiddenSetCate">
            <el-form :model="idGetData" :rules="rules" ref="ruleForm">
               <el-form-item label="分类名称：" prop="cat_name" label-width="100px">
                  <el-input v-model="idGetData.cat_name"></el-input>
               </el-form-item>
               <el-form-item label="父级分类：" label-width="100px">
                  <!-- options 用来指定数据源 -->
                  <!-- props 用来指定配置对象 -->
                  <el-cascader
                          v-model="selectKeys"
                          :props="cateProps"
                          expand-trigger="hover"
                          :options="parentOption"
                          clearable
                          change-on-select
                          @change="handleChange">
                  </el-cascader>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
               <el-button @click="setFormVisible = false">取 消</el-button>
               <el-button type="primary" @click="submitset">确 定</el-button>
            </div>
         </el-dialog>
      </el-card>
   </div>
</template>

<script>
  import {
    getGoodCateGoriesData,
    getParentCateData,
    addCate,
    removeCate,
    idGetCate,
    submitCate
  } from "../../../network/request_Fn/contentMain";

  export default {
    name: "categories",
    data() {
      return {
        loading: true,
        //请求商品分类参数
        queryInfo: {
          type: 3,
          pagenum: 1,//当前页码
          pagesize: 5 //每页显示条数
        },
        total: null,
        categoriesList: [],
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            //将这一列定义为模板列
            type: 'template',
            //模板名称
            template: 'isok',
            width: '120px',
            align: 'center',
            headerAlign: 'center'
          },
          {
            label: '排序',
            prop: 'cat_level',
            //将这一列定义为模板列
            type: 'template',
            //模板名称
            template: 'paixu',
            width: '120px',
            align: 'center',
            headerAlign: 'center'
          },
          {
            label: '操作',
            //将这一列定义为模板列
            type: 'template',
            //模板名称
            template: 'caozuo',
            width: '150px',
            align: 'center',
            headerAlign: 'center'
          }
        ],
        //弹框默认值
        dialogFormVisible: false,
        options: [],
        //表单验证
        rules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ]
        },
        //父级分类列表数据
        parentOption: [],
        //指定级联选择器的配置对象(这是旧版语法，新版语法见“分类参数页（params）”)
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //选中父级分类的id数组
        selectKeys: [],
        //添加分类表单数据对象
        addCateFrom: {
          cat_name: '',//分类名称
          cat_pid: 0,//分类父id
          cat_level: 0 //分类层级
        },
        //编辑弹框默认值
        setFormVisible: false,
        //点击编辑根据ID查询到的数据
        idGetData: {}
      }
    },
    mounted() {
      this.getGoodCateGoriesList()
    },
    methods: {
      //获取商品分类数据
      getGoodCateGoriesList() {
        getGoodCateGoriesData(this.queryInfo.type, this.queryInfo.pagenum, this.queryInfo.pagesize).then(res => {
          if (res.meta.status === 200) {
            this.total = res.data.total;
            this.categoriesList = res.data.result;
            this.loading = false
          } else {
            this.$message.error('商品分类数据获取失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      handleSizeChange(val) {
        this.queryInfo.pagesize = val;
        this.getGoodCateGoriesList()
      },
      handleCurrentChange(val) {
        this.queryInfo.pagenum = val;
        this.getGoodCateGoriesList()
      },
      //点击添加分类
      addCateClick() {
        this.getParentCateList();
        this.dialogFormVisible = true;
      },
      //获取父级分类列表
      getParentCateList() {
        getParentCateData(2).then(res => {
          if (res.meta.status === 200) {
            this.parentOption = res.data
          } else {
            this.$message.error('父级分类列表获取失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //级联选择器选择项发送变化时触发
      handleChange() {
        //如果 selectKeys 数组大于0，说明选择了父级分类，反之没有选择
        if (this.selectKeys.length > 0) {
          this.addCateFrom.cat_pid = this.selectKeys[this.selectKeys.length - 1];
          this.addCateFrom.cat_level = this.selectKeys.length;
        } else {
          this.addCateFrom.cat_pid = 0;
          this.addCateFrom.cat_level = 0;
        }
      },
      //点击确定提交
      submitAdd() {
        const cat_name = this.addCateFrom.cat_name;
        const cat_pid = this.addCateFrom.cat_pid;
        const cat_level = this.addCateFrom.cat_level;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            addCate(cat_pid, cat_name, cat_level).then(res => {
              if (res.meta.status === 201) {
                this.dialogFormVisible = false;
                this.getGoodCateGoriesList();
                this.$message.success('添加成功');
              } else {
                this.$message.error('添加失败')
              }
            }).catch(err => {
              console.log(err);
            })
          } else {
            this.$message.error('您输入的表单数据有误！')
          }
        })
      },
      //关闭添加分类弹窗清空表单数据
      hiddenAddCate() {
        this.$refs.ruleForm.resetFields();
        this.selectKeys = [];
        this.addCateFrom.cat_level = 0;
        this.addCateFrom.cat_pid = 0;
      },
      //点击删除分类
      removeCateList(id) {
        this.$confirm('该操作将永久删除此分类，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeCate(id).then(res => {
            console.log(res);
            if (res.meta.status === 200) {
              this.$message.success('删除成功');
              this.getGoodCateGoriesList()
            } else {
              this.$message.error('删除失败')
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
        });
      },
      //点击编辑显示弹框
      setCate(id) {
        this.getParentCateList();
        idGetCate(id).then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.idGetData = res.data;
            this.setFormVisible = true;
            //将获取到的父级分类id赋值给选中父级分类的id数组
            this.selectKeys = res.data.cat_pid
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //点击确定编辑
      submitset() {
        this.setFormVisible = false;
        submitCate(this.idGetData.cat_id, this.idGetData.cat_name).then(res => {
          if (res.meta.status === 200) {
            this.$message.success('编辑成功');
            this.getGoodCateGoriesList()
          } else {
            this.$message.error('编辑失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //关闭编辑弹框清空表单数据
      hiddenSetCate() {
      }
    }
  }
</script>

<style lang="scss" scoped>
   .treeTabe {
      margin: 20px 0;
   }

   .el-cascader {
      width: 100%;
   }
</style>
