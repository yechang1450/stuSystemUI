<template>
  <div id="questionnaireQuestion">
    <div id="questionnaireTitle">
      <h1 align="center">{{questionarieTitle}}</h1>
    </div>
    <div v-for="(question,index) in questionnaireQuestion" :key="index" style="margin-left:800px">
      <el-form>
      <div v-if="question.questionType == '填空题'">
        <span style="font-size: 18px;line-height: 1.7">{{index+1}}.{{question.questionTitle}}</span>

          <el-form-item>
            <el-input style="width:300px" v-model="question.answer" :placeholder=question.questionTitle></el-input>
          </el-form-item>
      </div>
      <div v-else-if="question.questionType == '单选题'">
        <span style="font-size: 18px;line-height: 1.7">{{index+1}}.{{question.questionTitle}}</span>

          <el-form-item>
            <el-radio-group v-model="question.answer" v-for="(option, index) in question.questionnaireOptionList" :key="index">
              <el-radio :label=option.optionContent></el-radio>
            </el-radio-group>
          </el-form-item>

      </div>
      <div v-else-if="question.questionType == '多选题'">
        <span style="font-size: 18px;line-height: 1.7">{{index+1}}.{{question.questionTitle}}</span>
          <el-form-item>
            <el-checkbox-group v-model="question.duoxuankuang" >
              <el-checkbox :label=option.optionContent v-for="(option, index) in question.questionnaireOptionList" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
      </div>
      </el-form>
    </div>
    <el-button type="primary" @click="answer" style="margin-left:800px">立即提交</el-button>
  </div>

</template>

<script>
import { ShowQuestionnaireQuestion } from '../../utils/questionnaireApi.js';
import { AnswerQuestionnaire } from '../../utils/questionnaireApi.js';
export default {
  name: "questionnaireQuestion",
  data() {
    return {
      questionarieTitle: '',

      questionnaireQuestion: [
        {
          id:'',
          questionId:'',
          questionType:'',
          questionTitle:'',
          questionaireId:'',
          questionnaireOptionList:[
            {
              id:'',
              optionContent:'',
              optionId:'',
              questionId:'',
              questionnaireId:''
            }
          ]
        }
      ]
    }
  },
  methods:{
    render:function(){
      let questionnaireId = '1';
      this.axios({
        method: 'post',
        url: ShowQuestionnaireQuestion,
        data: {
          questionnaireId: questionnaireId
        }
      }).then(res => {
        this.questionarieTitle = res.data.data.questionnaire.questionarieTitle;
        this.questionnaireQuestion = res.data.data.questionnaireQuestion;
        for (let i = 0;i < res.data.data.questionnaireQuestion.length; i++){
          this.$set(this.questionnaireQuestion[i],"answer","");
          this.$set(this.questionnaireQuestion[i],"duoxuankuang",[]);
        }

      }).catch(error => {
        console.log(error);
      });
    },
    answer:function () {
      console.log(this.questionnaireQuestion)



      for (let i = 0;i < this.questionnaireQuestion.length ;i++){

        if(this.questionnaireQuestion[i].questionType == '多选题'){
          let join = this.questionnaireQuestion[i].duoxuankuang.join(';');
          this.questionnaireQuestion[i].answer = join;
        }
      }
      console.log(this.questionnaireQuestion)

      this.axios({
        method: 'post',
        url: AnswerQuestionnaire,
        data: this.questionnaireQuestion
      }).then(res => {
        console.log(res.data)
      }).catch(error => {
        console.log(error);
      });
    }

  },
  created: function () {
    this.render()
  }
}
</script>