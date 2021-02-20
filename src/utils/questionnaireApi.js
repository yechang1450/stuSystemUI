export const BASE_URL = "http://127.0.0.1:8085";
//创建问卷
export const CreateQuestionnaire = BASE_URL + "/rest/v1/questionnaire/insert";
//展示问卷的标题
export const ShowQuestionnaireTitle = BASE_URL + "/rest/v1/questionnaire/showQuestionnaire";
//展示问卷的题目
export const ShowQuestionnaireQuestion = BASE_URL + "/rest/v1/questionnaire/showQuestionnaire";
//删除问卷的题目
export const DeleteQuestionnaireQuestion = BASE_URL + "/rest/v1/questionnaireQuestion/deleteQuestion";
//回答问卷的题目
export const AnswerQuestionnaire = BASE_URL + "/rest/v1/questionnaireAnswer/answerQuestionnaire";
