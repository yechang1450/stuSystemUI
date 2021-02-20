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
                <el-form-item label="选择课程" prop="courseNo">
                    <el-select v-model="searchForm.courseNo" placeholder="请选择" @change="classesChange">
                        <el-option
                                v-for="item in courses"
                                :key="item.courseNo"
                                :label="item.courseName"
                                :value="item.courseNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">查 询</el-button>
                    <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID"> </el-table-column>
            <el-table-column prop="teacherName" label="教师姓名">
            </el-table-column>
            <el-table-column prop="className" label="所属班级">
            </el-table-column>
            <el-table-column prop="courseName" label="课程名称">
            </el-table-column>
            <el-table-column prop="sectionNum" label="节次"> </el-table-column>
            <el-table-column prop="weekNum" label="周次"> </el-table-column>
            <el-table-column prop="startTime" label="开始时间" :formatter="timeFormat"> </el-table-column>
            <el-table-column prop="endTIme" label="结束时间" :formatter="timeFormat"> </el-table-column>
            <el-table-column prop="preview" label="预习内容"> </el-table-column>
            <el-table-column prop="courseContent" label="本次上课内容"> </el-table-column>
            <el-table-column prop="homework" label="课后作业" ></el-table-column>
            <el-table-column prop="creatorId" label="创建人"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button
                            type="text"
                            @click="editorHandleClick(scope.row)"
                            size="small"
                    >编辑</el-button
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
                <el-form-item label="班级" prop="classNo">
                    <el-select v-model="form.classNo" placeholder="请选择" disabled >
                        <el-option
                                v-for="item in classes"
                                :key="item.classNo"
                                :label="item.className"
                                :value="item.classNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程" prop="courseNo">
                    <el-select v-model="form.courseNo" placeholder="请选择" disabled>
                        <el-option
                                v-for="item in courses"
                                :key="item.courseNo"
                                :label="item.courseName"
                                :value="item.courseNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="教师" prop="teacherName">
                    <el-input v-model="form.teacherName" placeholder="请输入内容" disabled></el-input>
                </el-form-item>
                <el-form-item label="节次" prop="sectionNum">
                    <el-input v-model="form.sectionNum" placeholder="请输入内容" disabled></el-input>
                </el-form-item>
                <el-form-item label="周次" prop="weekNum">
                    <el-input v-model="form.weekNum" placeholder="请输入内容" disabled></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-time-picker
                            v-model="form.startTime"
                            :picker-options="{
                              selectableRange: '00:00:00 - 23:59:59'
                            }"
                            disabled
                            placeholder="任意时间点">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTIme">
                    <el-time-picker
                            v-model="form.endTIme"
                            :picker-options="{
                              selectableRange: '00:00:00 - 23:59:59'
                            }"
                            disabled >
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="需要预习的内容" prop="preview">
                    <el-input type="textarea" v-model="form.preview"></el-input>
                </el-form-item>
                <el-form-item label="本次上课内容" prop="courseContent">
                    <el-input type="textarea" v-model="form.courseContent"></el-input>
                </el-form-item>
                <el-form-item label="课后作业" prop="homework">
                    <el-input type="textarea" v-model="form.homework"></el-input>
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
    import { LIST_TEACHER_COURSE_URL,
        UPDATE_TEACHER_COURSE_URL,
        LIST_COURSES,
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
                    classNo: "",
                    courseName: "",
                    teacherName: "",
                    sectionNum: "",
                    weekNum: "",
                    startTime:"",
                    endTIme:"",
                    preview:"",
                    courseContent:"",
                    homework:""
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

                let url2 = LIST_COURSES;
                //列出科目
                this.axios({
                    method: "POST",
                    url: url2
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
            //根据班级列出科目
            classesChange: function () {
                this.$forceUpdate();

            },
            pageScoreInfo: function () {
                let url = LIST_TEACHER_COURSE_URL + "/" + this.currentPage + "/" + this.pageSize;

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
                this.$data.form.updatetime = new Date();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.axios({
                            method: 'POST',
                            url: UPDATE_TEACHER_COURSE_URL,
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
            },
            editorHandleClick: function (row) {
                console.log(row);
                this.isEditor = true;
                this.dialogAddFormVisible = true;
                this.$data.form = row;
            },
            handleSelectionChange:function(val){
                console.log("handleSelectionChange--",val);
                this.tableChecked=val;
            },
            handleCurrentChange: function (val) {
                console.log(`当前页: ${val}`);
            },
            hangFormatter: function (row, column, cellValue) {
                return cellValue == 0 ? "通过" : "挂科";
            },
            timeFormat:function(row,column,value){
                var t=new Date(value);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds();
            },
            dateFormat:function(row,column,value){
                var t=new Date(value);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds();
            }
        },
    };
</script>

<style scoped>

</style>