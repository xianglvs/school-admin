<template>
  <div class="app-container">
    <el-form ref="filters" :inline="true" :model="filters">
      <el-form-item class="form-item" prop="loginName">
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
      <el-table-column prop="officeId" label="机构id" min-width="120" />
      <el-table-column prop="parentId" label="父级id" min-width="120" />
      <el-table-column prop="parentIds" label="父级索引" min-width="120" />
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            plain
          >
            选择菜单
          </el-button>
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
  </div>
</template>
<script>
import { getRolesPage } from "@/api/roles";

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
      list: []
    }
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
    showUserDialog() {},
    del() {}
  }
}
</script>
<style lang="scss" scoped>
</style>
