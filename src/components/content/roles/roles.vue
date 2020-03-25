<template>
   <div>
      <!--面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="miaobaoxie">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>权限管理</el-breadcrumb-item>
         <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--角色列表-->
      <el-card>
         <el-button type="primary" @click="addRole">添加角色</el-button>
         <el-table :data="rolesListData" border stripe v-loading="loading">
            <!--折叠栏-->
            <el-table-column type="expand" align="center">
               <template slot-scope="scope">
                  <el-row class="border_x one" v-for="item1 in scope.row.children" :key="item1.id">
                     <!--一级权限-->
                     <el-col :span="4">
                        <el-tag closable @close="removeRoles(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                     </el-col>
                     <!--二级和三级权限-->
                     <el-col :span="20" class="border_two_box">
                        <el-row class="border_x two" v-for="item2 in item1.children" :key="item2.id">
                           <!--二级权限-->
                           <el-col :span="5">
                              <el-tag type="success" closable @close="removeRoles(scope.row,item2.id)">
                                 {{item2.authName}}
                              </el-tag>
                              <i class="el-icon-caret-right"></i>
                           </el-col>
                           <!--三级权限-->
                           <el-col :span="19">
                              <el-row class="three_box" v-for="item3 in item2.children" :key="item3.id">
                                 <el-col class="three">
                                    <el-tag type="warning"
                                            closable
                                            @close="removeRoles(scope.row,item3.id)"
                                    >
                                       {{item3.authName}}
                                    </el-tag>
                                 </el-col>
                              </el-row>
                           </el-col>
                        </el-row>
                     </el-col>
                  </el-row>
               </template>
            </el-table-column>
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
               <template slot-scope="scope">
                  <el-button size="mini"
                             type="primary"
                             icon="el-icon-edit"
                             @click="setRoleClick(scope.row.id)"
                  >
                     编辑
                  </el-button>
                  <el-button size="mini"
                             type="danger"
                             icon="el-icon-delete"
                             @click="romoveRoleClick(scope.row.id)"
                  >
                     删除
                  </el-button>
                  <el-button size="mini"
                             type="warning"
                             icon="el-icon-setting"
                             @click="rolesFEnPei(scope.row)"
                  >
                     分配权限
                  </el-button>
               </template>
            </el-table-column>
         </el-table>
      </el-card>
      <!--分配权限弹框-->
      <el-dialog title="分配权限" :visible.sync="dialogTableVisible" @close="hiddenDialog">
         <el-tree :data="RightsListData"
                  :props="defaultProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :default-checked-keys="defaultCheckedKeys"
                  ref="treeRefs"
         ></el-tree>

         <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
         </div>
      </el-dialog>
      <!--编辑弹框-->
      <el-dialog title="编辑" :visible.sync="setDialogVisible">
         <el-form :model="roleInfo">
            <el-form-item
                    prop="roleName"
                    label="角色名称："
            >
               <el-input v-model="roleInfo.roleName"></el-input>
            </el-form-item>
            <el-form-item
                    prop="roleDesc"
                    label="角色描述："
            >
               <el-input v-model="roleInfo.roleDesc"></el-input>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click="setDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRoles">确 定</el-button>
         </div>
      </el-dialog>
      <!--添加角色弹框-->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" @close="addRoleClose">
         <el-form :model="addRoleInfo" :rules="rules" ref="addRoleForm">
            <el-form-item label="角色名称：" prop="roleName">
               <el-input v-model="addRoleInfo.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述：" prop="roleDesc">
               <el-input v-model="addRoleInfo.roleDesc"></el-input>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click="addRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddClick">确 定</el-button>
         </div>
      </el-dialog>
   </div>
</template>

