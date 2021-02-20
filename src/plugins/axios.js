import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router.js'

import {
	Loading,
	Message
} from 'element-ui'

Vue.use(VueAxios, axios, router)

// 超时时间
axios.defaults.timeout = 5000
// http请求拦截器
var loadinginstace

axios.interceptors.request.use(config => {
	// element ui Loading方法
	loadinginstace = Loading.service({
		fullscreen: true
	})
	let token = sessionStorage.getItem("token")
	
	if (!token) {
		router.replace({
			path: "login"
		});
		// alert(sessionStorage.getItem("token"))
	}
	config.headers = {
		'Authorization': 'Bearer ' + token,
		// 'Content-Type': 'application/x-www-form-urlencoded'
	}
	return config
}, error => {
	loadinginstace.close()
	Message.error({
		message: '加载超时'
	})
	return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
	loadinginstace.close()
	let code = data.data.code;
	if(code == 401){
		Message.error({
			message: '登录权限失效，请重新登录'
		})
		router.replace({
			path: "login"
		});
	}
	return data
}, error => {
	loadinginstace.close()
	Message.error({
		message: '加载失败'
	})
	return Promise.reject(error)
})
