<template>
  <div id="questionnaireTitle">
    <h1 align="center">{{questionarieTitle}}</h1>
    <el-button type="primary" @click="onSubmit">主要按钮</el-button>
  </div>
</template>
<script>
import { ShowQuestionnaireTitle } from '../../utils/questionnaireApi.js';
export default {
  name: "questionnaireTitle",
  data() {
    return {
        questionarieTitle: ''
    }
  },
  methods: {
    onSubmit() {
      let questionnaireId = '1';
      this.axios({
        method: 'post',
        url: ShowQuestionnaireTitle,
        data: {
          questionnaireId: questionnaireId
        }
      }).then(res => {
        this.questionarieTitle = res.data.data.questionnaire.questionarieTitle
        console.log(res.data.data);

      }).catch(error => {
            console.log(error);
          });
    }
  }
}
</script>