<template>
  <div class="login-card" @keydown="keyLogin">
    <p class="card-title">Welcome Vue-Note!</p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="ruleForm"
    >
      <el-form-item label="账号:" prop="email">
        <el-input
          type="email"
          v-model="ruleForm.email"
          placeholder="请输入账号"
          clearable
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          placeholder="请输入密码"
          show-password
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <div class="register-p">
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <span class="register-text"
          >还没<el-button type="text" class="register-btn" @click="goRegister"
            >注册</el-button
          >?</span
        >
      </div>
      <p class="submit-p">
        <el-button type="primary" @click="submitForm()">登录</el-button>
      </p>
    </el-form>
  </div>
</template>

<script>
import login from "@/api/login.js";
import utilsAuth from "@/utils/auth";
import { mapMutations } from "vuex";
import throttle from "@/utils/throttle";
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        this.ruleForm.password = "";
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        email: "",
        password: "",
      },
      rules: {
        email: [{ validator: validateEmail, trigger: ["blur", "change"] }],
        password: [{ validator: validatePassword, trigger: "blur" }],
      },
      rememberMe: false,
    };
  },
  components: {},
  created() {
    this.getCookies();
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    getCookies() {
      let loginInfo = this.$Cookies.getJSON("loginInfo") || {};
      // console.log(loginInfo);
      if (Object.keys(loginInfo).length) {
        this.ruleForm.email = loginInfo.email;
        this.ruleForm.password = loginInfo.password;
        this.rememberMe = loginInfo.rememberMe;
      } else {
        this.ruleForm.email = "";
        this.ruleForm.password = "";
        this.rememberMe = false;
      }
    },
    keyLogin(e) {
      if (e.keyCode == 13) {
        this.submitForm();
      }
    },
    submitForm: throttle(function () {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          //登录请求
          login
            .login({
              email: this.ruleForm.email,
              password: this.ruleForm.password,
            })
            .then((res) => {
              console.log(res);
              if (res.data.success) {
                utilsAuth.setToken(res.data.token);
                utilsAuth.setUserInfo(JSON.stringify(res.data.data));
                this.setUserInfo(res.data.data);
                this.$router.push("/home");
              } else {
                this.$message.error({ message: res.data.msg, center: true });
              }
              // 记住我？设置cookies
              if (this.rememberMe) {
                this.$Cookies.set(
                  "loginInfo",
                  {
                    email: this.ruleForm.email,
                    password: this.ruleForm.password,
                    rememberMe: this.rememberMe,
                  },
                  { expires: 7 }
                );
              } else {
                this.$Cookies.remove("loginInfo");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }, 2000),
    goRegister() {
      this.$router.push("/login/register");
    },
  },
};
</script>

<style lang='scss' scoped>
.login-card {
  width: 32rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 #848683;
}
.card-title {
  font-size: 2rem;
  font-weight: 600;
  color: #409eff;
  text-align: center;
  margin: 2rem 0;
}
.ruleForm {
  > * {
    padding: 0.2rem 0;
  }
}
.el-input {
  width: 80%;
}
.el-checkbox {
  margin-left: 80px;
}
.register-p {
  display: flex;
  justify-content: space-between;
  .register-text {
    font-size: 14px;
    margin-right: 5rem;
    .register-btn {
      padding: 0;
    }
  }
}
.submit-p {
  text-align: center;
}
</style>
