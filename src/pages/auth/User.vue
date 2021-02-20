<template>
  <div>
    <el-row>
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        class="demo-form-inline"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="searchForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="available">
          <el-select v-model="searchForm.available" placeholder="是否可用">
            <el-option label="全部" value=""></el-option>
            <el-option label="可用" :value="1"></el-option>
            <el-option label="不可用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch"
            icon="el-icon-search"
          ></el-button>
          <el-button
            @click="resetSearchForm('searchForm')"
            icon="el-icon-refresh-right"
          ></el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <!-- 添加 -->
      <el-button
        type="primary"
        @click="addHandleClick"
        icon="el-icon-circle-plus-outline"
      ></el-button>
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
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <!-- <el-table-column prop="password" label="密码"> </el-table-column> -->

      <el-table-column prop="available" label="是否可用" width="60">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.id == 1"
            disabled
            v-model="scope.row.available"
            @change="availableChange(scope.row)"
          >
          </el-switch>
          <el-switch
            v-else
            v-model="scope.row.available"
            @change="availableChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        prop="sexType"
        label="性别"
        :formatter="sexFormatter"
        width="60"
      >
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="tel" label="电话" width="150"> </el-table-column>
      <el-table-column
        prop="createtime"
        label="创建日期"
        width="180"
        :formatter="carTimeFilter"
      ></el-table-column>
      <el-table-column
        prop="updatetime"
        label="更新日期"
        width="180"
        :formatter="carTimeFilter"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="bindRoles(scope.row)"
            type="text"
            v-auth="['/role/delete']"
            size="small"
            ><i class="el-icon-user"></i
          ></el-button>
          <el-button
            type="text"
            @click="editorHandleClick(scope.row)"
            size="small"
            ><i class="el-icon-edit"></i
          ></el-button>
          <el-button
            @click="deleteHandleClick(scope.row)"
            type="text"
            v-auth="['/role/delete']"
            size="small"
            ><i class="el-icon-delete"></i
          ></el-button>
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
    ></el-pagination>
    <el-dialog
      :title="isEditor ? '编辑' : '添加'"
      :visible.sync="dialogAddFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-input type="hidden" v-model="form.id" autocomplete="off"></el-input>
        <el-form-item
          prop="username"
          label="用户名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="available"
          label="是否可用"
          :label-width="formLabelWidth"
        >
          <el-switch
            v-model="form.available"
            active-text="可用"
            inactive-text="不可用"
          >
          </el-switch>
        </el-form-item>
        <el-form-item prop="sexType" label="性别" :label-width="formLabelWidth">
          <el-switch
            v-model="form.sexType"
            active-text="女"
            inactive-text="男"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="tel" label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="createtime"
          label="创建日期"
          :label-width="formLabelWidth"
          v-if="isEditor"
        >
          <el-date-picker
            v-model="form.createtime"
            type="datetime"
            placeholder="选择日期时间"
            readonly
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          prop="updatetime"
          label="更新日期"
          :label-width="formLabelWidth"
          v-if="isEditor"
        >
          <el-date-picker
            v-model="form.updatetime"
            type="datetime"
            placeholder="选择日期时间"
            readonly
          >
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

    <el-drawer title="设置角色" :visible.sync="roleDrawer" :with-header="true">
 

      <el-checkbox-group v-model="checkedRoles">
        <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{
          role.name
        }}</el-checkbox>
      </el-checkbox-group>

      <div class="buttons" style="text-align: center">
        <el-button @click="closeRolesDrawer">取 消</el-button>
        <el-button type="primary" @click="updateUserRole">设 置</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import {
  LIST_USER_URL,
  FIND_USER_URL,
  ADD_OR_EDITOR_USER_URL,
  DELETE_USER_URL,
  LOAD_USER_ROLE_URL,
  UPDATE_USER_ROLE_URL,
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
        username: "",
        available: "",
      },
      isEditor: false,
      dialogAddFormVisible: false,
      roleDrawer: false,
      form: {
        id: "",
        username: "",
        available: true,
        sexType: "",
        email: "",
        tel: "",
        createtime: "",
        updatetime: "",
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
      roles: [],
      checkedRoles: [],
      updateUserId:0
    };
  },
  created: function () {
    this.pageUser();
  },
  methods: {
    pageUser: function () {
      let url = LIST_USER_URL + "/" + this.currentPage + "/" + this.pageSize;
      this.axios({
        method: "POST",
        url: url,
        data: this.$data.searchForm,
      })
        .then((res) => {
          let code = res.data.code;
          //console.log(JSON.stringify(res.data));
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
    availableFormatter: function (row, column, cellValue) {
      return cellValue ? "可用" : "不可用";
    },
    sexFormatter: function (row, column, cellValue) {
      return cellValue ? "女" : "男";
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
      //console.log(formName);
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
      if (this.$data.isEditor == false) {
        this.$data.form.createtime = new Date();
        this.$data.form.updatetime = new Date();
      } else {
        this.$data.form.updatetime = new Date();
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.axios({
            method: "POST",
            url: ADD_OR_EDITOR_USER_URL,
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
      //console.log(row);
      this.isEditor = true;
      this.dialogAddFormVisible = true;
      let url = FIND_USER_URL + "/" + row.id;
      this.axios({
        method: "GET",
        url: url,
        data: {},
      })
        .then((res) => {
          //console.log(res.data);
          let code = res.data.code;
          //console.log(JSON.stringify(res.data));
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
    bindRoles: function (row) {
     
      let url = LOAD_USER_ROLE_URL+"/"+row.id;
      this.axios({
        method: "POST",
        url: url,
        data: {},
      })
        .then((res) => {
          console.log(res.data);
          let code = res.data.code;

          if (code == 200) {
            this.$data.roles = res.data.data.roleList;
            let checkedRoles=res.data.data.sysUserRoles;
             this.$data.checkedRoles=[];
            for(let checkRole of checkedRoles){
              this.$data.checkedRoles.push(checkRole.rolesId);
            }
        
            
          } else {
            this.$message.error("操作失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.updateUserId=row.id;
      this.roleDrawer = true;
    },
    updateUserRole: function () {

      let url = UPDATE_USER_ROLE_URL+'/'+this.updateUserId;

      this.axios({
        method: "POST",
        url: url,
        data: [...new Set(this.$data.checkedRoles)],
      })
        .then((res) => {
         console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });

      this.roleDrawer = false;
    },
    closeRolesDrawer() {
      this.roleDrawer = false;
    },
    delete: function () {
      let data = this.$data.ids;
      //console.log(data);
      let urlChild = "";
      data.forEach((e) => {
        urlChild += "ids=" + e + "&";
      });
      urlChild = urlChild.substring(0, urlChild.lastIndexOf("&"));
      let url = DELETE_USER_URL + "/?" + urlChild;

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
    handleCurrentChange: function (val) {
      console.log(`当前页: ${val}`);
    },

    availableChange: function (row) {
      console.log(row);

      let url = ADD_OR_EDITOR_USER_URL;
      this.axios({
        method: "POST",
        url: url,
        data: {
          id: row.id,
          available: row.available,
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