<template>
  <div>
    <el-row>
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        class="demo-form-inline"
      >
        <el-form-item label="学号" prop="studentNo">
          <el-input
            v-model="searchForm.studentNo"
            placeholder="学号"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否公开" prop="publicFlag">
          <el-select v-model="searchForm.publicFlag" placeholder="是否公开">
            <el-option label="全部" value=""></el-option>
            <el-option label="公开" :value="1"></el-option>
            <el-option label="非公开" :value="0"></el-option>
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
      <el-button type="primary" @click="batchDelete(tableChecked)"
        >批量删除</el-button
      >
      <p />
    </el-row>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column prop="studentNo" label="学号"> </el-table-column>
      <el-table-column prop="comment" label="内容" width="180">
      </el-table-column>
      <el-table-column prop="publicFlag" label="是否公开">
      <template slot-scope="scope">
       <el-switch
            v-model="scope.row.publicFlag"
            @change="availableChange(scope.row)"
          >
          </el-switch>
          </template>
      </el-table-column>
      <el-table-column prop="careerFlag" label="是否同步">
       <template slot-scope="scope">
       <el-switch
            v-model="scope.row.careerFlag"
            @change="availableChange(scope.row)"
          >
          </el-switch>
          </template>
      </el-table-column>
      <el-table-column
        prop="classCourseActualld"
        label="可为空 默认-1"
        width="150"
      >
      </el-table-column>
      <el-table-column prop="topic" label="话题" width="180"> </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="180"
        :formatter="carTimeFilter"
      >
      </el-table-column>
      <el-table-column
        prop="deleteFlag"
        label="删除状态"
        width="180"
        :formatter="availableFormatter2"
      >
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
            v-auth="['/comment/delete']"
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
        <el-form-item
          prop="studentNo"
          label="学号"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.studentNo" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="comment" label="内容" :label-width="formLabelWidth">
          <el-input v-model="form.comment" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          prop="publicFlag"
          label="是否公开"
          :label-width="formLabelWidth"
          
        >
          <el-switch
            v-model="form.publicFlag"
            active-text="公开"
            inactive-text="不公开"
          >
          </el-switch>
        </el-form-item>

        <el-form-item
          prop="careerFlag"
          label="是否同步"
          :label-width="formLabelWidth"
        >
          <el-switch
            v-model="form.careerFlag"
            active-text="同步"
            inactive-text="非同步"
           
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          prop="classCourseActualld"
          label="课程类别"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.classCourseActualld"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="topic" label="话题" :label-width="formLabelWidth">
          <el-input v-model="form.topic" autocomplete="off"></el-input>
        </el-form-item>

        
        <el-form-item
          prop="deleteFlag"
          label="是否删除"
          :label-width="formLabelWidth"
          v-if="isEditor"
        >
          <el-switch
            v-model="form.deleteFlag"
            active-text="未删除"
            inactive-text="删除"
            
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
import {
  FIND_COMMENT_URL,
  LIST_COMMENT_URL,
  SAVEORUPDATE_COMMENT_URL,
  DELETE_COMMENT_URL,
} from "../../utils/api.js";
import moment from "moment";
export default {
  data() {
    return {
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      pageSize: 10,
      tableData: [],
      tableChecked: [], //被选中的记录
      ids: [], //批量删除的id
      searchForm: {
        studentNo: "",
        publicFlag: "",
      },
      isEditor: false,
      dialogAddFormVisible: false,
      form: {
        id: "",
        studentNo: "",
        comment: "",
        publicFlag:true,
        careerFlag:true,
        classCourseActualld: "",
        topic: "",
        createTime: new Date(),
        deleteFlag: "",
      },
      formLabelWidth: "120px",
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20个字符",
            trigger: "blur",
          },
        ],
        available: [
          {
            required: true,
          },
        ],
        sexType: [
          {
            required: true,
          },
        ],
        email: [
          {
            required: false,
            message: "请输入用户邮箱地址",
            trigger: "change",
          },
        ],
        tel: [
          {
            required: false,
            message: "请输入用户联系方式",
            trigger: "change",
          },
        ],
      },
    };
  },
  created: function () {
    this.pageUser();
  },
  methods: {
    pageUser: function () {
      let url = LIST_COMMENT_URL + "/" + this.currentPage + "/" + this.pageSize;
      this.axios({
        method: "POST",
        url: url,
        data: this.$data.searchForm,
      })
        .then((res) => {
          let code = res.data.code;
          console.log(JSON.stringify(res.data));
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
    availableFormatter2: function (row, column, cellValue) {
      return cellValue ? "未删除" : "已删除";
    },

    carTimeFilter: function (row, column, cellValue) {
      if (cellValue != null) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    onSearch: function () {
      this.pageUser();
    },
    resetSearchForm: function (formName) {
      console.log(formName);
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
        this.onSearch();
      });
    },
    addHandleClick: function () {
      this.$data.isEditor = false;
      this.$data.dialogAddFormVisible = true;
      this.$data.form.id = 0;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    saveOrUpdate: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.axios({
            method: "POST",
            url: SAVEORUPDATE_COMMENT_URL,
            data: this.form,
          })
            .then((res) => {
              //console.log(res.data);
              let code = res.data.code;
              //console.log(JSON.stringify(res.data));
              if (code == 200) {
                this.pageUser();
                this.$data.dialogAddFormVisible = false;
              } else {
                this.$message.error("操作失败");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editorHandleClick: function (row) {
      console.log(row);
      this.isEditor = true;
      this.dialogAddFormVisible = true;
      let url = FIND_COMMENT_URL + "/" + row.id;
      this.axios({
        method: "GET",
        url: url,
        data: {},
      })
        .then((res) => {
          console.log(res.data);
          let code = res.data.code;
          console.log(JSON.stringify(res.data));
          if (code == 200) {
            this.$data.form = res.data.data;
          } else {
            this.$message.error("加载资源失败");
          }
        })
        .catch((error) => {
          // this.$message.error('加载资源失败');
          console.log(error);
        });
    },
    deleteHandleClick: function (row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$data.ids.push(row.id);
          this.delete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    delete: function () {
      let data = this.$data.ids;
      console.log(data);
      let urlChild = "";
      data.forEach((e) => {
        urlChild += "ids=" + e + "&";
      });
      urlChild = urlChild.substring(0, urlChild.lastIndexOf("&"));
      let url = DELETE_COMMENT_URL + "/?" + urlChild;

      this.axios({
        method: "GET",
        url: url,
        data: {},
      })
        .then((res) => {
          console.log(res.data);
          let code = res.data.code;
          console.log(JSON.stringify(res.data));
          this.$data.ids = new Array();
          if (code == 200) {
            this.pageUser();
            this.$message.success("操作成功");
          } else {
            this.$message.error("操作失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSelectionChange: function (val) {
      console.log("handleSelectionChange--", val);
      this.tableChecked = val;
    },
    batchDelete: function (rows) {
      let _this = this;
      console.log(rows.length);
      if (rows.length <= 0) {
        this.$message.warning("请先选择需要删除的数据");
        return;
      }
      _this
        .$confirm("是否删除选中的所有用户?删除后无法恢复!", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          rows.forEach((element) => {
            _this.ids.push(element.id);
          });
          this.delete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleCurrentChange: function (page) {
      this.$data.currentPage = page; //页数等于page
      this.pageUser(); //重载
    },
    availableChange: function (row) {
      console.log(row);

      let url = SAVEORUPDATE_COMMENT_URL;
      this.axios({
        method: "POST",
        url: url,
        data: {
          id: row.id,
          publicFlag: row.publicFlag,
          careerFlag:row.careerFlag
        },
      })
        .then((res) => {
          console.log(res.data);
          let code = res.data.code;
          if (code == 200) {
            this.$message.success("更新成功");
          } else {
            this.$message.error("更新失败");
          }
        })
        .catch((error) => {
          this.$message.error("系统异常");
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>
