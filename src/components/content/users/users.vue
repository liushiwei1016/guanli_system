<template>
   <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>用户管理</el-breadcrumb-item>
         <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
         <!--搜索添加-->
         <el-row :gutter="20">
            <el-col :span="9">
               <el-input placeholder="请输入内容"
                         v-model="requestInfo.query"
                         clearable
                         @clear="getUserListData"
               >
                  <el-button slot="append"
                             icon="el-icon-search"
                             @click="getUserListData"
                  ></el-button>
               </el-input>
            </el-col>
            <el-col :span="4">
               <el-button type="primary" @click="AddFormVisible = true">添加用户</el-button>
            </el-col>
         </el-row>

         <!--用户列表渲染-->
         <el-table :data="responseData.users" style="width: 100%" border v-loading="loading">
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column prop="username" label="姓名" align="center"></el-table-column>
            <el-table-column prop="email" label="邮箱" align="center" width="180px"></el-table-column>
            <el-table-column prop="mobile" label="电话" align="center" width="150px"></el-table-column>
            <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
            <el-table-column label="状态" align="center" width="100">
               <template slot-scope="scope">
                  <el-switch v-model="scope.row.mg_state" @change="updataUserState(scope.row)"></el-switch>
               </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
               <template slot-scope="scope">
                  <el-tooltip placement="top" content="修改" :enterable="false">
                     <el-button type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showModifyVisible(scope.row.id)">
                     </el-button>
                  </el-tooltip>
                  <el-tooltip placement="top" content="删除" :enterable="false">
                     <el-button type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="deleteUser(scope.row.id)">
                     </el-button>
                  </el-tooltip>
                  <el-tooltip placement="top" content="分配角色" :enterable="false">
                     <el-button type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="setRoles(scope.row)">
                     </el-button>
                  </el-tooltip>
               </template>
            </el-table-column>
         </el-table>

         <!--分页-->
         <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page="requestInfo.pagenum"
                 :page-sizes="[2, 4, 6, 8,10]"
                 :page-size="requestInfo.pagesize"
                 layout="total, sizes, prev, pager, next, jumper"
                 :total="responseData.totalpage">
         </el-pagination>

         <!--点击添加用户弹出对话框-->
         <el-dialog title="添加用户" :visible.sync="AddFormVisible" @close="addDialogClose">
            <el-form :model="addForm" ref="addFormRef" label-width="100px" class="demo-dynamic">
               <el-form-item
                       prop="username"
                       label="用户名"
                       :rules="addRules.username"
               >
                  <el-input v-model="addForm.username"></el-input>
               </el-form-item>
               <el-form-item
                       prop="password"
                       label="密码"
                       :rules="addRules.password"
               >
                  <el-input v-model="addForm.password"></el-input>
               </el-form-item>
               <el-form-item
                       prop="email"
                       label="邮箱"
                       :rules="addRules.email"
               >
                  <el-input v-model="addForm.email"></el-input>
               </el-form-item>
               <el-form-item
                       prop="mobile"
                       label="电话"
                       :rules="addRules.mobile"
               >
                  <el-input v-model="addForm.mobile"></el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
               <el-button @click="AddFormVisible=false">取 消</el-button>
               <el-button type="primary" @click="submitFormt">确 定</el-button>
            </div>
         </el-dialog>

         <!--点击修改按钮弹出对话框-->
         <el-dialog title="修改用户信息" :visible.sync="ModifyFormVisible" @close="ModifyDialogClose">
            <el-form :model="ModifyForm" ref="ModifyFormRef" label-width="100px">
               <el-form-item
                       prop="username"
                       label="用户名"
               >
                  <el-input v-model="ModifyForm.username" disabled></el-input>
               </el-form-item>
               <el-form-item
                       prop="email"
                       label="邮箱"
                       :rules="ModifyFormRules.email"
               >
                  <el-input v-model="ModifyForm.email"></el-input>
               </el-form-item>
               <el-form-item
                       prop="mobile"
                       label="电话"
                       :rules="ModifyFormRules.mobile"
               >
                  <el-input v-model="ModifyForm.mobile"></el-input>
               </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
               <el-button @click="ModifyFormVisible=false">取 消</el-button>
               <el-button type="primary" @click="submitFormModify">确 定</el-button>
            </div>
         </el-dialog>

         <!--点击分配角色弹出对话框-->
         <el-dialog title="分配用户角色" :visible.sync="SetRoleVisible" @close="SetRoleDialogClose">
            <div class="SetRole_box">
               <div>当前用户：{{infoData.username}}</div>
               <div>当前角色：{{infoData.role_name}}</div>
               <div>
                  <span>分配新角色：</span>
                  <el-select v-model="selectId" placeholder="请选择" size="small">
                     <el-option v-for="item in allRoles"
                                :key="item.id"
                                :value="item.id"
                                :label="item.roleName">
                     </el-option>
                  </el-select>
               </div>
            </div>
            <div slot="footer" class="dialog-footer">
               <el-button @click="SetRoleVisible=false">取 消</el-button>
               <el-button type="primary" @click="submitSetRole">确 定</el-button>
            </div>
         </el-dialog>
      </el-card>
   </div>
