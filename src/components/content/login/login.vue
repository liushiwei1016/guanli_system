<template>
   <div class="login">
      <el-card class="login_box">
         <h1>管理系统</h1>
         <el-form :model="login_form" ref="login_form" :rules="login_rules">
            <el-form-item prop="username">
               <el-input prefix-icon="el-icon-user-solid"
                         placeholder="请输入账号"
                         type="text"
                         v-model="login_form.username"
                         autofocus="true"
                         @focus="inputFocus"
               >
               </el-input>
            </el-form-item>
            <el-form-item prop="password">
               <el-input prefix-icon="el-icon-unlock"
                         placeholder="请输入密码"
                         type="password"
                         v-model="login_form.password"
                         @focus="inputFocus"
               ></el-input>
            </el-form-item>
            <p class="msg">{{msgText}}</p>
            <el-form-item class="login_btn">
               <el-button type="primary" @click="login">登录</el-button>
               <el-button type="info" @click="resetForm">重置</el-button>
            </el-form-item>
         </el-form>
      </el-card>
   </div>
</template>

<script>
  import {$axios} from "../../../network/axios";

  export default {
    name: "login",
    data() {
      return {
        msgText: '',
        //表单账号密码
        login_form: {
          username: 'admin',
          password: '123456'
        },
        //表单验证规则
        login_rules: {
          username: [
            {required: true, message: '请输入正确的账号', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入正确的密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ],
        }
      }
    },

    created() {
      //登录添加键盘回车事件,注意,不能直接在焦点事件上添加回车
      let that = this;
      document.onkeydown = function () {
        let key = window.event.keyCode;
        if (key === 13) {
          that.login();//调用登录方法
        }
      }
    },
    methods: {
      //重置按钮
      resetForm() {
        this.$refs.login_form.resetFields();
        this.msgText = ''
      },
      //登录按钮
      login() {
        /**
         * validate(参数一，参数二)，对整个表单进行校验的方法，参数为一个回调函数。
         * 参数一是验证的结果，返回布尔值，验证通过返回true，失败返回false
         * 参数二是验证失败时返回的验证对象
         */
        //登录前的预验证
        this.$refs.login_form.validate((vaild, obj) => {
          //只有表单验证通过是才发送请求
          if (vaild) {
            $axios({
              url: '/login',
              method: 'post',
              data: {
                username: this.login_form.username,
                password: this.login_form.password
              }
            }).then(res => {
              if (res.meta.status !== 200) {
                //登录不成功
                this.msgText = res.meta.msg;
                // this.$message.error(res.meta.msg)
                this.$message({
                  type: 'error',
                  message: res.meta.msg
                })
              } else {
                //登录成功
                // this.$message.success(res.meta.msg);
                this.$message({
                  type: 'success',
                  message: res.meta.msg
                });
                /**
                 * 1，将登录成功之后的 token 值保存到客户端的 sessionStorage 中
                 * 2，因为 token 值应该只在当前网站打开期间生效，所以将 token 保存在 sessionStorage
                 * 3，setItem方法：setItem('键名', 键值)
                 */
                window.sessionStorage.setItem('token', res.data.token);
                /**
                 * 使用编程试导航跳转到首页
                 */
                this.$router.push('/home');
              }
            }).catch(err => {
              console.log(err);
            })
          }
        })
      },
      //输入框获取焦点清空msg
      inputFocus() {
        this.msgText = ''
      },
    }
  }
</script>

<style lang="scss" scoped>
   .login {
      height: 100%;
      background: url("~img/login-bg.png") no-repeat;
      position: relative;

      .login_box {
         width: 350px;
         height: 300px;
         position: absolute;
         left: 50%;
         top: 50%;
         transform: translate(-50%, -50%);

         h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 25px;
         }

         .msg {
            height: 30px;
            color: #F56C6C;
            font-size: 15px;
         }

         .login_btn {
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
         }
      }
   }
</style>
