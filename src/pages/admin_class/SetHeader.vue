<template>
  <el-table
    :data="tableData"
    style="width: 100%">

    <el-table-column
      label="班级编号"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.classNo }}</span>
      </template>
    </el-table-column>


    <el-table-column
      label="班级名字"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.className }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="班级类型"
      width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.type }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="班主任编号"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.headTeacherId }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="班主任"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.headTeacherName }}</span>
      </template>
    </el-table-column>


    <el-table-column
      label="是否毕业"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.isGraduation }}</span>
      </template>
    </el-table-column>

        <el-table-column
      label="阶段id"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.stageId }}</span>
      </template>
    </el-table-column>

     <el-table-column
      label="学生人数"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.studentNumber }}</span>
      </template>
    </el-table-column>

     <el-table-column
      label="qq群号"
      width="200">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.qqGroupNumber}}</span>
      </template>
    </el-table-column>

     <el-table-column
      label="qq群二维码"
      width="200">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.qqGroup }}</span>
      </template>
    </el-table-column>

     <el-table-column
      label="微信二维码"
      width="100">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.wechatGroup}}</span>
      </template>
    </el-table-column>





    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">设置班主任</el-button>
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
            "classNo": "0001",
            "className": "畅轻",
            "type": "正常新班级",
            "headTeacherId": "110101",
            "headTeacherName": "尹洪涛",
            "isGraduation": false,
            "stageId": 2,
            "studentNumber": 16,
            "qqGroupNumber": "qq群号",
            "qqGroup": "qq群号二维码",
            "wechatGroup": "微信二维码",
            "deleteFlag": false,
            "creatorId": 1101,
            "createTime": null,
            "creater": "未知"
        }]
      }
    },
    created: function () {
    this.getData();
   },
    methods: {
      getData(){
        let url =  "http://localhost:8085/rest/v1/className/all";
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
      //console.log(row);
      var classNo = row.classNo;
      var className = row.className;
      console.log(classNo);
      console.log(className);
      this.$router.push({name:'admin_teacher',params: {"classNo":classNo,"className":className}}); // 只能用 name
      
      

      },
      
    }

  }
 // var url = "http://localhost:8085/rest/v1/className/forts"

</script>
