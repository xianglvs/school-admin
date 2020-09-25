<template>
  <div class="app-container">
    <el-form ref="filters" :inline="true" :model="filters">
      <el-form-item class="form-item" prop="name">
        <el-input
          v-model="filters.name"
          placeholder="角色中文名"
        />
      </el-form-item>
      <!-- <el-form-item class="form-item" prop="loginName">
        <el-input
          v-model="filters.enName"
          placeholder="角色英文名"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="search()">快速查找</el-button>
        <el-button @click="$refs['filters'].resetFields(),search()">重置</el-button>
        <el-button
          type="primary"
          @click="showRoleDialog('add')"
        >添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="name" label="角色中文名" min-width="100" />
      <el-table-column prop="enName" label="角色英文名" min-width="100" />
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            plain
            @click="showMenuDialog(scope.row)"
          >
            选择菜单
          </el-button>
          <el-button
            size="mini"
            @click="showRoleDialog('edit', scope.row)"
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

    <role-dialog
      ref="roleDialog"
      :title="roleDialogTitle"
      :current-role="currentRole"
      @fetchData="fetchData"
    />
    <menu-dialog
      v-if="menuList.length > 0"
      ref="menuDialog"
      :menuList="menuList"
      @fetchData="fetchData"
    />
  </div>
</template>
<script>
import { getRolesPage, delRole } from "@/api/roles";
import { getAllMenuList } from "@/api/menu";
import RoleDialog from "@/views/role/list/components/roleDialog.vue"
import MenuDialog from "@/views/role/list/components/menuDialog.vue"
import dataUtils from "@/utils/dataUtils";

export default {
  name: "RoleList",
  data() {
    return {
      filters: {
        name: "",
        // enName: ""
      },
      listLoading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      list: [],
      roleDialogTitle: '添加角色',
      currentRole: null,
      menuList: []
    }
  },
  components: {
    RoleDialog,
    MenuDialog
  },
  created() {
    this.fetchAllMenuList();
    this.fetchData();
  },
  methods: {
    fetchAllMenuList() { // 获取菜单列表
      const params = {
        delFlag: false,
        disableFlag: false
      }
      getAllMenuList(params).then(response => {
        if (response.code == 0) {
          let list = response.data || [];
          let menuData = dataUtils.jsonToTree({
            rootId: 0,
            json: list,
            idKey: 'id',
            pidKey: 'parentId',
            childKey: 'children',
            keepChild: true,
            validate: function(row) {
              return true;
            }
          })
          this.menuList = menuData
        }
      })
    },
    fetchData() {
      const params = {};
      params.delFlag = false;
      params.pageNum = this.page;
      params.pageSize = this.pageSize;
      Object.assign(params, this.filters);
      this.listLoading = true;
      getRolesPage(params).then(response => {
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
    showMenuDialog(row) {
      if (this.$refs.menuDialog) this.$refs.menuDialog.showDialog(row.id);
    },
    showRoleDialog(type, row) {
      const obj = {
        add: "添加角色",
        edit: "修改角色"
      };
      this.roleDialogTitle = obj[type];
      if (type === "add") {
        this.currentRole = {
          name: "",
          enName: ""
        };
      } else {
        this.currentRole = row;
      }
      this.$refs.roleDialog.showDialog();
    },
    del(index, row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delRole({ id: row.id }).then(response => {
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
}
</script>
<style lang="scss" scoped>
</style>
