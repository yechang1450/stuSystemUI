<template>
    <div>
       
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID"> </el-table-column>
            <el-table-column prop="classNo" label="班级编号"></el-table-column>
            <el-table-column prop="teacherNos" label="老师号"></el-table-column>
            <el-table-column prop="courseNo" label="课程号"> </el-table-column>
            <el-table-column prop="usualWeight" label="平时成绩权重"> </el-table-column>
            <el-table-column prop="testWeight" label="考试成绩权重"> </el-table-column>
            <el-table-column prop="classHoursLeft" label="剩余课时"> </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="editorHandleClick(scope.row)" size="small">编辑</el-button>
                    <el-button type="text" @click="deleteHandleClick(scope.row)" size="small">删除</el-button>
                    <el-button type="text" @click="ruleHandleClick(scope.row)" size="small">规则</el-button>
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
         <el-dialog :title="isEditor ? '编辑' : '添加'" :visible.sync="dialogAddFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-input type="hidden" v-model="form.id" autocomplete="off" disabled></el-input>
                <el-form-item label="班级号" prop="courseName">
                    <el-input v-model="form.classNo" placeholder="请输入内容" disabled></el-input>
                </el-form-item>
                <el-form-item label="老师号" prop="teacherNos">
                    <el-input v-model="form.teacherNos" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="课程号" prop="courseNo">
                    <el-input v-model="form.courseNo" placeholder="请输入内容" disabled></el-input>
                </el-form-item>
                <el-form-item label="平时成绩权重" prop="usualWeight">
                    <el-input v-model="form.usualWeight" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="考试成绩权重" prop="testWeight">
                    <el-input v-model="form.testWeight" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="剩余课时" prop="classHoursLeft">
                    <el-input v-model="form.classHoursLeft" placeholder="请输入内容" disabled></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                <el-switch
                    v-model="form.status"
                    active-text="开课"
                    inactive-text="闭课"
                    :active-value="1"
                    :inactive-value="0"
                >
                </el-switch>
                
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
    import { LIST_ADDED_CLASSCOURSE,
    DELETE_CLASSCOURSE,
    UPDATE_CLASSCOURSE} from "../../utils/api-manager.js";
    export default {        
        data() {
                    var isDecimal=(rule, value, callback) => {
                    if (!value) {
                        return callback(new Error('输入不可以为空'));
                    }
                    setTimeout(() => {
                        if (!Number(value)) {
                        callback(new Error('请输入[0,1]之间的数字'));
                        } else {
                        if (value < 0 || value > 1) {
                            callback(new Error('请输入[0,1]之间的数字'));
                        } else {
                            callback();
                        }
                        }
                    }, 100);
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
                id:[],
                searchForm: {
                    deleteFlag:0,
                },
                isEditor: false,
                dialogAddFormVisible: false,
                form: {
                    id:"",
                    courseNo: "",
                    courseName:"",
                    credit: "",
                    classHours: "",
                    introduction: "",
                    coursePurpose: "",
                    status:"",
                },
                formLabelWidth: '120px',
                rules: {
                    classNo: [{
                        required: true,
                        message: '请输入班级号',
                        trigger: 'blur'
                    }],courseNo: [{
                        required: true,
                        message: '请输入课程号',
                        trigger: 'blur'
                    }],usualWeight: [{
                        trigger: 'blur',
                        validator: isDecimal
                    }],testWeight: [{
                        trigger: 'blur',
                        validator: isDecimal
                    }],classHoursLeft: [{
                        required: true,
                        "pattern": /^[0-9]*$/,
                        message: '请输入数字',
                        trigger: 'blur'
                    }],status: [{
                        required: true,
                        message: '请输入状态',
                        trigger: 'blur'
                    }]
                },
                courseid:"",
                classes:null,
                courses:null,
                userName:null
            };
        },
        created: function () {
            let jsonStr = sessionStorage.getItem('userDetail');
            this.userName = JSON.parse(jsonStr).username;
            this.getParams()
            this.listAllCourse();
        },
         watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            $route: 'getParams'
        },
        methods: {
            getParams() {
            // 取到路由带过来的参数
                const res = this.$route.query.id
                this.courseid=res;
                console.log('getParams', res)
            },
            listAllCourse: function () {
                let url = LIST_ADDED_CLASSCOURSE+"/"+parseInt(this.courseid);
                console.info(url);
                console.info(this.$data.searchForm);
                this.axios({
                    method: "GET",
                    url: url,
                }).then((res) => {
                    let code = res.status;
                    console.info("6666");
                    console.info(res);
                    //res.data.data.result
                    console.info( res.data.data.pageInfo.list);
                    if (code == 200) {
                        this.$data.tableData = res.data.data.pageInfo.list;
                    } else {
                        this.$message.error("加载资源失败");
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            editorHandleClick: function (row) {
                console.log(row);
                this.isEditor = true;
                this.dialogAddFormVisible = true;
                this.$data.form = row;
            },
            
            ruleHandleClick: function (row) {
                this.$router.push({
                    path: "/ManagerClassCourseRule",
                    query: {
                        id: row.id,
                        classNo:row.classNo,
                        teachersNos:row.teachersNos,
                        courseNo:row.courseNo
                        }
                    });
            },
            saveOrUpdate: function() {
                this.$refs['form'].validate((valid) => {
                    console.info(valid);
                    if (valid) {
                        this.axios({
                            method: 'POST',
                            url: UPDATE_CLASSCOURSE,
                            data: this.$data.form
                        }).then(res => {
                            console.info(res);
                            console.info(res.status);
                            console.info("status");
                            let code = res.status;
                            if (code == 200) {
                                this.listAllCourse();
                                this.$data.dialogAddFormVisible = false;
                                
                                this.$message.success('修改成功');
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
            handleSelectionChange:function(val){
                console.log("handleSelectionChange--",val);
                this.tableChecked=val;
            },
            handleCurrentChange: function (val) {
                console.log(`当前页: ${val}`);
            },
            deleteHandleClick: function(row) {
                
                let url = DELETE_CLASSCOURSE+"/"+parseInt(this.courseid);
                console.info(url);
                this.id.push(row.id);
                console.info(this.id);
                this.axios({
                    method: "POST",
                    url: url,
                    data:this.id,
                }).then((res) => {
                    let code = res.status;
                    console.info(res);
                    if (code == 200) {
                        this.$message.success("删除成功");
                        this.listAllCourse();
                    } else {
                        this.$message.error("删除失败");
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
        },
    };
</script>

<style scoped>

</style>