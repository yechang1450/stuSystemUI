export const BASE_URL = "http://127.0.0.1:8085";
// 登录注册相关接口
export const AUTH_LOGIN_URL = BASE_URL + "/v1/auth/login";
export const AUTH_LOGOUT_URL = BASE_URL + "/v1/auth/logout"; // 退出系统
//加载权限资源
export const LIST_RESOURCES_URL = BASE_URL + "/v1/resource/listResources";
export const LOAD_RESOURCES_URL = BASE_URL + "/v1/resource/loadResources";
export const ADD_OR_EDITOR_RESOURCES_URL = BASE_URL + "/v1/resource/saveOrUpdate";
export const DELETE_RESOURCES_URL = BASE_URL + "/v1/resource/delete";
export const FIND_RESOURCES_URL = BASE_URL + "/v1/resource/findResource";
//加载角色信息
export const LOAD_ALL_RESOURCES_URL = BASE_URL + "/v1/role/loadAllResource";
export const LIST_ROLES_URL = BASE_URL + "/v1/role/list";
export const LOAD_ROLES_RESOURCES_URL = BASE_URL + "/v1/role/loadResources";
export const UPDATE_ROLES_RESOURCES_URL = BASE_URL + "/v1/role/updateRoleResources"; // 更新权限绑定
export const FIND_ROLE_URL = BASE_URL + "/v1/role/findRoleById"; // 根据角色id，查询角色信息
export const ADD_OR_EDITOR_ROLE_URL = BASE_URL + "/v1/role/saveOrUpdate"; // 保存和更新角色信息
export const DELETE_ROLE_URL = BASE_URL + "/v1/role/delete";
export const SELECT_ROLE_RESOURCES_URL = BASE_URL + "/v1/role/selectResourceByRoleId"; // 查询角色拥有的全部权限信息，包括菜单和按钮的
//用户管理
export const LIST_USER_URL = BASE_URL + "/v1/user/list";
export const FIND_USER_URL = BASE_URL + "/v1/user/findUserById";
export const ADD_OR_EDITOR_USER_URL = BASE_URL + "/v1/user/saveOrUpdate";
export const DELETE_USER_URL = BASE_URL + "/v1/user/delete-user";
//加载用户角色
export const LOAD_USER_ROLE_URL = BASE_URL + "/v1/user/loadUserRole";
export const UPDATE_USER_ROLE_URL = BASE_URL + "/v1/user/updateUserRole";
 //每日一评
export const LIST_COMMENT_URL = BASE_URL + "/rest/v1/comment/list";
export const DELETE_COMMENT_URL = BASE_URL + "/rest/v1/comment/delete";
export const SAVEORUPDATE_COMMENT_URL = BASE_URL + "/rest/v1/comment/saveOrUpdate";
export const FIND_COMMENT_URL = BASE_URL + "/rest/v1/comment/findCommentById";
//计划事项练习
export const LIST_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/list";
export const FIND_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/findPlanItemById";
export const ADD_OR_EDITOR_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/saveOrUpdate";
export const DELETE_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/delete";
