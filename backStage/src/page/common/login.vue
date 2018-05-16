<template>
  <div class="login">
  	<div class="login_box">
  		<div class="title"><span>后台管理</span> | 登录</div>
  		<input type="text" class="form-control uname" v-model="uname" placeholder="用户名">
  		<input type="password" class="form-control pword m-b" v-model="pword" placeholder="密码" @keyup.enter="login_but">
  		<el-button class="btn btn-success" type="primary" :loading="butState" @click="login_but">
  			<span v-if="butState">加载中</span>
  			<span v-else>登录</span>
  		</el-button>
  	</div>
  </div>
</template>
<script>
import md5 from "md5";
import { async } from "@/config/fetch";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      uname: "",
      pword: "",
      butState: false
    };
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    login_but() {
      const _this = this;
      console.log(md5(this.pword));
      if (this.uname == "") {
        this.$message({
          message: "请输入您的管理员账号",
          type: "warning"
        });
      } else if (this.pword == "") {
        this.$message({
          message: "请输入您的管理员密码",
          type: "warning"
        });
      } else {
        async(
          "/backstageUserController/login.do",
          {
            backstageUserPhone: this.uname,
            password: md5(this.pword)
          },
          "POST"
        )
          .then(data => {
            if (data.code == 200) {
              this.butState = true;
              console.log(data.token, data.userId);
              this.setUserInfo({ token: data.token, userId: data.userId });
              //vue路由跳转方法
              this.$router.push("/userManage");
            } else {
              _this.$notify.error({
                title: "登录失败",
                message: "请检查用户名和密码是否正确！"
              });
            }
          })
          .catch(err => {
            console.log(err);
            _this.$notify.error({
              title: "错误",
              message: "加载失败！"
            });
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  background: url(../../images/login-background.jpg) center center no-repeat;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  .login_box {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    -moz-box-shadow: 0 3px 0 rgba(12, 12, 12, 0.03);
    -webkit-box-shadow: 0 3px 0 rgba(12, 12, 12, 0.03);
    box-shadow: 0 3px 0 rgba(12, 12, 12, 0.03);
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    padding: 30px;
    animation: loginIn 1s ease;

    .title {
      text-align: center;
      font-size: 26px;
      color: #fff;
      font-weight: bold;
    }
    .form-control {
      background-color: #fff;
      background-image: none;
      border: 1px solid #e5e6e7;
      border-radius: 3px;
      color: inherit;
      display: block;
      padding: 6px 12px;
      -webkit-transition: border-color 0.15s ease-in-out 0s,
        box-shadow 0.15s ease-in-out 0s;
      transition: border-color 0.15s ease-in-out 0s,
        box-shadow 0.15s ease-in-out 0s;
      width: 300px;
      height: 40px;
      font-size: 14px;

      box-sizing: border-box;
    }
    .uname {
      margin-top: 30px;
      background: #eee url(../../images/user.png) no-repeat 95% center;
      color: #333;
    }
    .pword {
      margin-top: 20px;
      background: #eee url(../../images/locked.png) no-repeat 95% center;
      color: #333;
    }
    .btn {
      display: inline-block;
      padding: 6px 12px;
      margin-bottom: 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.42857143;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      background-image: none;
      border: 1px solid transparent;
      border-radius: 4px;
    }
    .btn-success {
      background-color: #1c84c6;
      border-color: #1c84c6;
      color: #fff;
      margin-top: 30px;
      display: block;
      width: 100%;
      height: 40px;
    }
  }
}
@keyframes loginIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0px);
  }
}
</style>
