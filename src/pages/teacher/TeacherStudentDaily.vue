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
                <el-form-item label="选择事件类型" prop="eventType">
                    <el-select v-model="searchForm.eventType" placeholder="请选择">
                        <el-option
                                v-for="item in eventTypes"
                                :key="item.eventNo"
                                :label="item.eventName"
                                :value="item.eventNo">
                        </el-option>
                    </el-select>
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
            <el-table-column prop="eventTitle" label="事件标题">
            </el-table-column>

            <el-table-column prop="event" label="事件内容"> </el-table-column>
            <el-table-column prop="eventType" label="事件类别" :formatter="eventTypeFormatter"> </el-table-column>
            <el-table-column prop="remarks" label="备注"> </el-table-column>
            <el-table-column prop="createtime" label="创建时间" :formatter="dateFormat"> </el-table-column>
            <el-table-column prop="creatorld" label="创建人"> </el-table-column>
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
                <el-form-item label="选择事件类型" prop="eventType">
                    <el-select v-model="form.eventType" placeholder="请选择" @change="studentChange">
                        <el-option
                                v-for="item in eventTypes"
                                :key="item.eventNo"
                                :label="item.eventName"
                                :value="item.eventNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="输入事件标题" prop="eventTitle">
                    <el-input v-model="form.eventTitle"></el-input>
                </el-form-item>
                <el-form-item label="输入事件内容" prop="event">
                    <el-input type="textarea" v-model="form.event"></el-input>
                </el-form-item>
                <el-form-item label="输入备注" prop="remarks">
                    <el-input type="textarea" v-model="form.remarks"></el-input>
                </el-form-item>

                <el-form-item label="活动时间">
                    <el-date-picker
                            v-model="form.timePoint"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            :picker-options="pickerOptions">
                    </el-date-picker>
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
    import { LIST_TEACHER_STUDENT_DAILY_URL,
        ADD_TEACHER_STUDENT_DAILY_URL,
        UPDATE_TEACHER_STUDENT_DAILY_URL,
        DELETE_MANY_STUDENT_DAILY_URL,
        LIST_COURSES_BY_CLASSNO,
        LIST_STUDENTS,
        LIST_ALL_CLASSES} from "../../utils/api-teacher.js";
    export default {
        data() {
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
                    timePoint: "",
                    eventTitle: "",
                    event: "",
                    eventType: "",
                    remarks:""
                },
                formLabelWidth: '120px',
                rules: {
                    studentNo: [{
                        required: true,
                        message: '请选择学生',
                        trigger: 'blur'
                    }],timePoint: [{
                        required: true,
                        message: '请选择事件发生时间',
                        trigger: 'blur'
                    }],eventTitle: [{
                        required: true,
                        message: '请输入事件标题',
                        trigger: 'blur'
                    }],event: [{
                        required: true,
                        message: '请输入事件内容',
                        trigger: 'blur'
                    }],eventType: [{
                        required: true,
                        message: '请选择事件类型',
                        trigger: 'blur'
                    }]
                },
                classes:null,
                students:null,
                courses:null,
                eventTypes: [
                    {
                        eventNo: null,
                        eventName: '所有事件'
                    },
                    {
                        eventNo: 0,
                        eventName: '系统事件'
                    },
                    {
                        eventNo: 1,
                        eventName: '奖励事件'
                    },
                    {
                        eventNo: 2,
                        eventName: '惩罚事件'
                    },
                    {
                        eventNo: 10,
                        eventName: '学生自行添加事件'
                    }
                ],
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
            };
        },
        created: function () {
            this.listAllClasses();
            this.pageScoreInfo();
        },
        methods: {
            //列出所有的班级
            listAllClasses: function () {
                let url = LIST_ALL_CLASSES;
                this.axios({
                    method: "GET",
                    url: url
                })
                    .then((res) => {
                        let code = res.data.code;
                        if (code == 200) {
                            this.$data.classes = res.data.data;
                            this.$data.classes[res.data.data.length] = {
                                "classNo": null,
                                "className": '所有班级',
                            }
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
                            this.$data.students[res.data.data.length] = {
                                "studentNo": null,
                                "studentName": '所有学生',
                            }
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
                let url = LIST_TEACHER_STUDENT_DAILY_URL + "/" + this.currentPage + "/" + this.pageSize;


                this.axios({
                    method: "POST",
                    url: url,
                    data: this.$data.searchForm,
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
            resetForm: function (formName) {
                //console.log(formName);
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
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
                                url: ADD_TEACHER_STUDENT_DAILY_URL,
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
                                url: UPDATE_TEACHER_STUDENT_DAILY_URL,
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
                let url = DELETE_MANY_STUDENT_DAILY_URL

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
            eventTypeFormatter: function (row, column, cellValue) {
                switch (cellValue) {
                    case 0: return '系统事件';
                    case 1: return '奖励事件';
                    case 2: return '惩罚事件';
                    case 10: return '学生自行添加事件';
                }

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