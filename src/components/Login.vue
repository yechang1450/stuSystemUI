<template>
	<div>
		<div class="main">
			<div class="logo_box">
				<h3>青城博雅教学管理系统</h3>
				<div class="input_outer">
					<span class="u_user"></span>
					<el-input class="text" v-model.trim="username" placeholder="请输入用户名"></el-input>
				</div>
				<div class="input_outer">
					<span class="us_uer"></span>
					<el-input class="text" type="password"  v-model.trim="password" placeholder="请输入密码"></el-input>
				</div>
				
				<el-row type="flex"  justify="space-around">
					<el-col :span="6"><el-button class="act-but submit"  type="success" size="medium" v-on:click="register">注册</el-button></el-col>
					<el-col :span="6"><el-button class="act-but submit"  type="primary" size="medium" v-on:click="login" >登录</el-button></el-col>
				</el-row>
			</div>
			<vue-particles
				color="#fff"
				:particleOpacity="0.7"
				:particlesNumber="60"
				shapeType="circle"
				:particleSize="4"
				linesColor="#fff"
				:linesWidth="1"
				:lineLinked="true"
				:lineOpacity="0.4"
				:linesDistance="150"
				:moveSpeed="2"
				:hoverEffect="true"
				hoverMode="grab"
				:clickEffect="true"
				clickMode="push"
				class="lizi"
			></vue-particles>
		</div>
	</div>
</template>
<script>
import { AUTH_LOGIN_URL } from "../utils/api.js";
export default {
	name: 'Login',
	data: function() {
		return {
			username: '',
			password: ''
		};
	},
	methods: {
		login: function() {
			let that = this;
			let api = AUTH_LOGIN_URL;
			if (that.username.length <= 0 && that.password.length <= 0) {
				this.$message.error('请填写的用户名和密码');
				return;
			}
			that.axios({
				method: 'post',
				url: api,
				data: {
					username: this.username,
					password: this.password
				}
			})
				.then(res => {
					//console.log(res.data);
					let code = res.data.code;
					if (code == 200) {
						let token = res.data.data.token;
						let authorities = res.data.data.userDetail.authorities; // 获取权限信息
						sessionStorage.setItem('userDetail', JSON.stringify(res.data.data.userDetail));
						sessionStorage.setItem('authorities', JSON.stringify(authorities));
						sessionStorage.setItem('token', token);
						//第一次进入系统
						if(res.data.data.userDetail.first){
							this.$router.replace({
								path: 'welcome'
							});
						}else{
							this.$router.replace({
								path: 'index'
							});
						}
						
					} else {
						this.$message.error('请输入正确的用户名和密码');
					}
				})
				.catch(error => {
					console.log(error);
				});
		},
		register:function(){
				this.$router.replace({
					path:'register'
				});
		}
	}
};
</script>
<style lang="scss" scoped>
.lizi {
  height: 100vh;
  background-image: url(../assets/login/login.jpg);
  background-size: cover;
  background-position: center center;
}
.logo_box {
  width: 350px;
  height: 400px;
  padding: 35px;
  color: #eee;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -175px;
  margin-top: -250px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.logo_box h3 {
  text-align: center;
  height: 20px;
  font: 20px "microsoft yahei", Helvetica, Tahoma, Arial, "Microsoft jhengHei",
    sans-serif;
  color: #ffffff;
  height: 20px;
  line-height: 20px;
  padding: 0 0 35px 0;
}
.input_outer {
  height: 46px;
  padding: 0 5px;
  margin-bottom: 30px;
  border-radius: 50px;
  position: relative;
  border: rgba(255, 255, 255, 0.2) 2px solid !important;
  overflow: hidden;
}
.u_user {
  width: 25px;
  height: 25px;
  background-image: url(../assets/login/login_ico.png);
  background-position: -125px 0;
  position: absolute;
  margin: 10px 13px;
}
.us_uer {
  width: 25px;
  height: 25px;
  background-image: url(../assets/login/login_ico.png);
  background-position: -125px -34px;
  position: absolute;
  margin: 10px 13px;
}
.text {
  width: 220px;
  height: 46px;
  outline: none;
  display: inline-block;
  margin-left: 50px;
  border: none;
  line-height: 46px;
  width: calc(100% - 50px);
}
</style>
<style>
.text input.el-input__inner {
  background: transparent !important;
  border: none !important;
  color: #fff;
}
.text input:-webkit-autofill {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}
</style>