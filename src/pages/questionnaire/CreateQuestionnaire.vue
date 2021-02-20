<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="创建调查问卷">
      <el-input v-model="form.questionarieTitle" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { CreateQuestionnaire } from '../../utils/questionnaireApi.js';
export default {
  name: "CreateQuestionnaire",
  data() {
    return {
      form: {
        questionarieTitle: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.axios({
        method: 'post',
        url: CreateQuestionnaire,
        data: {
          questionarieTitle: this.form.questionarieTitle
        }
      }).then(res => {
        console.log(res.data);

      }).catch(error => {
            console.log(error);
          });

      console.log(this.form.questionarieTitle);
      console.log('submit!');
    }
  }
}
</script>