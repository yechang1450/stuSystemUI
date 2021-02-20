


//教师部分通用
import {BASE_URL} from "./api";

export const LIST_ALL_CLASSES = BASE_URL+"/rest/v1/common/listClasses";
export const LIST_STUDENTS = BASE_URL+"/rest/v1/common/listStudents";
export const LIST_COURSES_BY_CLASSNO = BASE_URL+"/rest/v1/common/listCourseByClassNo";
export const LIST_COURSES = BASE_URL+"/rest/v1/common/listCourse";

//教师成绩管理部分
export const LIST_TEACHER_SCORE_URL = BASE_URL+"/rest/v1/scoreInfo/index";
export const ADD_TEACHER_SCORE_URL = BASE_URL+"/rest/v1/scoreInfo/add";
export const UPDATE_TEACHER_SCORE_URL = BASE_URL+"/rest/v1/scoreInfo/update";
export const DELETE_MANY_TEACHER_SCORE_URL = BASE_URL+"/rest/v1/scoreInfo/deleteAll";



//教师部分学生管理部分
export const LIST_TEACHER_STUDENT_DAILY_URL = BASE_URL+"/rest/v1/studentDaily/index";
export const ADD_TEACHER_STUDENT_DAILY_URL = BASE_URL+"/rest/v1/studentDaily/add";
export const UPDATE_TEACHER_STUDENT_DAILY_URL = BASE_URL+"/rest/v1/studentDaily/update";
export const DELETE_MANY_STUDENT_DAILY_URL = BASE_URL+"/rest/v1/studentDaily/deleteAll";

//教师部分课程管理部分

export const LIST_TEACHER_COURSE_URL = BASE_URL+"/rest/v1/courseInfo/index";
export const UPDATE_TEACHER_COURSE_URL = BASE_URL+"/rest/v1/courseInfo/update";
