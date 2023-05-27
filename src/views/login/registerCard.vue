<template>
  <div class="register-card">
    <p class="card-title">Register Vue-Note!</p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="ruleForm"
    >
      <el-form-item label="名字:" prop="name">
        <el-input
          v-model="ruleForm.name"
          clearable
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input
          type="email"
          v-model="ruleForm.email"
          clearable
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          show-password
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" prop="password2">
        <el-input
          type="password"
          v-model="ruleForm.password2"
          show-password
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <p class="back-login">
        回到<el-button type="text" class="back-btn" @click="backLogin"
          >登录</el-button
        >
      </p>
      <p class="submit-p">
        <el-button type="primary" @click="submitForm()">注册</el-button>
      </p>
    </el-form>
  </div>
</template>

<script>
import throttle from "@/utils/throttle";
import login from "@/api/login.js";
import { vaildMail } from "@/utils/regVerification.js";
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入名字"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        this.ruleForm.password = "";
        this.ruleForm.password2 = "";
        callback(new Error("请输入邮箱"));
      } else if (!vaildMail(value)) {
        callback(new Error("邮箱格式不对"));
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
    var validatePassword2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        email: "",
        password: "",
        password2: "",
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        email: [
          {
            required: true,
            validator: validateEmail,
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" },
        ],
        password2: [
          { required: true, validator: validatePassword2, trigger: "blur" },
        ],
      },
      rememberMe: false,
    };
  },
  components: {},
  created() {},
  methods: {
    submitForm: throttle(function () {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          //注册请求
          login
            .register({
              email: this.ruleForm.email,
              password: this.ruleForm.password,
              name: this.ruleForm.name,
            })
            .then((res) => {
              console.log(res);
              if (res.data.success) {
                this.$message.success({ message: res.data.msg, center: true });
                this.$router.push("/login");
              } else {
                this.$message.error({ message: res.data.msg, center: true });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }, 2000),
    backLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style lang='scss' scoped>
.register-card {
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
.el-input {
  width: 80%;
}
.el-checkbox {
  margin-left: 80px;
}
.submit-p {
  text-align: center;
}
.back-login {
  text-align: right;
  font-size: 14px;
  margin-right: 60px;
}
</style>
