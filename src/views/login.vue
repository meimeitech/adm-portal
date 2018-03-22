<template>
  <div class="large-header" id="home">
    <img src="../../static/img/lg-bg1.png" alt="">
    <div class="clearfix">
      <div class="lg-txt-pic">
        <img src="../../static/img/lg-txt-pic1.png" alt="">
      </div>
      <div class="login-box">
        <div class="account-box" v-show="account">
          <!--<div class="top">
            <span class="lg-title">登录</span><span class="sign-title">SIGN IN</span>
          </div>-->
          <Form class="login-form" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="50">
            <Form-item prop="username" label="账号">
              <Input type="text" v-model="formValidate.username" placeholder="用户名"
                     @on-enter="handleSubmit('formValidate')"></Input>
            </Form-item>

            <Form-item prop="password" label="密码">
              <Input type="password" v-model="formValidate.password" placeholder="密码"
                     @on-enter="handleSubmit('formValidate')"></Input>
            </Form-item>

            <!--<Form-item prop="remember">-->
            <!--<Checkbox-group v-model="formValidate.remember">-->
            <!--<Checkbox label="记住我"></Checkbox>-->
            <!--</Checkbox-group>-->
            <!--</Form-item>-->

            <!--<div class="login-loading" v-show="login_loading">-->
            <!--<Spin fix class="spin">-->
            <!--<Icon type="load-c" size=18   class="spin-icon-load"></Icon>-->
            <!--<div>登陆中...</div>-->
            <!--</Spin>-->
            <!--</div>-->

            <Form-item class="btn">
              <Button type="primary" :loading="login_loading" @click="handleSubmit('formValidate')">
                <span v-if="!login_loading">提交</span>
                <span v-else>登陆中...</span>
              </Button>
            </Form-item>

          </Form>

        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import {login} from '../utils/interface';
  import Cookies from 'js-cookie';
  import * as mainConst from '../utils/const';
  export default {
    name: 'login',
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (value.length < 6 || value.length > 32) {
            callback(new Error('密码长度6-32个字符'));
          }
          callback();
        }
      };
//      const validateCode = (rule, value, callback) => {
//        if (!value) {
//          return callback(new Error('验证码不能为空'));
//        }
//        let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
//        if (!reg.test(value)) {
//          callback(new Error('验证码只能中文数字'));
//        } else {
//          callback();
//        }
//      };
      return {
        formValidate: {
          username: '',
          password: ''
//          code: ''
        },
        ruleValidate: {
          username: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {validator: validatePassword, trigger: 'blur'}
          ]
//          code: [
//            {required: true, message: '验证码不能为空', trigger: 'blur'},
//            {validator: validateCode, trigger: 'blur'}
//          ]
        },
        account: true,
        scan: false,
        verifyUrl: '',
        login_loading: false
      };
    },
    beforeCreate: function () {
      if (window !== top) {
        top.location.href = this.$store.state.app.loginUrl;
      }
    },
    methods: {
      handleSubmit(name) { // login
        this.$refs[name].validate(async (valid) => {
          this.login_loading = true;
          // 登陆
          if (valid) {
            let response = await login({
              username: this.formValidate.username,
              password: this.formValidate.password
//              remember: true
            }, this.$store.state.app.baseUrl);
            if (response && response.header) {
              if (response.header.code === '0') {
                this.$Message.success('登录成功!');
                Cookies.set(mainConst.ADM_SESSION_ID, response.body);
//                debugger;
//                Cookies.set(mainConst.ADM_SESSION_ID, response.body.sessionId);
//                Cookies.set(mainConst.ADM_REMEMBER_ME, response.body.rememberKey);
                let refer = Cookies.get(mainConst.ADM_REFER);
                if (refer && refer !== '/') {
                  this.$router.push(Cookies.get(mainConst.ADM_REFER));
                } else {
                  this.$router.push(mainConst.ADM_INDEX);
                }
              }
            }
          } else {
            this.$Message.error('表单验证失败!');
            this.$Notice.warning({
              title: '登录提示',
              desc: '用户名/密码 输入有误.'
            });
          }
          this.login_loading = false;
        });
      }
    },
    mounted() {
    }
  };
</script>
<style lang="less">

  .login_body {
    width: 100%;
    height: 100%;
  }

  .large-header {
    height: 100%;
    overflow: hidden;
    position: relative;
    > img {
      height: 1080px;
      position: absolute;
      left: 50%;
      margin-left: -960px;
      top: 0;
    }
    > div {
      width: 1000px;
      margin: 200px auto 0;
      position: relative;
      .lg-txt-pic {
        width: 468px;
        float: left;
        border-radius: 8px;
        margin-top: 50px;
        img {
          width: 100%;
          display: block;
        }
      }
      .login-box {
        padding: 0 30px;
        float: right;
        background-color: #fff;
        box-shadow: 0 0 20px 0 rgba(20, 15, 89, 0.30);
        border-radius: 8px;
        .account-box {
          margin-top: 58px;
          .ivu-form .ivu-form-item-label {
            font-size: 14px;
            color: #333333;
            letter-spacing: 1.05px;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
            padding: 0px 12px 10px 0;
            &:before {
              content: '';
            }
          }
          .ivu-input {
            width: 160px;
            height: 40px;
            outline: none;
            background-color: #fff!important;
            font-size: 14px;
            color: #333333;
            letter-spacing: 1.05px;
            border-radius: 0;
            border: 1px solid #999;
            &:focus {
              outline: none;
            }
          }
          .btn {
            margin-bottom: 30px;
            .ivu-form-item-content {
              margin-left: 0!important;
              .ivu-btn-primary {
                width: 100%;
                margin: 32px auto 0;
                height: 40px;
                display: block;
                font-size: 18px;
                color: #FFFFFF;
                letter-spacing: 1.35px;
                border-radius: 0;
              }
            }
          }
        }
      }

      .login-loading {
        position: relative;
        width: 330px;
        height: 48px;
        background-color: #27A9E3;
        color: white;

        .spin {
          background-color: #27A9E3;
          color: white
        }
      }
    }
    .spin-icon-load {
      animation: ani-spin 1s linear infinite;
    }
    @keyframes ani-spin {
      from {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
</style>
