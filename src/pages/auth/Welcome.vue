<template>
  <div>
    <el-row type="flex" justify="space-around">
      <el-col span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>我是学生</span>
            <i class="el-icon-sugar"></i>
          </div>
          <div class="show">
            <el-button type="primary" @click="addStudent">完善信息</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col span="10">
        <el-card class="box-card">
          <div slot="header">
            <span>我是教师</span>
            <i class="el-icon-sugar"></i>
          </div>
          <div class="show">
            <el-button type="success">完善信息</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="'绑定学生账户'" :visible.sync="dialogStudentFormVisible">
      <el-form :model="studentForm" :rules="rules" ref="studentForm">
        <el-input
          type="hidden"
          v-model="studentForm.id"
          autocomplete="off"
        ></el-input>
        <el-form-item
          prop="studentName"
          label="姓名"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="studentForm.studentName"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="sex" label="性别" :label-width="formLabelWidth">
          <el-switch
            v-model="studentForm.sex"
            active-text="女"
            inactive-text="男"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item
          prop="phoneNumber"
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="studentForm.phoneNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
         <el-form-item
          prop="personalSignature"
          label="个人签名"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="studentForm.personalSignature"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('studentForm')">重 置</el-button>

        <el-button type=" primary" @click="bindStudent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {BIND_STUDENT_URL} from "../../utils/api-bind.js";
export default {
  name: "Welcome",
  data() {
    return {
      dialogStudentFormVisible: false,
      studentForm: {
        id: "",
        studentName: "",
        sex: true,
        phoneNumber: "",
        personalSignature: "",
      },
      formLabelWidth: "120px",
      rules: {
       
      },
    };
  },
  created: function () {},
  methods: {
    addStudent: function () {
      this.$data.dialogStudentFormVisible = true;
      this.$data.studentForm.id = 0;
      this.$nextTick(() => {
        this.$refs["studentForm"].resetFields();
      });
    },
     bindStudent: function() {
        // if(this.$data.isEditor == false){
        //   this.$data.form.createtime = new Date();
        //   this.$data.form.updatetime = new Date();
        // }else{
        //   this.$data.form.updatetime = new Date();
        // }
				this.$refs['studentForm'].validate((valid) => {
					if (valid) {
						this.axios({
							method: 'POST',
							url: BIND_STUDENT_URL,
							data: this.studentForm
						}).then(res => {
					
							let code = res.data.code
					
							if (code == 200) {

                this.$data.dialogStudentFormVisible = false
                this.$message.success('完善成功');
                this.$router.replace({
								path: 'index'
							});
							} else {
								this.$message.error('操作失败');
							}

						}).catch(error => {
							console.log(error);
						});
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
		},
  },
};
</script>
<style >
.show {
  /* background-color: red; */
  height: 400px;
}
</style>