<template>
  <div class="app-container">
    <el-form ref="filters" :inline="true" :model="filters">
      <el-form-item class="form-item" prop="loginName">
        <el-input
          v-model="filters.loginName"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item class="form-item" prop="type">
        <el-select v-model="filters.type" placeholder="请选择用户类型">
          <el-option label="全部" value=""/>
          <el-option label="个人" value="2"/>
          <el-option label="系统" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">快速查找</el-button>
        <el-button @click="$refs['filters'].resetFields(),search()">重置</el-button>
        <el-button
          type="primary"
          @click="showUserDialog('add')"
        >添加
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="loginName" label="用户名" min-width="100"/>
      <el-table-column prop="name" label="姓名" min-width="100"/>
      <el-table-column prop="phone" label="手机号" min-width="120"/>
      <el-table-column prop="qq" label="QQ号" min-width="120"/>
      <el-table-column prop="email" label="邮箱" min-width="120"/>
      <el-table-column
        prop="type"
        label="用户类型"
        :formatter="
          (row, column, cellValue) =>
            ['','系统', '个人'][
              cellValue
            ]
        "
        min-width="80"
      />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showUserDialog('edit', scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="del(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        class="page"
        style="float:right;margin:20px 0"
        :page-size="pageSize"
        :current-page="page"
        layout="prev, pager, next, total"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </el-col>

    <user-dialog
      ref="userDialog"
      :title="userDialogTitle"
      :roles-list="rolesList"
      :current-user="currentUser"
      @fetchData="fetchData"
    />
  </div>
</template>
<script>
import { getUserList, delUser } from "@/api/user";
import { getRolesList } from "@/api/roles";
import UserDialog from "@/views/user/list/components/userDialog.vue";

export default {
  name: "UserList",
  components: {
    UserDialog
  },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      filters: {
        name: "",
        type: ""
      },
      userDialogTitle: "添加用户",
      currentUser: null,
      rolesList: []
    };
  },
  activated() {
    this.fetchRolesList();
  },
  created() {
    this.fetchData();
    this.fetchRolesList();
    this.cloneUser = Object.assign({}, this.user);
  },
  methods: {
    fetchData() {
      const params = {};
      params.pageNum = this.page;
      params.pageSize = this.pageSize;
      Object.assign(params, this.filters);
      this.listLoading = true;
      getUserList(params).then(response => {
        if (response.code == 0) {
          this.list = response.data.list || [];
          this.list.forEach((row) => {
            if (row.roles != null && row.roles.length > 0) {
              row.roles = row.roles[0];
            }
          });
          this.total = response.data.total || 0;
        }
        this.listLoading = false;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    search() {
      this.page = 1;
      this.fetchData();
    },
    fetchRolesList() {
      const params = {
        delFlag: false,
        disableFlag: false
      };
      getRolesList(params).then(response => {
        if (response.code == 0) {
          // this.rolesList = response.data || [];
          const list = response.data || [];
          this.rolesList.splice(0, this.rolesList.length);
          this.rolesList = list;
        }
      });
    },
    showUserDialog(type, row) {
      const obj = {
        add: "添加用户",
        edit: "修改用户"
      };
      const r = { ...row };
      this.userDialogTitle = obj[type];
      this.currentUser = {};
      this.$refs.userDialog.showDialog();
      type === "add" ? this.loadDialogData() : this.loadDialogData(r);
    },
    loadDialogData(row) {
      const defaultData = {
        loginName: "",
        name: "",
        password: "",
        phone: "",
        qq: "",
        email: "",
        type: 2,
        roles: []
      };
      if (row) {
        row.password = "";
      }
      this.currentUser = row || defaultData;
    },
    del(index, row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delUser({ id: row.id }).then(response => {
          if (response.code === 0) {
            this.$message({
              message: "删除成功",
              center: true,
              type: "success"
            });
            this.fetchData();
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  .form-item {
    width: 148px;
    margin-right: 10px;
  }
}
</style>