</template>

<script>
  import {
    UserListData,
    UpdataUserState,
    AddUserInfo,
    IdGetUserData,
    ModifyUserData,
    DeleteUser,
    getRolesData,
    FenpeiRole
  } from "../../../network/request_Fn/contentMain";

  export default {
    name: "users",
    data() {
      //添加用户自定义验证邮箱
      var checkEmail = (rule, value, callback) => {
        const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (regEmail.test(value)) {
          return callback()
        } else {
          callback(new Error('请输入正确的邮箱'))
        }
      };
      //添加用户自定义验证电话
      var checkTel = (rule, value, callback) => {
        const regTel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (regTel.test(value)) {
          return callback()
        } else {
          callback(new Error('请输入正确的电话'))
        }
      };
      //修改用户信息自定义验证邮箱
      var checkModifyEmail = (rule, value, callback) => {
        const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (regEmail.test(value)) {
          return callback()
        } else {
          callback(new Error('请输入正确的邮箱'))
        }
      };
      //修改用户信息自定义验证电话
      var checkModifyMobile = (rule, value, callback) => {
        const regTel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (regTel.test(value)) {
          return callback()
        } else {
          callback(new Error('请输入正确的电话'))
        }
      };
      return {
        //请求数据
        requestInfo: {
          query: '',//查询参数
          pagenum: 1,//当前页码
          pagesize: 4//	每页显示条数
        },
        //响应数据
        responseData: {
          totalpage: null,//总记条数
          pagenum: null,//当前页码
          users: [] //用户数据
        },
        //添加对话框默认值
        AddFormVisible: false,
        //修改对话框默认值
        ModifyFormVisible: false,
        //分配权限对话框默认值
        SetRoleVisible: false,
        //点击修改对话框的姓名
        ModifyForm: {},
        //添加用户表单数据
        addForm: {
          username: '',
          email: '',
          password: '',
          mobile: ''
        },
        //添加用户表单验证
        addRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '请输入3至10位用户名', trigger: 'blur'}
          ],
          email: [
            {required: false, validator: checkEmail, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 12, message: '请输入6至12位字符', trigger: 'blur'}
          ],
          mobile: [
            {required: false, validator: checkTel, trigger: 'blur'}
          ]
        },
        //添加修改用户信息表单验证
        ModifyFormRules: {
          email: [
            {required: false, validator: checkModifyEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: false, validator: checkModifyMobile, trigger: 'blur'}
          ]
        },
        infoData: '',
        //所有角色
        allRoles: [],
        //已选中角色ID
        selectId: '',
        loading: true
      }
    },
    created() {
      this.getUserListData();
    },
    methods: {
      //获取用户列表数据
      getUserListData() {
        UserListData(this.requestInfo.query, this.requestInfo.pagenum, this.requestInfo.pagesize).then(res => {
          if (res.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: res.meta.msg
            })
          } else {
            this.responseData.totalpage = res.data.total;
            this.responseData.pagenum = res.data.pagenum;
            this.responseData.users = res.data.users;
            this.loading = false
          }
        })
      },
      //监听每页显示的条数
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.requestInfo.pagesize = val;
        //当显示条数发生变化时重新请求接口
        this.getUserListData()
      },
      //监听当前页码值变化
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.requestInfo.pagenum = val;
        //当页码发生变化时重新请求接口
        this.getUserListData()
      },
      //修改状态
      updataUserState(userInfo) {
        // console.log(userInfo);
        UpdataUserState(userInfo.id, userInfo.mg_state).then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            this.$message.error('状态修改失败，' + res.meta.msg)
          } else {
            this.$message.success('状态修改成功')
          }
        })
      },
      //关闭添加用户对话框重置表单
      addDialogClose() {
        this.$refs.addFormRef.resetFields();
      },
      //点击确定添加用户
      submitFormt() {
        this.$refs.addFormRef.validate((valid) => {
          console.log(valid)
          if (valid) {
            this.AddFormVisible = false;
            AddUserInfo(this.addForm).then(res => {
              console.log(res);
              if (res.meta.status !== 201) {
                this.$message.error(res.meta.msg)
              } else {
                this.$message.success('添加成功');
                this.getUserListData()
              }
            }).catch(err => {
              console.log(err);
            })
          }
        })
      },
      //点击修改按钮弹出对话框
      showModifyVisible(id) {
        this.ModifyFormVisible = true;
        IdGetUserData(id).then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error('修改信息访问失败！')
          } else {
            this.ModifyForm = res.data
          }
        })
      },
      //关闭修改用户对话框重置表单
      ModifyDialogClose() {
        this.$refs.ModifyFormRef.resetFields()
      },
      //确定提交修改用户信息
      submitFormModify() {
        const id = this.ModifyForm.id;
        const email = this.ModifyForm.email;
        const mobile = this.ModifyForm.mobile;
        ModifyUserData(id, email, mobile).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("更新用户信息成功");
            //刷新列表
            this.getUserListData()
          } else {
            this.$message.error("更新用户信息失败")
          }
        }).catch(err => {
          console.log(err);
        });
        //关闭对话框
        this.ModifyFormVisible = false
      },
      //删除单个用户
      deleteUser(id) {
        this.$confirm("是否删除该用户信息，删除后将无法恢复?", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "warning"
        }).then(() => {
          DeleteUser(id).then(res => {
            console.log(res);
            if (res.meta.status === 200) {
              this.getUserListData();
              this.$message.success('删除成功');
            } else {
              this.$message.error('删除失败')
            }
          }).catch(err => {
            console.log(err);
          })
        })
      },
      //点击分配角色
      setRoles(rowData) {
        this.infoData = rowData;
        this.SetRoleVisible = true;
        //获取角色列表
        getRolesData().then(res => {
          if (res.meta.status === 200) {
            console.log(res.data);
            this.allRoles = res.data
          } else {
            this.$message.error('角色数据获取失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //分配角色点击确定
      submitSetRole() {
        this.SetRoleVisible = false;
        if (this.selectId) {
          FenpeiRole(this.infoData.id, this.selectId).then(res => {
            console.log(res);
            if (res.meta.status === 200) {
              this.$message.success("角色分配成功");
              this.getUserListData()
            } else {
              this.$message.error(res.meta.msg)
            }
          }).catch(err => {
            console.log(err);
          })
        } else {
          this.$message.warning('请选择角色')
        }
      },
      //关闭分配角色弹框
      SetRoleDialogClose() {
        this.selectId = ''
      }
    }
  }
</script>

<style scoped>
   .SetRole_box > div {
      margin: 10px 0;
   }
</style>
