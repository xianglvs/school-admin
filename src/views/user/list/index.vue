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
        <el-select v-model="filters.type" placeholder="请选择用户角色">
          <el-option label="全部" value="" />
          <el-option label="系统" value="1" />
          <el-option label="个人" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">快速查找</el-button>
        <el-button @click="$refs['filters'].resetFields(),search()">重置</el-button>
        <el-button
          type="primary"
          @click="showUserDialog"
        >添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="loginName" label="用户名" min-width="100" />
      <el-table-column prop="mobile" label="手机号" min-width="120" />
      <el-table-column prop="qq" label="QQ号" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="120" />
      <el-table-column prop="type" label="用户角色" min-width="120" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
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

    <new-dialog ref="userDialog" :title="userDialogTitle">
      <el-form ref="userForm" class="dialog-form" label-width="80px">
        <el-form-item label="用户名" prop="loginName">
          <el-input v-model="user.loginName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="user.qq" placeholder="请输入QQ号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="用户角色" prop="type">
          <el-select
            v-model="user.type"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in user.newTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </new-dialog>
  </div>
</template>
<script>
import { getUserList } from "@/api/user";
import NewDialog from "@/components/Newdialog/index.vue";

export default {
  name: "UserList",
  components: {
    NewDialog
  },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      filters: {
        loginName: "",
        type: ""
      },
      userDialogTitle: "新增用户",
      user: {
        loginName: "",
        phone: "",
        qq: "",
        email: "",
        type: "",
        typeList: [
          {
            value: 1,
            label: "系统"
          },
          {
            value: 2,
            label: "个人"
          }
        ],
        newTypeList: [
          {
            value: 1,
            label: "系统"
          },
          {
            value: 2,
            label: "个人"
          }
        ]
      }
    };
  },
  created() {
    this.fetchData();
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
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.user.newTypeList = this.user.typeList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.user.newTypeList = [];
      }
    },
    showUserDialog() {
      this.$refs.userDialog.handleShow();
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container{
  .form-item{
    width: 148px;
    margin-right:10px;
  }
}
</style>
