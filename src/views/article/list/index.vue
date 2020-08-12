<template>
  <div class="app-container">
    <el-form ref="filters" :inline="true" :model="filters">
      <el-form-item prop="title">
        <el-input
          v-model="filters.title"
          placeholder="文章标题"
          style="width:200px;margin-right:10px;"
        />
      </el-form-item>
      <el-form-item prop="listType">
        <el-select v-model="filters.listType" placeholder="请选择列表样式">
          <el-option label="全部" value="" />
          <el-option label="纯文字" value="0" />
          <el-option label="单图" value="3" />
          <el-option label="上文字下图" value="2" />
          <el-option label="左文字右图" value="1" />
          <el-option label="三图并排" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">快速查找</el-button>
        <el-button @click="$refs['filters'].resetFields(),search()">重置</el-button>
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
      <el-table-column
        prop="listType"
        label="列表样式"
        :formatter="
          (row, column, cellValue) =>
            ['纯文字', '左文字右图', '上文字下图', '单图', '三图并排'][
              cellValue
            ]
        "
        min-width="80"
      />
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
        title: "",
        listType: ""
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
      Object.assign(params, this.filters);
      this.listLoading = true;
      getList(params).then(response => {
        if (response.code == 0) {
          this.list = response.data.list || [];
          this.total = response.data.total || 0;
        }
        this.listLoading = false;
      });
    },
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
