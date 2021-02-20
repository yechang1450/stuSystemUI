import Vue from 'vue'
import VueRouter from 'vue-router'
import { Notification } from 'element-ui';
import Index from "../components/Index.vue"
import Login from "../components/Login.vue"
import Register from "../components/Register.vue"
import Role from "../pages/auth/Role.vue"
import Resource from "../pages/auth/Resource.vue"
import Comment from "../pages/student/Comment.vue"
import User from "../pages/auth/User.vue"
import PlanItem from "../pages/student/PlanItem"
import Calendar from "../pages/student/Calendar"
import Analysis from "../pages/analysis/Analysis"
import NotFound from "../pages/404.vue"
import Forbidden from "../pages/403.vue"
import { check, isLogin } from '../utils/auth.js'
import findLast from 'lodash/findLast'
import Welcome from "../pages/auth/Welcome.vue"
import TeacherScore from "../pages/teacher/TeacherScore";
import TeacherStudentDaily from "../pages/teacher/TeacherStudentDaily";
import TeacherCourse from "../pages/teacher/TeacherCourse";
import createQuestionnaire from '../pages/questionnaire/CreateQuestionnaire'
import questionnaireTitle from '../pages/questionnaire/QuestionnaireTitle'
import questionnaireQuestion from '../pages/questionnaire/QuestionnaireQuestion'
import answerQuestionnaire from '../pages/questionnaire/AnswerQuestionnaire'

import admin_teacher from "../pages/admin_class/AllTeacher.vue";
import admin_set from "../pages/admin_class/SetHeader.vue";

import ManagerCourse from "../pages/manager/ManagerCourse";
import ManagerClassCourse from "../pages/manager/ManagerClassCourse";
import ManagerClassCourseAdd from "../pages/manager/ManagerClassCourseAdd";
import ManagerClassCourseRule from "../pages/manager/ManagerClassCourseRule"
Vue.use(VueRouter)
export const routes = [
	{
		path: "/login",
		hideInMenus: true,
		component: Login
	},

	{
		path: "/index",
		name: '首页',
		hideInMenus: false,
		component: Index,
		meta: { authority: ['/'] },
		children: [
			{
				path: "/index",
				name: '权限管理',
				hideInMenus: false,
				component: { render: h => h("router-view") },
				meta: { authority: ['/'] },
				children: [
					{
						path: "/role",
						name: '角色管理',
						hideInMenus: false,
						meta: { authority: ['/role'] },
						component: Role
					},
							
					{
									path: "/admin_teacher",
									name: 'admin_teacher',
									hideInMenus: false,
									meta: { authority: ['/admin_teacher'] },
									component: admin_teacher
					},
					{
									path: "/admin_set",
									name: 'admin_set',
									hideInMenus: false,
									meta: { authority: ['/admin_set'] },
									component: admin_set
					},


					{
						path: "/resource",
						name: '权限管理',
						hideInMenus: false,
						meta: { authority: ['/resource'] },
						component: Resource
					},
					{
						path: "/user",
						name: '用户管理',
						hideInMenus: false,
						meta: { authority: ['/user'] },
						component: User
					},

					{
						path: "/TeacherStudentDaily",
						name: '学生日常管理',
						hideInMenus: false,
						meta: { authority: ['/TeacherStudentDaily'] },
						component: TeacherStudentDaily
					},
					{
						path: "/teacherScore",
						name: '成绩管理',
						hideInMenus: false,
						meta: { authority: ['/teacherScore'] },
						component: TeacherScore
					},
					{
						path: "/teacherCourse",
						name: '课程管理',
						hideInMenus: false,
						meta: { authority: ['/teacherCourse'] },
						component: TeacherCourse,
						
					},
					{
						path: "/403",
						hideInMenus: true,
						component: Forbidden
					},
				]
			},
			{
				path: "/student",
				name: '学生功能',
				hideInMenus: false,
				component: { render: h => h("router-view") },
				meta: { authority: ['/'] },
				children: [
					{
						path: "/planItem",
						name: '计划事项',
						hideInMenus: false,
						meta: { authority: ['/user'] },
						component: PlanItem
					},
					{
						path: "/comment",
						name: '每日一记',
						hideInMenus: false,
						meta: { authority: ['/comment'] },
						component: Comment
					},
					{
						path: "/calendar",
						name: '日历',
						hideInMenus: false,
						meta: { authority: ['/calendar'] },
						component: Calendar,
					},
					{
						path: "/managerCourse",
						name: '课程设置',
						hideInMenus: false,
						meta: { authority: ['/managerCourse'] },
						component: ManagerCourse,
					},
					{
						path: "/managerClassCourse",
						name:'班级课程绑定',
						hideInMenus: false,
						component: ManagerClassCourse,
					},
					{
						path: "/managerClassCourseAdd",
						name:'班级课程添加',
						hideInMenus: false,
						component: ManagerClassCourseAdd,
					},
					{
						path: "/ManagerClassCourseRule",
						name:'班级课程规则',
						hideInMenus: false,
						component: ManagerClassCourseRule,
					},
					{
						path: "/403",
						hideInMenus: true,
						component: Forbidden
					},
					{
						path: "/403",
						hideInMenus: true,
						component: Forbidden
					},
				]
			},
			{
				path: "/analysis",
				name: '图表展示',
				hideInMenus: false,
				component: { render: h => h("router-view") },
				meta: { authority: ['/'] },
				children: [
					{
						path: "/analysis",
						name: '图表页',
						hideInMenus: false,
						meta: { authority: ['/analysis'] },
						component: Analysis
					},
				]
			},
			{
				path: "/welcome",
				name: '绑定数据',
				hideInMenus: true,
				component: { render: h => h("router-view") },
				meta: { authority: ['/'] },
				children: [
					{
						path: "/welcome",
						name: '图表页',
						hideInMenus: true,
						meta: { authority: ['/'] },
						component: Welcome
					},
				]
			},
		]
	},
	{
		path: "/register",
		hideInMenus: true,
		component: Register
	},
	{
		path: "*",
		hideInMenus: true,
		component: NotFound
	},
	{
		path: '/',
		hideInMenus: true,
		redirect: '/index'
	},
	{
		path: "/createQuestionnaire",
		component: createQuestionnaire
	},
	{
		path: "/questionnaireTitle",
		component: questionnaireTitle
	},
	{
		path: "/questionnaireQuestion",
		component: questionnaireQuestion
	},
	{
		path: "/answerQuestionnaire",
		component: answerQuestionnaire
	}
]
var router = new VueRouter({
	mode: "history",
	routes: routes
})
router.beforeEach((to, form, next) => {
	const record = findLast(to.matched, record => record.meta.authority);

	if (record && !check(record.meta.authority)) {
		if (!isLogin() && to.path !== '/login') {

			next({
				path: '/login'
			});
		} else if (to.path !== "/403") {
			next({
				path: '/403'
			});
			Notification.error({
				title: '您没有访问权限',
				message: '请联系管理员'
			});
		}
	} else {
		next();
	}
});
export default router;
