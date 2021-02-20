<template>
    <div>
        <el-row>
            <el-form
                    :inline="true"
                    :model="searchForm"
                    ref="searchForm"
                    class="demo-form-inline"
            >
                <el-form-item label="选择班级" prop="classNo">
                    <el-select v-model="searchForm.classNo" placeholder="请选择" @change="classesChange">
                        <el-option
                                v-for="item in classes"
                                :key="item.classNo"
                                :label="item.className"
                                :value="item.classNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择学生" prop="studentNo">
                    <el-select v-model="searchForm.studentNo" placeholder="请选择">
                        <el-option
                                v-for="item in students"
                                :key="item.studentNo"
                                :label="item.studentName"
                                :value="item.studentNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否挂科" prop="isHang">
                    <el-radio-group v-model="searchForm.isHang">
                        <el-radio label="挂科" value="0"></el-radio>
                        <el-radio label="通过" value="1"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">查 询</el-button>
                    <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-button type="primary" @click="addHandleClick">添加</el-button>
            <el-button type="primary" @click="batchDelete(tableChecked)">批量删除</el-button>
            <p />
        </el-row>
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID"> </el-table-column>
            <el-table-column prop="studentName" label="学生姓名">
            </el-table-column>
            <el-table-column prop="className" label="所属班级">
            </el-table-column>
            <el-table-column prop="courseName" label="课程名称">
            </el-table-column>


