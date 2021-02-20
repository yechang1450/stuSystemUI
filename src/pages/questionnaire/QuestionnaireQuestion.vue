<template >
  <div id="questionnaireQuestion">
    <div id="questionnaireTitle">
      <h1 align="center">{{questionarieTitle}}</h1>
    </div>
    <div v-for="(question,index) in questionnaireQuestion" :key="index" style="margin-left:800px">
      <div v-if="question.questionType == '填空题'">
        <span style="font-size: 18px;line-height: 1.7">{{index+1}}.{{question.questionTitle}}</span>
        <el-form >
           <el-form-item>
            <el-input style="width:300px" v-model="question.answer" :placeholder=question.questionTitle></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-left: 150px">
          <el-button size="small" type="primary" @click="editQuestion(question.questionaireId,question.questionId)" round>修改</el-button>
          <el-button size="small" type="danger" @click="deleteQuestion(question.questionaireId,question.questionId)" round>删除</el-button>
        </div>
      </div>
      <div v-else-if="question.questionType == '单选题'">
        <span style="font-size: 18px;line-height: 1.7">{{index+1}}.{{question.questionTitle}}</span>
        <el-form >
          <el-form-item>
            <el-radio-group v-model="question.answer" v-for="(option, index) in question.questionnaireOptionList" :key="index">
              <el-radio :label=option.optionContent></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="margin-left: 150px">
          <el-button size="small" type="primary" @click="editQuestion(question.questionaireId,question.questionId)" round>修改</el-button>
          <el-button size="small" type="danger" @click="deleteQuestion(question.questionaireId,question.questionId)" round>删除</el-button>
        </div>
      </div>
      <div v-else-if="question.questionType == '多选题'">
        <span style="font-size: 18px;line-height: 1.7">{{index+1}}.{{question.questionTitle}}</span>
        <el-form>
          <el-form-item>
            <el-checkbox-group v-model="question.duoxuankuang" v-for="(option, index) in question.questionnaireOptionList" :key="index">
              <el-checkbox :label=option.optionContent name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div style="margin-left: 150px">
          <el-button size="small" type="primary" @click="editQuestion(question.questionaireId,question.questionId)" round>修改</el-button>
          <el-button size="small" type="danger" @click="deleteQuestion(question.questionaireId,question.questionId)" round>删除</el-button>
        </div>
      </div>
    </div>

  </div>

</template>
<script>
import { ShowQuestionnaireQuestion } from '../../utils/questionnaireApi.js';
import { DeleteQuestionnaireQuestion } from '../../utils/questionnaireApi.js';
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
      //let questionnaireId = '1';
      this.axios({
        method: 'post',
        url: ShowQuestionnaireQuestion,
        params: {
          questionnaireId :'1'
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
    editQuestion:function (questionnaireId,questionId) {
      console.log(questionnaireId)
      console.log(questionId)
    },
    deleteQuestion:function (questionnaireId,questionId) {
      this.$confirm('此操作将永久删除该试卷问题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: DeleteQuestionnaireQuestion,
          data: {
            questionId:questionId,
            questionaireId: questionnaireId
          }
        }).then(res => {
          console.log(res)
          this.$message({
            type: 'info',
            message: res.data.msg
          });
          this.render()
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

      console.log(questionnaireId)
      console.log(questionId)
    }
  },
  created: function () {
      this.render()
  }
}
</script>