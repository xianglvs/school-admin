<template>
  <div class="app-container">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        文章标题：
        <el-input
          v-model="filters.title"
          placeholder="文章标题"
          style="width:200px;margin-right:10px;"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">快速查找</el-button>
        <el-button
          type="primary"
          @click="$router.push('/article/createArticle')"
        >添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="title" label="标题" min-width="150" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="createDate" label="添加时间" width="200" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="$router.push(`/article/editArticle/${scope.row.id}`)"
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
import { getList, delArticle } from "@/api/article";

export default {
  name: "ArticleList",
  components: {},
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      ruleForm: {},
      filters: {
        title: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  activated() {
    this.list = []; // 清空原有数据
    this.fetchData(); // 这是我们获取数据的函数
  },
  methods: {
    fetchData() {
      const params = {};
      params.pageNum = this.page;
      params.pageSize = this.pageSize;
      if (this.filters.title) {
        params.title = this.filters.title;
      }
      this.listLoading = true;
      getList(params).then(response => {
        if (response.code == 0) {
          this.list = response.data.list || [];
          this.total = response.data.total || 0;
        }
        this.listLoading = false;
      });
    },
    resetForm() {},
    reLoadForm() {
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    del(index, row) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delArticle({ id: row.id }).then(response => {
          if (response.code === 0) {
            this.$message({
              message: "删除成功",
              center: true,
              type: "success"
            });
            this.page = 1;
            this.fetchData();
          }
        });
      });
    },
    search() {
      this.page = 1;
      this.fetchData();
    }
  }
};
</script>
