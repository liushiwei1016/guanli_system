<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

      <!--警告-->
      <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          :closable="false"
          show-icon>
      </el-alert>

      <!--级联选择器-->
      <el-row class="cat_box">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
              v-model="selectCateKeys"
              :options="cateList"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
              clearable
              @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!--tab切换页-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--动态参数-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     size="mini"
                     @click="addDialogTableVisible = true"
          >添加参数
          </el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                    v-for="(item,index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="handleClose(index,scope.row)"
                >
                  {{item}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="serParamsClick(scope.row.attr_id)"
                >编辑
                </el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="removeParmasClick(scope.row.attr_id)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--静态属性-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     size="mini"
                     @click="addDialogTableVisible = true"
          >添加属性
          </el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                      v-for="(item,index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="handleClose(index,scope.row)"
                  >
                    {{item}}
                  </el-tag>
                  <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else
                             class="button-new-tag"
                             size="small"
                             @click="showInput(scope.row)">
                    + New Tag
                  </el-button>
                </template>
              </el-table-column>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="serParamsClick(scope.row.attr_id)"
                >编辑
                </el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="removeParmasClick(scope.row.attr_id)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数对话框-->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogTableVisible" @close="hiddenAddForm">
      <el-form :model="addFormData" :rules="addFormRules" ref="addFormRefs" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改参数对话框-->
    <el-dialog :title="'修改'+titleText" :visible.sync="setDialogTableVisible" @close="hiddenSetForm">
      <el-form :model="setFormData" :rules="setFormRules" ref="setFormRefs" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="setFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getGoodCateGoriesData,
    getParamsData,
    addFormData,
    idGetParamsData,
    submitParamsData,
    removeParamsList,
    addTagParamsData
  } from "../../../network/request_Fn/contentMain";

  export default {
    name: "params",
    data() {
      return {
        cateList: [],
        selectCateKeys: [],
        activeName: 'many',
        //动态参数数据
        manyTableData: [],
        //静态属性数据
        onlyTableData: [],
        //添加参数对话框
        addDialogTableVisible: false,
        //添加参数弹框的表单数据对象
        addFormData: {
          attr_name: ''
        },
        //添加表单验证
        addFormRules: {
          attr_name: [
            {required: true, message: '请输入参数名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
        },
        //修改编辑对话框
        setDialogTableVisible: false,
        //修改编辑弹框的表单数据对象
        setFormData: {
          attr_name: ''
        },
        //修改编辑表单验证
        setFormRules: {
          attr_name: [
            {required: true, message: '请输入参数名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
        },
        //根据 ID 查询的参数
        getParamsData: {},
        //属性ID
        attrid: null,
        // inputVisible: false,
        // inputValue: ''
      }
    },
    computed: {
      //判断按钮是否禁用
      isBtnDisabled() {
        if (this.selectCateKeys.length === 3) {
          return false
        } else {
          return true
        }
      },
      //获取分类ID
      getCate_id() {
        if (this.selectCateKeys.length === 3) {
          return Number(this.selectCateKeys[2])
        } else {
          return null
        }
      },
      //动态弹窗标题
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        } else {
          return '静态属性'
        }
      }
    },
    mounted() {
      this.getCateList()
    },
    methods: {
      //获取商品分类列表
      getCateList() {
        getGoodCateGoriesData().then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.cateList = res.data;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      //获取参数列表数据
      getParamsList() {
        getParamsData(this.getCate_id, this.activeName).then(res => {
          console.log(res);
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
            // //添加tag标签是输入框还是添加按钮
            item.inputVisible = false;
            // //添加tag标签输入框默认值
            item.inputValue = ''
          })
          if (res.meta.status === 200) {
            if (this.activeName === 'many') {
              this.manyTableData = res.data;
            } else {
              this.onlyTableData = res.data
            }
          } else {
            this.$message.error('参数数据获取失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },

      //联级选择器选中项发生变化时触发
      handleChange() {
        //证明选中的不是三级分类
        if (this.selectCateKeys.length !== 3) {
          this.selectCateKeys = [];
          this.manyTableData = [];
          this.onlyTableData = [];
        } else {
          this.getParamsList()
        }

      },

      //tab 被选中时触发
      handleClick() {
        this.getParamsList()
      },

      //点击添加确定提交
      submitAddForm() {
        this.addDialogTableVisible = false;
        this.$refs.addFormRefs.validate((valid) => {
          if (valid) {
            addFormData(this.getCate_id, this.addFormData.attr_name, this.activeName).then(res => {
              console.log(res);
              if (res.meta.status === 201) {
                this.$message.success('添加成功');
                this.getParamsList()
              } else {
                this.$message.error('添加失败')
              }
            }).catch(err => {
              console.log(err);
            })
          }
        })
      },

      //关闭添加弹框
      hiddenAddForm() {
        this.$refs.addFormRefs.resetFields();
      },

      //点击编辑按钮
      serParamsClick(attr_id) {
        this.attrid = attr_id;
        idGetParamsData(this.getCate_id, attr_id, this.activeName).then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.setDialogTableVisible = true;
            this.setFormData = res.data;
          } else {
            this.$message.error('数据获取失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },

      //关闭修改编辑弹框
      hiddenSetForm() {
        this.$refs.setFormRefs.resetFields();
      },

      //点击修改编辑确定提交
      submitSetForm() {
        this.setDialogTableVisible = false;
        submitParamsData(this.getCate_id, this.attrid, this.setFormData.attr_name, this.activeName).then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.$message.success('修改成功');
            this.getParamsList()

          } else {
            this.$message.error('修改失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },

      //删除参数
      removeParmasClick(attr_id) {
        this.$confirm('该操作将永久删除此参数，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeParamsList(this.getCate_id, attr_id).then(res => {
            if (res.meta.status === 200) {
              this.$message.success('删除成功');
              this.getParamsList()
            } else {
              this.$message.error('删除失败')
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
        })
      },

      //将对 attr_vals 的操作保存到数据库
      saveAttrVals(row) {
        const id = this.getCate_id;
        const attr_id = row.attr_id;
        const attr_name = row.attr_name;
        const attr_sel = row.attr_sel;
        const attr_vals = row.attr_vals.join(',');
        addTagParamsData(id, attr_id, attr_name, attr_sel, attr_vals).then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.$message.success('添加成功')
          } else {
            this.$message.error('添加失败' + res.meta.msg)
          }
        }).catch(err => {
          console.log(err);
          this.$message.error('请求接口报错，请联系管理员')
        })
      },

      // 添加tag标签失去焦点或点击回车
      handleInputConfirm(row) {
        row.inputVisible = false;
        /*trim() 是除掉左右空格*/
        if (row.inputValue.trim().length === 0) {
          row.inputValue = '';
          row.inputVisible = false;
        } else {
          row.attr_vals.push(row.inputValue.trim());
          row.inputValue = '';
          row.inputVisible = false;
          this.saveAttrVals(row)
        }
      },
      //点击添加tag标签显示输入框
      showInput(row) {
        row.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      //删除tag标签
      handleClose(index, row) {
        row.attr_vals.splice(index, 1)
        this.saveAttrVals(row)
      },
    }
  }
</script>

<style scoped>
  .cat_box {
    margin: 20px 0;
  }

  .el-tag + .el-tag {
    margin: 5px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: middle;
  }
</style>