<!--            <el-table-column prop="score" label="分数" >-->
<!--            </el-table-column>-->
            <el-table-column prop="scorelevel" label="评价"> </el-table-column>
            <el-table-column prop="appraise" label="评语"> </el-table-column>
            <el-table-column prop="usualGrades" label="平时成绩"> </el-table-column>
            <el-table-column prop="testGrades" label="考试成绩"> </el-table-column>
            <el-table-column prop="grade" label="总成绩"> </el-table-column>
            <el-table-column prop="isHang" label="是否挂科" :formatter="hangFormatter">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button
                            type="text"
                            @click="editorHandleClick(scope.row)"
                            size="small"
                    >编辑</el-button
                    >
                    <el-button
                            @click="deleteHandleClick(scope.row)"
                            type="text"
                            v-auth="['/role/delete']"
                            size="small"
                    >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
                background
                layout="prev, pager, next"
                :total="totalCount"
        >
        </el-pagination>

        <el-dialog
                :title="isEditor ? '编辑' : '添加'"
                :visible.sync="dialogAddFormVisible"
        >
            <el-form :model="form" :rules="rules" ref="form">
                <el-input type="hidden" v-model="form.id" autocomplete="off"></el-input>
                <el-form-item label="选择班级" prop="classNo">
                    <el-select v-model="form.classNo" placeholder="请选择" @change="classesChange">
                        <el-option
                                v-for="item in classes"
                                :key="item.classNo"
                                :label="item.className"
                                :value="item.classNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择学生" prop="studentNo">
                    <el-select v-model="form.studentNo" placeholder="请选择" @change="studentChange">
                        <el-option
                                v-for="item in students"
                                :key="item.studentNo"
                                :label="item.studentName"
                                :value="item.studentNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择课程" prop="courseNo">
                    <el-select v-model="form.courseNo" placeholder="请选择">
                        <el-option
                                v-for="item in courses"
                                :key="item.courseNo"
                                :label="item.courseName"
                                :value="item.courseNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="评价" prop="scorelevel">
                    <el-radio-group v-model="form.scorelevel">
                        <el-radio :label="1" value="1">差</el-radio>
                        <el-radio :label="2" value="2">及格</el-radio>
                        <el-radio :label="3" value="3">良</el-radio>
                        <el-radio :label="4" value="4">优</el-radio>
                        <el-radio :label="5" value="5">满分</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="评语" prop="appraise">
                    <el-input v-model="form.appraise" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="平时成绩" prop="usualGrades">
                    <el-input v-model="form.usualGrades" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="考试成绩" prop="testGrades">
                    <el-input v-model="form.testGrades" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')" v-if="!isEditor">重 置</el-button>
                <el-button @click="dialogAddFormVisible = false" v-if="isEditor"
                >取 消</el-button
                >
                <el-button type=" primary" @click="saveOrUpdate">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { LIST_TEACHER_SCORE_URL,
        ADD_TEACHER_SCORE_URL,
        UPDATE_TEACHER_SCORE_URL,
        DELETE_MANY_TEACHER_SCORE_URL,
        LIST_COURSES_BY_CLASSNO,
        LIST_STUDENTS,
        LIST_ALL_CLASSES} from "../../utils/api-teacher.js";
    export default {
        data() {
            var checkGrade = (rule, value, callback) => {
                if(value === "" || value ==null){
                    return callback(new Error('请输入标准的数值类型！'));
                }
                if(isNaN(value)){
                    //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
                    //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
                    return callback(new Error('请输入标准的数值类型！'));
                }else if (value < 0 || value > 100){
                    return callback(new Error('分数需要在0和100之间！'));
                }else {
                   return  callback();
                }
            };
            return {
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 1,
                pageSize: 10,
                tableData: [],
                tableChecked:[],//被选中的记录
                ids:[],//批量删除的id
                searchForm: {
                    classNo: "",
                    studentNo: "",
                    isHang:""
                },
                isEditor: false,
                dialogAddFormVisible: false,
                form: {
                    id:"",
                    studentNo: "",
                    courseNo: "",
                    classNo: "",
                    scorelevel: "",
                    appraise: "",
                    usualGrades:"",
                    testGrades:""
                },
                formLabelWidth: '120px',
                rules: {
                    studentNo: [{
                        required: true,
                        message: '请选择学生',
                        trigger: 'blur'
                    }],classNo: [{
                        required: true,
                        message: '请选择班级',
                        trigger: 'blur'
                    }],courseNo: [{
                        required: true,
                        message: '请选择课程',
                        trigger: 'blur'
                    }],scorelevel: [{
                        required: true,
                        message: '请选择评价',
                        trigger: 'blur'
                    }],appraise: [{
                        required: true,
                        message: '请输入评语',
                        trigger: 'blur'
                    }],usualGrades: [{
                        trigger: 'blur',
                        validator: checkGrade
                    }],testGrades: [{
                        trigger: 'blur',
                        validator: checkGrade
                    }],
                },
                classes:null,
                students:null,
                courses:null,
                userName:null
            };
        },
        created: function () {
            let jsonStr = sessionStorage.getItem('userDetail');
            this.userName = JSON.parse(jsonStr).username;

            this.listAllClasses();
            this.pageScoreInfo();
        },
        methods: {
            //列出所有的班级
            listAllClasses: function () {
                let url = LIST_ALL_CLASSES+'?userName='+this.userName;
                this.axios({
                    method: "GET",
                    url: url
                })
                    .then((res) => {
                        let code = res.data.code;
                        if (code == 200) {
                            this.$data.classes = res.data.data;
                        } else {
                            this.$message.error("加载资源失败");
                        }
                    })
                    .catch((error) => {
                        // this.$message.error('加载资源失败');
                        console.log(error);
                    });
            },
            //根据班级列出学生与科目
            classesChange: function (e) {
                this.$forceUpdate();
                let url = LIST_STUDENTS+'?classNo='+e;
                let url2 = LIST_COURSES_BY_CLASSNO;
                this.axios({
                    method: "GET",
                    url: url
                })
                    .then((res) => {
                        let code = res.data.code;
                        if (code == 200) {
                            this.$data.students = res.data.data;
                        } else {
                            this.$message.error("加载资源失败");
                        }
                    })
                    .catch((error) => {
                        // this.$message.error('加载资源失败');
                        console.log(error);
                    });

                var formData=new FormData();
                formData.append('classNo',e);
                formData.append('userName',this.userName);
                //列出科目
                this.axios({
                    method: "POST",
                    url: url2,
                    data: formData
                })
                    .then((res) => {
                        let code = res.data.code;
                        if (code == 200) {
                            this.$data.courses = res.data.data;
                        } else {
                            this.$message.error("加载资源失败");
                        }
                    })
                    .catch((error) => {
                        // this.$message.error('加载资源失败');
                        console.log(error);
                    });
            },
            //根据班级列出学生与科目
            studentChange: function () {
                this.$forceUpdate();
            },
            pageScoreInfo: function () {
                let url = LIST_TEACHER_SCORE_URL + "/" + this.currentPage + "/" + this.pageSize;

                var formData=new FormData();
                formData.append('studentGrade', this.$data.searchForm);
                formData.append('userName',this.userName);
                this.axios({
                    method: "POST",
                    url: url,
                    data: formData,
                })
                    .then((res) => {
                        let code = res.data.code;
                        if (code == 200) {
                            this.$data.tableData = res.data.data.records;
                            this.$data.totalCount = res.data.data.total;
                            this.$data.currentPage = res.data.data.current;
                        } else {
                            this.$message.error("加载资源失败");
                        }
                    })
                    .catch((error) => {
                        // this.$message.error('加载资源失败');
                        console.log(error);
                    });
            },
            onSearch: function () {
                this.pageScoreInfo();
            },
            resetSearchForm: function (formName) {
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                    this.onSearch();
                });
            },
            addHandleClick: function() {
                this.$data.isEditor = false;
                this.$data.dialogAddFormVisible = true
                this.$data.form.id = 0;
                this.$nextTick(() => {
                    this.$refs['form'].resetFields();
                })
            },
            saveOrUpdate: function() {
                if(this.$data.isEditor == false){
                    this.$data.form.createtime = new Date();
                    this.$data.form.updatetime = new Date();
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            this.axios({
                                method: 'POST',
                                url: ADD_TEACHER_SCORE_URL,
                                data: this.form
                            }).then(res => {
                                let code = res.data.code
                                if (code == 200) {
                                    this.pageScoreInfo();
                                    this.$data.dialogAddFormVisible = false
                                } else {
                                    this.$message.error('操作失败');
                                }

                            }).catch(error => {
                                console.log(error);
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }else{
                    this.$data.form.updatetime = new Date();
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            this.axios({
                                method: 'POST',
                                url: UPDATE_TEACHER_SCORE_URL,
                                data: this.form
                            }).then(res => {
                                let code = res.data.code
                                if (code == 200) {
                                    this.pageScoreInfo();
                                    this.$data.dialogAddFormVisible = false
                                } else {
                                    this.$message.error('操作失败');
                                }

                            }).catch(error => {
                                console.log(error);
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }

            },
            editorHandleClick: function (row) {
                console.log(row);
                this.isEditor = true;
                this.dialogAddFormVisible = true;
                this.$data.form = row;
                // let url = UPDATE_TEACHER_SCORE_URL + "/" + row.id;
                // this.axios({
                //     method: "GET",
                //     url: url,
                //     data: {},
                // })
                //     .then((res) => {
                //         console.log(res.data);
                //         let code = res.data.code;
                //         console.log(JSON.stringify(res.data));
                //         if (code == 200) {
                //             this.$data.form = res.data.data;
                //         } else {
                //             this.$message.error("加载资源失败");
                //         }
                //     })
                //     .catch((error) => {
                //         // this.$message.error('加载资源失败');
                //         console.log(error);
                //     });
            },
            deleteHandleClick: function(row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$data.ids.push(row.id)
                    this.delete()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            delete: function() {
                let data = this.$data.ids
                console.log(data)
                let ids = [];
                let i  = 0;
                data.forEach((e)=>{
                    ids[i++] = e;
                })
                let url = DELETE_MANY_TEACHER_SCORE_URL

                this.axios({
                    method: 'POST',
                    url: url,
                    data: ids

                }).then(res => {
                    console.log(res.data);
                    let code = res.data.code
                    console.log(JSON.stringify(res.data))
                    this.$data.ids = new Array()
                    if (code == 200) {
                        this.pageScoreInfo();
                    }  else {
                        this.$message.error('操作失败');
                    }

                }).catch(error => {
                    console.log(error);
                });
            },
            handleSelectionChange:function(val){
                console.log("handleSelectionChange--",val);
                this.tableChecked=val;
            },
            batchDelete:function(rows){
                let _this = this;
                console.log(rows.length);
                if(rows.length <= 0 ){
                    this.$message.warning('请先选择需要删除的数据');
                    return;
                }
                _this.$confirm('是否删除选中的所有用户?删除后无法恢复!','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    rows.forEach(element =>{
                        _this.ids.push(element.id)
                    })
                    this.delete()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleCurrentChange: function (val) {
                console.log(`当前页: ${val}`);
            },
            hangFormatter: function (row, column, cellValue) {
                return cellValue == 0 ? "通过" : "挂科";
            },
        },
    };
</script>

<style scoped>

</style>