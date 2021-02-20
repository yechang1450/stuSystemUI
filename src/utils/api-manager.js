
//管理员通用
import {BASE_URL} from "./api";

//管理员课程管理
export const LIST_ALL_COURSES=BASE_URL+"/rest/v1/course";
export const UPDATE_COURSE=BASE_URL+"/rest/v1/course/saveOrUpdate"
export const DELETE_COURSE=BASE_URL+"/rest/v1/course/delete"
export const DELETEALL_COURSE=BASE_URL+"/rest/v1/course/deleteAll"

export const LIST_ADDED_CLASSCOURSE=BASE_URL+"/rest/v1/classCourse/selectAdded"
export const DELETE_CLASSCOURSE=BASE_URL+"/rest/v1/classCourse/deleteAll"
export const UPDATE_CLASSCOURSE=BASE_URL+"/rest/v1/classCourse/saveOrUpdate"

export const LIST_NO_ADDED_CLASS=BASE_URL+"/rest/v1/classCourse/selectNoAdd"
export const ADD_COURSE_TO_CLASS=BASE_URL+"/rest/v1/classCourse/add"

export const LIST_CLASSCOURSE_RULE=BASE_URL+"/rest/v1/classCourseRule/selectAdded"
export const UPDATE_CLASSCOURSE_RULE=BASE_URL+"/rest/v1/classCourseRule/saveOrUpdate"
export const DELETE_CLASSCOURSE_RULE=BASE_URL+"/rest/v1/classCourseRule/delete"