<script>
  import {
    getRolesData,
    removeRolesPerId,
    getRightsData,
    RolesAuthor,
    removeRole,
    IdgetRoleData,
    IdsetRoleData,
    addRolesList
  }
    from "../../../network/request_Fn/contentMain";

  export default {
    name: "roles",
    data() {
      return {
        loading:true,
        rolesListData: [],
        dialogTableVisible: false,
        type: "tree ",
        RightsListData: [],
        //树形控件的数据对象
        defaultProps: {
          label: 'authName',//要显示的字段
          children: 'children'//层级嵌套的连接字段
        },
        //树形控件默认选中的
        defaultCheckedKeys: [],
        //当前角色ID
        rolesId: '',
        roleInfo: {},
        setDialogVisible: false,
        //添加角色弹框默认值
        addRoleDialogVisible: false,
        addRoleInfo: {
          roleName: '',
          roleDesc: ''
        },
        //添加角色验证
        rules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    mounted() {
      this.getRolesList()
    },
    methods: {
      //获取角色列表数据
      getRolesList() {
        getRolesData().then(res => {
          if (res.meta.status === 200) {
            this.rolesListData = res.data;
            this.loading=false
          } else {
            this.$message.error("权限列表数据获取失败")
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //根据ID删除角色指定权限
      removeRoles(role, rightId) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRolesPerId(role.id, rightId).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              /*
              * 这里需要注意，当删除接口请求成功后不要直接调用获取角色列表数据接口更新数据，
              * 那样会导致整个列表重新渲染加载，应该将最新返回的数据重新赋值给children
              */
              //从新赋值
              role.children = res.data;
              // this.getRolesList()
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      //点击权限分配按钮，显示弹窗
      rolesFEnPei(role) {
        //保存角色ID
        this.rolesId = role.id;
        this.getTherrRole(role, this.defaultCheckedKeys);
        this.dialogTableVisible = true;
        getRightsData(this.type).then(res => {
          if (res.meta.status === 200) {
            this.RightsListData = res.data;
          } else {
            this.$message.error("权限列表获取失败")
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //定义递归函数，获取所有角色三级权限的id
      getTherrRole(node, arr) {
        //如果当前 node 不包含 children 属性，则是三级节点
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getTherrRole(item, arr)
        })
      },
      //关闭弹窗清空默认选中数组
      hiddenDialog() {
        this.defaultCheckedKeys = []
      },
      //点击确定分配权限
      allotRights() {
        this.dialogTableVisible = false;
        const arr = [
          ...this.$refs.treeRefs.getCheckedKeys(),//全选id
          ...this.$refs.treeRefs.getHalfCheckedKeys() //半选id
        ];
        const rids = arr.join(',');
        RolesAuthor(this.rolesId, rids).then(res => {
          if (res.meta.status === 200) {
            this.$message.success('分配权限成功');
            this.getRolesList()
          } else {
            this.$message.error('分配权限失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //删除角色
      romoveRoleClick(id) {
        this.$confirm('此操作将永久删除该角色，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRole(id).then(res => {
            console.log(res);
            if (res.meta.status === 200) {
              this.$message.success('删除角色成功');
              this.getRolesList()
            } else {
              this.$message.error('删除角色失败')
            }
          }).catch(err => {
            console.log(err);
          })
        })
      },
      //点击编辑修改
      setRoleClick(id) {
        IdgetRoleData(id).then(res => {
          if (res.meta.status === 200) {
            this.roleInfo = res.data;
            console.log(this.roleInfo);
            this.setDialogVisible = true
          } else {
            this.$message.error('获取数据失败')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //点击确定提交编辑
      allotRoles() {
        this.setDialogVisible = false;
        const roleid = this.roleInfo.roleId;
        const roleName = this.roleInfo.roleName;
        const roleDesc = this.roleInfo.roleDesc;

        IdsetRoleData(roleid, roleName, roleDesc).then(res => {
          console.log(res);
          if (res.meta.status === 200) {
            this.$message.success('编辑成功');
            this.getRolesList()
          } else {
            this.$message.error("编辑失败")
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //点击添加角色
      addRole() {
        this.addRoleDialogVisible = true;
      },
      //点击确定添加角色
      submitAddClick() {
        const roleName = this.addRoleInfo.roleName;
        const roleDesc = this.addRoleInfo.roleDesc;
        this.$refs.addRoleForm.validate((valid) => {
          if (valid) {
            addRolesList(roleName, roleDesc).then(res => {
              console.log(res);
              if (res.meta.status === 201) {
                this.$message.success('添加角色成功');
                this.getRolesList();
                this.addRoleDialogVisible = false
              } else {
                this.$message.error('添加角色失败')
              }
            }).catch(err => {
              console.log(err);
            })
          } else {
            this.$message.error('输入的信息有误')
          }
        })
      },
      //关闭添加角色弹框
      addRoleClose() {
        this.$refs.addRoleForm.resetFields()
      }
    }
  }
</script>

<style scoped>
   .el-tag {
      margin: 7px;
   }

   .border_x {
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
   }

   .border_x.two {
      border-bottom: 1px solid #eee;
   }

   .three {
      float: left;
   }

   .three_box {
      display: inline-block;
   }

   .border_two_box .two:last-child {
      border-bottom: none;
   }

</style>
