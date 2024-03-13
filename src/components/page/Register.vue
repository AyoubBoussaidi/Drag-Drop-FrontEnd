<template>
  <main class="centered-wrapper">
    <el-form :model="input" :rules="rules" ref="form" @submit.prevent="saveUser" class="centered-content">
      <div class="header">
        <img class="img" src="../../assets/logo.png" width="500" height="600">
      </div>

      <div class="container">
        <el-form-item label="Firstname" prop="firstname">
          <el-input v-model="input.firstname" placeholder="Enter Firstname"></el-input>
        </el-form-item>

        <el-form-item label="Lastname" prop="lastname">
          <el-input v-model="input.lastname" placeholder="Enter Lastname"></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="input.email" placeholder="Enter Email"></el-input>
        </el-form-item>

        <!--         <el-form-item label="Age" prop="age">
          <el-input type="number" v-model="input.age" placeholder="Enter Age"></el-input>
        </el-form-item> -->

        <el-form-item label="Password" prop="password">
          <el-input v-model="input.password" placeholder="Enter Password" type="password"
            :append-icon="showPassword ? 'el-icon-view' : 'el-icon-hide'" @click="togglePasswordVisibility"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="button-container">
            <el-button class="go-to-login-text" round type="danger" @click="goLogin">Cancel</el-button>
            <el-button class="register-btn" round type="primary" native-type="submit"
              @click="saveUser">Register</el-button>
          </div>
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

Vue.use(axios, VueAxios);

export default {
  name: "register",
  data() {
    return {
      result: {},
      input: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        age: "",
      },
      showPassword: false,
      rules: {
        firstname: [
          { required: true, message: 'Please enter your firstname', trigger: 'blur' },
        ],
        lastname: [
          { required: true, message: 'Please enter your lastname', trigger: 'blur' },
        ],
        email: [
          { required: true, message: 'Please enter your email', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] },
        ],
        age: [
          { required: true, message: 'Please enter your age', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' },
          { min: 6, message: 'Password length should be at least 6 characters', trigger: 'blur' },
        ],
      },
    };
  },

  methods: {
    saveUser() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          ApiService.post("/register", this.input)
            .then(() => {
              alert("User Registered successfully");
              this.$router.replace({ name: 'login' });
            })
            .catch((error) => {
              console.error("Registration error:", error);
            });
        }
      });
    },

    goLogin() {
      this.$router.replace({ name: 'login' });
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
  padding: 15px;
  margin: 10px 0px;
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
  margin-top: 20px;
  margin-bottom: 40px;
}

main.centered-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;


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

.cancelbtn {
  width: auto;
  padding: 10px 18px;
  margin: 10px 5px;
}

.login-btn {
  margin: 5px;
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
  top: 7%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

}

.button-container {
  display: flex;
  justify-content: center;
}

.register-btn,
.go-to-login-text {
  width: 30%;
  margin: 0;
}

.go-to-login-text {
  cursor: pointer;
}

.label-above-input .el-form-item__label {
  margin-bottom: 10px;
}
</style>