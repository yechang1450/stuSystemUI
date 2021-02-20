<template>
  <div>
    <el-row>
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        class="demo-form-inline"
      >
        <el-form-item label="用户ID" prop="userNo">
          <el-input
            v-model="searchForm.userNo"
            clearable
            placeholder="用户ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否完成" prop="status">
          <el-select v-model="searchForm.status" placeholder="更改条件">
            <el-option label="全部" value=""></el-option>
            <el-option label="未完成" :value="0"></el-option>
            <el-option label="已完成" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="searchForm.priority" placeholder="更改条件">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" :value="0"></el-option>
            <el-option label="重要" :value="1"></el-option>
            <el-option label="紧急" :value="2"></el-option>
            <el-option label="重要紧急" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="itemType">
          <el-select v-model="searchForm.itemType" placeholder="更改条件">
            <el-option label="全部" value=""></el-option>
            <el-option label="系统添加" :value="0"></el-option>
            <el-option label="个人添加" :value="1"></el-option>
            <el-option label="他人添加" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- 查找 -->
          <el-button
            type="primary"
            @click="onSearch"
            icon="el-icon-search"
          ></el-button>
          <!-- 今日事项/所有事项 -->
          <el-button @click="swicthTodayPlanItem">{{
            swicthTodayPlanItemTitle
          }}</el-button>
          <!-- 重置 -->
          <el-button
            @click="resetSearchForm('searchForm')"
            icon="el-icon-refresh-right"
          ></el-button>
        </el-form-item>
        <!-- 添加 -->
        <el-button
          type="primary"
          @click="addHandleClick"
          icon="el-icon-circle-plus-outline"
        ></el-button>
        <!-- 批量删除 -->
        <el-button type="primary" @click="balchDelete(tableChecked)"
          ><i class="el-icon-delete"></i
        ></el-button>
      </el-form>
      <span v-html="TodayPlanItemTitle"></span>
      <p />
    </el-row>
    <el-table
      :data="tableData"
      row-key="id"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :tree-props="{ children: 'childPlanItems' }"
    >
      > > >
      <el-table-column type="selection" width="60"> </el-table-column>
      <!-- <el-table-column prop="id" label="ID"> </el-table-column> -->
      <el-table-column prop="userNo" label="用户ID" width="150" align="center">
      </el-table-column>
      <el-table-column
        prop="item"
        label="计划事项"
        width="270"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        :formatter="timeFilter"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        :formatter="timeFilter"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="priority"
        label="级别"
        width="100"
        align="center"
        :formatter="levelFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="itemTitle"
        label="事项标题"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="itemType"
        label="事项类型"
        width="90"
        align="center"
        :formatter="itemTypeFormatter"
      ></el-table-column>
      <el-table-column
        prop="parentId"
        label="父项"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="creatorId"
        label="创建者id"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="更新时间"
        :formatter="timeFilter"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column fixed="right" label="完成" width="75" align="center">
        <template slot-scope="scope">
          <!-- 表格操作栏完成 -->
          <el-button
            @click="donePlanItem(scope.row)"
            type="text"
            v-auth="['/planItem']"
            size="small"
            ><i class="el-icon-circle-check"></i
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <!-- 表格操作栏编辑 -->
          <el-button
            type="text"
            @click="editorHandleClick(scope.row)"
            size="small"
            ><i class="el-icon-more"></i
          ></el-button>
          <!-- 表格操作栏删除 -->
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 10px"
            @onConfirm="deleteHandleClick(scope.row)"
          >
            <el-button
              slot="reference"
              type="text"
              v-auth="['/planItem']"
              size="small"
              ><i class="el-icon-delete"></i></el-button
          ></el-popconfirm>
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
          prop="userNo"
          label="用户ID"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.userNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="itemTitle"
          label="事项标题"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.itemTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="item" label="事项" :label-width="formLabelWidth">
          <el-input v-model="form.item" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="startTime"
          label="开始日期"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          prop="endTime"
          label="结束日期"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          prop="priority"
          label="优先级"
          :label-width="formLabelWidth"
        >
          <div class="block">
            <el-slider
              v-model="form.priority"
              :step="1"
              :max="3"
              show-stops
              :show-tooltip="false"
            ></el-slider>
          </div>
        </el-form-item>
        <el-form-item
          prop="status"
          label="是否完成"
          :label-width="formLabelWidth"
          v-if="isEditor"
        >
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#409EFF"
            active-text="已完成"
            inactive-text="未完成"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          prop="itemType"
          label="事项类型"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.itemType" placeholder="请选择">
            <el-option label="系统添加" :value="0"> </el-option>
            <el-option label="个人添加" :value="1"> </el-option>
            <el-option label="他人添加" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="parentId"
          label="父类栏目"
          :label-width="formLabelWidth"
          v-show="form.type != 1"
        >
          <el-select v-model="form.parentId" placeholder="请选择父类事项">
            <el-option label="独立计划事项" :value="0"></el-option>
            <el-option
              v-for="planItem in planItems"
              :key="planItem.id"
              v-show="planItem.id != form.id"
              :label="planItem.item"
              :value="planItem.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="deleteFlag"
          label="是否删除"
          :label-width="formLabelWidth"
          v-if="isEditor"
        >
          <el-switch
            v-model="form.deleteFlag"
            inactive-color="#13ce66"
            active-color="#ff4949"
            active-text="已删除"
            inactive-text="未删除"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type=" primary" @click="saveOrUpdate">确 定</el-button>
        <el-button @click="resetForm('form')" v-if="!isEditor">重 置</el-button>
        <el-button @click="dialogAddFormVisible = false" v-if="isEditor"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  LIST_PLANITEM_URL,
  LIST_TODAYPLANITEM_URL,
  FIND_PLANITEMBYPARENTID_URL,
  FIND_PLANITEM_URL,
  ADD_OR_EDITOR_PLANITEM_URL,
  DONE_PLANITEM_URL,
  DELETE_PLANITEM_URL,
} from "../../utils/api-student.js";
import moment from "moment";
export default {
  data() {
    return {
      value: "",
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      pageSize: 10,
      tableData: [],
      planItems: [],
      tableChecked: [], //被选中的记录
      ids: [], //批量删除的id
      searchForm: {
        userNo: "",
        status: 0,
        priority: "",
        itemType: "",
        deleteFlag: 0,
      },
      isEditor: false,
      isTodayPlanItem: true,
      swicthTodayPlanItemTitle: "今日事项",
      TodayPlanItemTitle: "<h1>所有事项</h1>",
      dialogAddFormVisible: false,
      form: {
        id: "",
        userNo: "",
        item: "",
        startTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
        endTime: "",
        priority: 0,
        status: false,
        itemTitle: "计划事项",
        itemType: 0,
        parentId: 0,
        deleteFlag: false,
        creatorId: "",
        createTime: "",
      },
      formLabelWidth: "120px",
      rules: {
        userNo: [
          {
            required: true,
            message: "请输入用户ID",
            trigger: "blur",
          },
        ],
        item: [
          {
            required: true,
            message: "请输入item",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "时间不可为空",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "时间不可为空",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: false,
          },
        ],
        deleteFlag: [
          {
            required: false,
          },
        ],
        creatorId: [
          {
            required: true,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created: function () {
    this.loadPlanItem();
    this.pagePlanItem();
  },
  methods: {
    loadPlanItem: function () {
      let url =
        FIND_PLANITEMBYPARENTID_URL +
        "/" +
        this.currentPage +
        "/" +
        this.pageSize;
      this.axios({
        method: "POST",
        url: url,
        data: this.$data.searchForm,
      })
        .then((res) => {
          let code = res.data.code;
          if (code == 200) {
            this.$data.planItems = res.data.data.records;
          } else {
            this.$message.error("加载资源失败");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //所有数据
    pagePlanItem() {
      let url =
        LIST_PLANITEM_URL + "/" + this.currentPage + "/" + this.pageSize;
      this.axios({
        method: "POST",
        url: url,
        data: this.$data.searchForm,
      })
        .then((res) => {
          let code = res.data.code;
          if (code == 200) {
            this.$data.tableData = res.data.data.records;
            this.$data.totalCount = res.data.data.total; //totalcount
            this.$data.currentPage = res.data.data.current; //页数
          } else {
            this.$message.error("加载失败");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //今天数据
    pageTodayPlanItem() {
      let url =
        LIST_TODAYPLANITEM_URL + "/" + this.currentPage + "/" + this.pageSize;
      this.axios({
        method: "POST",
        url: url,
        data: this.$data.searchForm,
      })
        .then((res) => {
          let code = res.data.code;
          if (code == 200) {
            this.$data.tableData = res.data.data.records;
            this.$data.totalCount = res.data.data.total; //totalcount
            this.$data.currentPage = res.data.data.current; //页数
          } else {
            this.$message.error("加载失败");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //完成按钮事件
    donePlanItem(row) {
      let url = DONE_PLANITEM_URL;
      this.axios({
        method: "POST",
        url: url,
        data: row,
      })
        .then((res) => {
          let code = res.data.code;
          if (code == 200) {
            if (this.$data.isTodayPlanItem == false) {
              this.pageTodayPlanItem();
              this.loadPlanItem();
            } else if (this.$data.isTodayPlanItem == true) {
              this.pagePlanItem();
              this.loadPlanItem();
            }
            this.$notify({
              title: "事项完成✔️",
              message: this.$createElement(
                "i",
                { style: "color: teal" },
                "完成一个计划事项啦 ! ! 今天更充实了"
              ),
            });
          } else {
            this.$message.error("加载失败");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //删除
    deletePlanItem() {
      let data = this.$data.ids;
      let urlChild = "";
      data.forEach((e) => {
        urlChild += "ids=" + e + "&";
      });
      urlChild = urlChild.substring(0, urlChild.lastIndexOf("&"));
      let url = DELETE_PLANITEM_URL + "/?" + urlChild;

      this.axios({
        method: "GET",
        url: url,
        data: {},
      })
        .then((res) => {
          let code = res.data.code;
          this.$data.ids = new Array();
          if (code == 200) {
            if (this.$data.isTodayPlanItem == false) {
              this.pageTodayPlanItem();
              this.loadPlanItem();
            } else if (this.$data.isTodayPlanItem == true) {
              this.pagePlanItem();
              this.loadPlanItem();
            }
            this.$notify({
              title: "删除事项🗑️",
              message: this.$createElement(
                "i",
                { style: "color: teal" },
                "删除了一个计划事项 ! ! 今天要努力哦"
              ),
            });
          } else {
            this.$message.error("操作失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //单个删除
    deleteHandleClick: function (row) {
      this.$data.ids.push(row.id);
      this.deletePlanItem();
    },
    //批量删除
    balchDelete(rows) {
      if (rows.length <= 0) this.$message.info("未选中数据");
      else {
        this.$confirm("是否删除选中的item? 无法恢复!", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            rows.forEach((element) => {
              this.ids.push(element.id);
            });
            this.deletePlanItem();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    //级别formatter
    levelFormatter(row, column, cellValue) {
      if (cellValue == 0) {
        return "正常";
      } else if (cellValue == 1) {
        return "重要!";
      } else if (cellValue == 2) {
        return "紧急!!";
      } else if (cellValue == 3) {
        return "重要紧急!!!";
      }
    },
    //类型formatter
    itemTypeFormatter(row, column, cellValue) {
      if (cellValue == 0) {
        return "系统添加";
      } else if (cellValue == 1) {
        return "个人添加";
      } else if (cellValue == 2) {
        return "他人添加";
      }
    },
    //时间formatter
    timeFilter(row, column, cellValue) {
      if (cellValue != null) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    //搜索
    onSearch() {
      if (this.$data.isTodayPlanItem == false) {
        this.pageTodayPlanItem();
        this.loadPlanItem();
      } else if (this.$data.isTodayPlanItem == true) {
        this.pagePlanItem();
        this.loadPlanItem();
      }
    },
    //切换今天/所有事项
    swicthTodayPlanItem() {
      const all = "所有事项";
      const today = "今日事项";
      const allHTML = "<h1>所有事项</h1>";
      const todayHTML = "<h1>今日事项</h1>";
      if (this.$data.isTodayPlanItem == true) {
        this.pageTodayPlanItem();
        this.loadPlanItem();
        this.$data.isTodayPlanItem = false;
        this.$data.swicthTodayPlanItemTitle = all;
        this.$data.TodayPlanItemTitle = todayHTML;
      } else if (this.$data.isTodayPlanItem == false) {
        this.pagePlanItem();
        this.loadPlanItem();
        this.$data.isTodayPlanItem = true;
        this.$data.swicthTodayPlanItemTitle = today;
        this.$data.TodayPlanItemTitle = allHTML;
      }
    },
    //重载表格
    resetSearchForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
        if (this.$data.isTodayPlanItem == false) {
          this.pageTodayPlanItem();
          this.loadPlanItem();
        } else if (this.$data.isTodayPlanItem == true) {
          this.pagePlanItem();
          this.loadPlanItem();
        }
      });
    },
    //添加控制
    addHandleClick() {
      this.$data.isEditor = false;
      this.$data.dialogAddFormVisible = true;
      this.$data.form.id = 0;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    //添加or更新
    saveOrUpdate() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.axios({
            method: "POST",
            url: ADD_OR_EDITOR_PLANITEM_URL,
            data: this.form,
          })
            .then((res) => {
              let code = res.data.code;
              if (code == 200) {
                if (this.$data.isTodayPlanItem == false) {
                  this.pageTodayPlanItem();
                  this.loadPlanItem();
                } else if (this.$data.isTodayPlanItem == true) {
                  this.pagePlanItem();
                  this.loadPlanItem();
                }
                this.$data.dialogAddFormVisible = false;
                this.$message.success("操作成功");
              } else {
                this.$message.error("操作失败");
              }
            })
            .catch((error) => {
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    //编辑操作之查询数据
    editorHandleClick(row) {
      this.isEditor = true;
      this.dialogAddFormVisible = true;
      let url = FIND_PLANITEM_URL + "/" + row.id;
      this.axios({
        method: "GET",
        url: url,
        data: {},
      })
        .then((res) => {
          let code = res.data.code;
          if (code == 200) {
            this.$data.form = res.data.data;
          } else {
            this.$message.error("加载失败");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    handleSelectionChange(val) {
      this.tableChecked = val;
    },
    //重置按钮事件
    resetForm(form) {
      if (this.$route.name === "EditSoftware") {
        this.fetchData();
      } else {
        this.$refs[form].resetFields();
      }
    },
    //分页
    handleCurrentChange(page) {
      this.$data.currentPage = page; //页数等于page
      if (this.$data.isTodayPlanItem == false) {
        this.pageTodayPlanItem();
        this.loadPlanItem();
      } else if (this.$data.isTodayPlanItem == true) {
        this.pagePlanItem();
        this.loadPlanItem();
      }
    },
  },
};
</script>
<style>
</style>