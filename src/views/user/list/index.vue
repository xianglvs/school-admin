<template>
  <div class="app-container">
    <el-form ref="filters" :inline="true" :model="filters">
      <el-form-item class="form-item" prop="name">
        <el-input
          v-model="filters.name"
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
      <el-table-column prop="name" label="用户名" min-width="100" />
      <el-table-column prop="mobile" label="手机号" min-width="120" />
      <el-table-column prop="qq" label="QQ号" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="120" />
      <el-table-column
        prop="type"
        label="用户角色"
        :formatter="
          (row, column, cellValue) =>
            ['系统', '个人'][
              cellValue
            ]
        "
        min-width="80"
      />
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

    <new-dialog
      ref="userDialog"
      :title="userDialogTitle"
      @submitDialog="submitUserForm"
    >
      <el-form
        ref="userForm"
        class="dialog-form"
        label-width="80px"
        :rules="rules"
        :model="user"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" placeholder="请输入手机号" type="password" />
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
        <el-form-item label="用户角色" prop="roles">
          <el-select
            v-model="user.roles"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in searchRolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </new-dialog>
  </div>
</template>
<script>
import { getUserList, addUser } from "@/api/user";
import { getRolesList } from "@/api/roles";
import NewDialog from "@/components/Newdialog/index.vue";
import { validPassword, validPhone, validQQ, validEmail } from "@/utils/validate";

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
        name: "",
        type: ""
      },
      userDialogTitle: "添加用户",
      rolesList: [],
      searchRolesList: [],
      user: {
        name: "",
        password: "",
        phone: "",
        qq: "",
        email: "",
        roles: []
      },
      rules: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            validator: validPassword
          }
        ],
        phone: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            validator: validPhone
          }
        ],
        qq: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            validator: validQQ
          }
        ],
        email: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            validator: validEmail
          }
        ],
        roles: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
    this.fetchRolesList();
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
    fetchRolesList() {
      const params = {
        delFlag: false,
        disableFlag: false
      };
      getRolesList(params).then(response => {
        if (response.code == 0) {
          this.rolesList = response.data || [];
          this.searchRolesList = this.rolesList;
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.searchRolesList = this.rolesList.filter(item => {
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
    },
    submitUserForm() {
      this.$refs["userForm"].validate(valid => {
        const params = Object.assign({}, this.user);
        this.add(params);
      });
    },
    add(user) {
      const params = {
        email: user.email,
        latitude: 0,
        loginName: "admin",
        longitude: 0,
        mobile: "",
        name: user.name,
        no: "",
        password: "",
        phone: user.phone,
        photo: "",
        qq: user.qq,
        remarks: "",
        roles: user.roles,
        sysAreaId: "",
        sysOfficeId: "",
        type: 2,
        weixin: ""
      };
      console.log(params, 222);
      addUser(params).then(response => {
        if (response.code == 0) {
          this.record.id = response.data;
          this.$message({
            message: "添加成功",
            center: true,
            type: "success"
          });
        }
      });
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
  .dialog-form{
    width: 86%;
    margin: 0 auto;
    .el-select{
      width: 100%;
    }
  }
}
</style>
