<template>
    <div>
        <el-row>
            <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
                <el-form-item label="课程编号" prop="courseNo">
                    <el-input v-model="searchForm.courseNo" placeholder="课程编号"></el-input>
                </el-form-item>
                <el-form-item label="课程名" prop="courseName">
                    <el-input v-model="searchForm.courseName" placeholder="课程名"></el-input>
                </el-form-item>
                <el-form-item label="是否开课" prop="status">
                    <el-select v-model="searchForm.status" placeholder="是否开课">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="开课" :value="1"></el-option>
                        <el-option label="闭课" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="onSearch" icon="el-icon-search"></el-button>
                <el-button @click="resetSearchForm('searchForm')" icon="el-icon-refresh-right"></el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
        <!-- 添加 -->
            <el-button type="primary" @click="addHandleClick()" icon="el-icon-circle-plus-outline"></el-button>
            <el-button type="primary" @click="batchDelete(tableChecked)">批量删除</el-button>
            <p />
        </el-row>
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID"> </el-table-column>
            <el-table-column prop="courseNo" label="课程编号"></el-table-column>
            <el-table-column prop="courseName" label="课程名称"> </el-table-column>
            <el-table-column prop="credit" label="学分"></el-table-column>
            <el-table-column prop="classHours" label="课程介绍"> </el-table-column>
            <el-table-column prop="introduction" label="开课介绍"> </el-table-column>
            <el-table-column prop="coursePurpose" label="开课目的"> </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="editorHandleClick(scope.row)" size="small">编辑</el-button>
                    <el-button type="text" @click="deleteHandleClick(scope.row)" size="small">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="课程绑定" width="150">
                <template slot-scope="scope">
                    <el-button type="text" @click="findClassHandleClick(scope.row)" size="small">查看班级</el-button>
                    <el-button type="text" @click="findClassToAddHandleClick(scope.row)" size="small">添加班级</el-button>
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
                <el-input type="hidden" v-model="form.id" autocomplete="off"></el-input>
                <el-form-item label="课程编号" prop="courseNo">
                    <template v-if="isadd">
                        <el-input v-model="form.courseNo" placeholder="请输入内容"></el-input>
                    </template>
                    <template v-else>
                        <el-input v-model="form.courseNo" placeholder="请输入内容" disabled></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="form.courseName" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="学分" prop="credit">
                    <el-input v-model="form.credit" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="学时" prop="classHours">
                    <el-input v-model="form.classHours" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="课程介绍" prop="introduction">
                    <el-input v-model="form.introduction" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="开课目的" prop="coursePurpose">
                    <el-input v-model="form.coursePurpose" placeholder="请输入内容" ></el-input>
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
    import { LIST_ALL_COURSES,
    UPDATE_COURSE,
    DELETE_COURSE,
    DELETEALL_COURSE} from "../../utils/api-manager.js";
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
                    courseNo: "",
                    courseName:"",
                    status:"",
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
                    deleteFlag:0,
                },
                formLabelWidth: '120px',
                rules: {
                    courseNo: [{
                        required: true,
                        message: '请输入课程编号',
                        trigger: 'blur'
                    }],courseName: [{
                        required: true,
                        message: '请输入课程名称',
                        trigger: 'blur'
                    }],credit: [{
                        required: true,
                         "pattern": /^[0-9]*$/,
                        message: '请输入正整数',
                        trigger: 'blur'
                    }],classHours: [{
                        required: true,
                         "pattern": /^[0-9]*$/,
                        message: '请输入正整数',
                        trigger: 'blur'
                    }],introduction: [{
                        required: true,
                        message: '请输入课程介绍',
                        trigger: 'blur'
                    }],coursePurpose: [{
                        required: true,
                        message: '请输入开课目的',
                        trigger: 'blur'
                    }],status: [{
                        required: true,
                        message: '请选择状态',
                        trigger: 'blur'
                    }]
                },
                isadd:false,
                classes:null,
                courses:null,
                userName:null
            };
        },
        created: function () {
            let jsonStr = sessionStorage.getItem('userDetail');
            this.userName = JSON.parse(jsonStr).username;
            this.listAllCourse();
        },
        methods: {
            listAllCourse: function () {
                let url = LIST_ALL_COURSES;
                console.info(url);
                console.info(this.$data.searchForm);
                this.axios({
                    method: "POST",
                    url: url,
                    data: this.$data.searchForm,
                }).then((res) => {
                    let code = res.status;
                    console.info(res);
                    console.info(res.data.data.pageInfo.list);
                    if (code == 200) {
                        this.$data.tableData = res.data.data.pageInfo.list;
                    } else {
                        this.$message.error("加载资源失败");
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            onSearch: function () {
                this.listAllCourse();
            },
             resetSearchForm: function (formName) {
                //console.log(formName);
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                    this.onSearch();
                });
            },
            handleSelectionChange:function(val){
                console.log("handleSelectionChange--",val);
                this.tableChecked=val;
            },
            editorHandleClick: function (row) {
                console.log(row);
                this.isEditor = true;
                this.dialogAddFormVisible = true;
                this.$data.form = row;
            },
            handleCurrentChange: function (val) {
                console.log(`当前页: ${val}`);
            },
            saveOrUpdate: function() {
                this.$refs['form'].validate((valid) => {
                    console.info(valid);
                    if (valid) {
                        this.axios({
                            method: 'POST',
                            url: UPDATE_COURSE,
                            data: this.$data.form
                        }).then(res => {
                            console.info(res);
                            console.info(res.status);
                            console.info("status");
                            let code = res.status;
                            if (code == 200) {
                                this.listAllCourse();
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
            batchDelete: function (rows) {
            let _this = this;
            console.log(rows.length);
            if (rows.length <= 0) {
                this.$message.warning("请先选择需要删除的数据");
                return;
            }
            _this.$confirm("是否删除选中的所有用户?删除后无法恢复!", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                })
                .then(() => {
                    let url = DELETEALL_COURSE;
                    this.ids=[];
                    rows.forEach((element) => {
                        this.ids.push(element.id);
                    });
                    console.info(this.ids);
                    this.axios({
                        method: "POST",
                        url: url,
                        data:this.ids,
                    }).then((res) => {
                        console.info("????");
                        let code = res.status;
                        console.info(res);
                        if (code == 200) {
                            this.$message.success("删除成功");
                            this.listAllCourse();
                        } else {
                            this.$message.error("删除失败");
                        }
                    }).catch((error) => {
                        
                        console.info("????!!!!");
                        console.log(error);
                    });
                })
                .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除",
                });
                });
            },
            deleteHandleClick: function(row) {
                
                let url = DELETE_COURSE+"/"+row.id;
                console.info(this.$data.searchForm);
                this.axios({
                    method: "GET",
                    url: url,
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
            findClassHandleClick: function(row) {
                this.$router.push({
					path: "/managerClassCourse",
                    query: {
                        id: row.id,
                        }
                    });
            },
            findClassToAddHandleClick: function(row) {
                this.$router.push({
                    path: "/managerClassCourseAdd",
                    query: {
                        id: row.id,
                        }
                    });
            },
            addHandleClick:function(){
                
                this.isEditor = true;
                this.dialogAddFormVisible = true;
                this.isadd=true;
                
            }
        },
    };
</script>

<style scoped>

</style>