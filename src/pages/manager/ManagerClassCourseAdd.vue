<template>
    <div>
       
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID"> </el-table-column>
            <el-table-column prop="classNo" label="班级编号"></el-table-column>
            <el-table-column prop="type" label="班级类别"></el-table-column>
            <el-table-column prop="headTeacherId" label="班主任编号"> </el-table-column>
            <el-table-column prop="headTeacherName" label="班主任姓名"> </el-table-column>
            <el-table-column prop="isGradution" label="是否毕业"> </el-table-column>
            <el-table-column prop="stageId" label="阶段id"> </el-table-column>
            <el-table-column prop="studentNumber" label="学生人数"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="addHandleClick(scope.row)" size="small">置入</el-button>
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
        
     
    </div>
</template>

<script>
    import { LIST_NO_ADDED_CLASS,
    ADD_COURSE_TO_CLASS,} from "../../utils/api-manager.js";
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
                let url = LIST_NO_ADDED_CLASS+"/"+parseInt(this.courseid);
                console.info(url);
                console.info(this.$data.searchForm);
                this.axios({
                    method: "GET",
                    url: url,
                }).then((res) => {
                    let code = res.status;
                    console.info(res);
                    if (code == 200) {
                        this.$data.tableData = res.data.data.result;
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
            addHandleClick:function(row){
            


            this.$confirm("确认置入班级？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                })
                .then(() => {
                    let url = ADD_COURSE_TO_CLASS+"/"+parseInt(this.courseid);
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
                            this.$message.success("置入成功");
                            this.listAllCourse();
                        } else {
                            this.$message.error("置入失败");
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                })
                .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消置入",
                });
                });


            }
        },
    };
</script>

<style scoped>

</style>