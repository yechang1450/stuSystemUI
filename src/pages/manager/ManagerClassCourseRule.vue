<template>
    <div>
       
            <el-button type="primary" @click="addHandleClick()" icon="el-icon-circle-plus-outline"></el-button>
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID"> </el-table-column>
            <el-table-column prop="classCourseId" label="班级课程表id"></el-table-column>
            <el-table-column prop="startTime" label="开始时间"></el-table-column>
            <el-table-column prop="endTime" label="结束时间"> </el-table-column>
            <el-table-column prop="sectionNum" label="节次数"> </el-table-column>
            <el-table-column prop="weekNum" label="周次"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="editorHandleClick(scope.row)" size="small">编辑</el-button>
                    <el-button type="text" @click="deleteHandleClick(scope.row)" size="small">删除</el-button>
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
                
                  <el-form-item label="开始时间" prop="startTime">
                  <div class="block">
                        <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </el-form-item>
                
                <el-form-item label="结束时间" prop="endTime">
                        <div class="block">
                        <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    </div>

                </el-form-item>
                <el-form-item label="节次数" prop="sectionNum">
                    <el-input v-model="form.sectionNum" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="周次" prop="weekNum">
                    <el-input v-model="form.weekNum" placeholder="请输入内容" ></el-input>
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
    import { LIST_CLASSCOURSE_RULE,
    UPDATE_CLASSCOURSE_RULE,
    DELETE_CLASSCOURSE_RULE} from "../../utils/api-manager.js";
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
                    classCourseId:this.classCourseId,
                    startTime:"",
                    endTime:"",
                    sectionNum:"",
                    weekNum:"",
                    status:"",
                    teachersNos:this.teachersNos,
                    courseNo:this.courseNo,
                    deleteFlag:0,
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
                classCourseId:"",
                classNo:"",
                teachersNos:"",
                courseNo:"",
                userName:null
            };
        },
        created: function () {
            let jsonStr = sessionStorage.getItem('userDetail');
            this.userName = JSON.parse(jsonStr).username;
            this.getParams()
            this.listAllRule();
        },
         watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            $route: 'getParams'
        },
        methods: {
            getParams() {
            // 取到路由带过来的参数
                const res = this.$route.query;
                
                console.log('getParams', res);
                this.classCourseId=res.id;
                this.classNo=res.classNo;
                this.teachersNos=res.teachersNos;
                this.courseNo=res.courseNo;
                
                this.form.classCourseId=res.id;
                this.form.classNo=res.classNo;
                this.form.teachersNos=res.teachersNos;
                this.form.courseNo=res.courseNo;
                console.log('getParams', res);
            },
            listAllRule: function () {
                let url = LIST_CLASSCOURSE_RULE+"/"+parseInt(this.classCourseId);
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
         
            handleSelectionChange:function(val){
                console.log("handleSelectionChange--",val);
                this.tableChecked=val;
            },
            handleCurrentChange: function (val) {
                console.log(`当前页: ${val}`);
            },
            
            editorHandleClick: function (row) {
                console.log(row);
                this.isEditor = true;
                this.dialogAddFormVisible = true;
                this.$data.form = row;
            },
            deleteHandleClick: function(row) {
                let url = DELETE_CLASSCOURSE_RULE+"/"+parseInt(row.id);
                console.info(url);
                this.id.push(row.id);
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
            saveOrUpdate: function() {
                this.$refs['form'].validate((valid) => {
                    console.info(valid);
                    console.info(this.$data.form);
                    if (valid) {
                        this.axios({
                            method: 'POST',
                            url: UPDATE_CLASSCOURSE_RULE,
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
              addHandleClick:function(){
                
                this.isEditor = true;
                this.dialogAddFormVisible = true;
                
            }
        },
    };
</script>

<style scoped>

</style>