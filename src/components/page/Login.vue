<template>
  <main class="centered-wrapper">
    <el-form :model="input" :rules="rules" ref="form" class="centered-content">
      <div class="header">
        <img class="img" src="../../assets/logo.png">
      </div>
      <div class="container">
        <el-form-item label="Username" prop="email">
          <el-input v-model="input.email" placeholder="Enter Username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="input.password" placeholder="Enter Password" type="password"
            :append-icon="showPassword ? 'el-icon-view' : 'el-icon-hide'" @click="togglePasswordVisibility"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" round type="primary" @click="login" :loading="loading">Login</el-button>
          <span class="go-to-register-text" @click="goRegister">Register First?</span>
        </el-form-item>
      </div>
    </el-form>
  </main>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ApiService from '../../service/apiService';

Vue.use(VueAxios, axios);

export default {
  name: "Login",

  data() {
    return {
      input: {
        email: "",
        password: "",
      },
      showPassword: false,
      rules: {
        email: [
          { required: true, message: 'Please enter your email', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] },
        ],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' },
          { min: 6, message: 'Password length should be at least 6 characters', trigger: 'blur' },
        ],
      },
      loading: false,
    };
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          //this.loading = true;
          console.log('Request Data:', this.input);

          ApiService.post('/login', this.input)
            .then(({ data }) => {
              localStorage.setItem('jwtToken', data.token);
              localStorage.setItem('userId', data.user._id);
              localStorage.setItem('connectedUser', data.user.firstname);
              this.configureAxios(data.token, data.user._id);
              this.openNotificationLogin();
              this.$router.replace({ name: 'projects' });
            })
            .catch((error) => {
              console.error("Login error:", error);
            });
          /* .finally(() => {
            this.loading = false;
          }); */
        } else {
          console.log('Form validation failed.');
        }
      });
    },
    openNotificationLogin() {
      this.$notify({
        title: 'Successful login',
        message: 'You loged in successfuly',
        type: 'success'
      });
    },

    goRegister() {
      this.$router.replace({ name: 'register' });
    },

    configureAxios(token, userId) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.userId = userId;
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
html,
Body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: white;

}

button {
  width: 100%;
  border: none;
  cursor: pointer;
}


form {
  width: 700px;
  margin: 0 auto;
  padding: 20px;

  border-radius: 10px;
}

.centered-content {
  border: 2px solid #ccc;
  padding-left: 100px;
  padding-right: 100px;
}

main.centered-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

}

.container {
  padding: 0;

}

input[type=text],
input[type=password] {
  width: 100%;
  margin: 8px 0;
  padding: 12px 20px;
  display: inline-block;
  border: 2px solid green;
  box-sizing: border-box;
}

button:hover {
  opacity: 0.7;
}


.login-btn {
  color: '#409EFF'

}

.header {
  margin-left: 120px;
  margin-top: 100px;
  padding: 5px;

}

.img {
  height: 100px;
  width: 300px;
  margin-top: 50px;
  position: absolute;
  top: 20%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

}

.go-to-register-text {
  color: #409eff;
  cursor: pointer;
  margin-left: 5px;

}

.go-to-register-text:hover {
  text-decoration: underline;
}
</style>../../service/apiService