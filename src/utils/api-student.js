
import {BASE_URL} from "./api";
 //每日一评
 export const LIST_COMMENT_URL = BASE_URL + "/rest/v1/comment/list";
 export const DELETE_COMMENT_URL = BASE_URL + "/rest/v1/comment/delete";
 export const SAVEORUPDATE_COMMENT_URL = BASE_URL + "/rest/v1/comment/saveOrUpdate";
 export const FIND_COMMENT_URL = BASE_URL + "/rest/v1/comment/findCommentById";
//计划事项
export const LIST_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/selectAll";
export const FIND_PLANITEMBYPARENTID_URL = BASE_URL + "/rest/v1/planItem/selectByParentId";
export const FIND_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/selectById";
export const ADD_OR_EDITOR_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/saveOrUpdate";
//今天事项
export const LIST_TODAYPLANITEM_URL = BASE_URL + "/rest/v1/planItem/selectTodayPlanItem";
//事项完成
export const DONE_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/donePlanItem";
//删除事项
export const DELETE_PLANITEM_URL = BASE_URL + "/rest/v1/planItem/deletePlanItem";
