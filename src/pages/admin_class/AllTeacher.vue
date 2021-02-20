



<template>




  <el-table
    :data="tableData"
    style="width: 100%">

    <el-table-column
      label="教师编号"
      width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.teacherNo }}</span>
      </template>
    </el-table-column>


    <el-table-column
      label="教师姓名"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.teacherName }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="是否教课"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.headFlag }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="性别"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.sex }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="teacherTypeID"
      width="200">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.teacherTypeID }}</span>
      </template>
    </el-table-column>


    <el-table-column
      label="荣誉"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.honor }}</span>
      </template>
    </el-table-column>

        <el-table-column
      label="状态"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.status }}</span>
      </template>
    </el-table-column>


    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">设为班主任</el-button>
      </template>
    </el-table-column>
  </el-table>


</template>

<script>
  export default {
    data() {
      return {
        totalCount:0,
        currentPage:0,
        
        tableData: [{
            "id": 0,
            "teacherNo": "",
            "teacherName": "",
            "headFlag": 0,
            "sex": 0,
            "teacherTypeID": 0,
            "honor": "0",
            "status": 0,
            "deleteFlag": 0
        }]
      }
    },
    created: function () {
    var classNo = this.$route.params.classNo;
    var className=this.$route.params.className;
    console.log("teacher界面获取到"+className);
    console.log("teacher界面获取到"+classNo);
    this.getData();
    this.$message('您正在为'+className+'班设置班主任');

   },
    methods: {
      //  goBack() { 
      //  this.$router.push({name:'admin_set'}) 
      // },
      getData(){
        let url =  "http://localhost:8085/rest/v1/className/forts";
         this.axios({
        method: "POST",
        url: url,
        data: {},
      }).then((res) => {
          let code = res.data.code;
          console.log(code);
          
          //console.log(JSON.stringify(res.data));
          if (code == 200) {
            this.$data.tableData = res.data.data;
            console.log(res.data.data);
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
      handleEdit(index,row) {
       // console.log(index,row);
       console.log("开始传参啦！")
       console.log(row.teacherNo);
       console.log(this.$route.params.classNo);
     let url =  "http://localhost:8085/rest/v1/className/sett?teacher_id="+row.teacherNo+
     "&t_id="+this.$route.params.classNo;
         this.axios({
        method: "POST",
        url: url,
        data: {},
      }).then((res) => {
          let code = res.data.code;
          console.log(code);
          
          //console.log(JSON.stringify(res.data));
          if (code == 1) {
            console.log("设置成功");
          this.$message({
          message: '设置成功！',
          type: 'success'
        });

          } else {
            this.$message.error("加载资源失败");
          }
        })
        .catch((error) => {
          // this.$message.error('加载资源失败');
          console.log(error);
        });
      }
      
    }

  }
 // var url = "http://localhost:8085/rest/v1/className/forts"

</script>
