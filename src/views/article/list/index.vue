<template>
  <div class="app-container">
    <el-dialog
      title="二维码"
      :visible.sync="showCode"
      width="80%"
      max-width="640"
    >
      <div class="code-wrap">
        <vue-qr :autoColor="false" colorDark="#000" :text="codeText" :size="400" :margin="0"></vue-qr>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCode = false">取　消</el-button>
        <el-button type="primary" @click="downloadCode">下　载</el-button>
      </span>
    </el-dialog>
    <new-dialog
      title="修改排序"
      :show="showSort"
      :on-close="()=>{ this.showSort = false}"
      :on-submit="submitSortForm"
    >
      <el-form
        class="dialog-form"
        label-width="80px"
        :model="sortForm"
      >
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="sortForm.sort" :min="0" :max="10000" placeholder="请输入排序号"/>
        </el-form-item>
      </el-form>
    </new-dialog>
    <el-form ref="filters" :inline="true" :model="filters">
      <el-form-item prop="title">
        <el-input
          v-model="filters.title"
          placeholder="文章标题"
          style="width:200px;margin-right:10px;"
        />
      </el-form-item>
      <el-form-item prop="disableFlag">
        <el-select v-model="filters.disableFlag" placeholder="状态">
          <el-option label="全部" value=""/>
          <el-option label="启用" value="false"/>
          <el-option label="禁用" value="true"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="listType">
        <el-select v-model="filters.listType" placeholder="列表样式">
          <el-option label="全部" value=""/>
          <el-option label="纯文字" value="0"/>
          <el-option label="单图" value="3"/>
          <el-option label="上文字下图" value="2"/>
          <el-option label="左文字右图" value="1"/>
          <el-option label="三图并排" value="4"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">快速查找</el-button>
        <el-button
          @click="$refs['filters'].resetFields(), search()"
        >重置
        </el-button
        >
        <el-button
          type="primary"
          @click="$router.push('/article/createArticle')"
        >添加
        </el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="sort" label="序号" min-width="60"/>
      <el-table-column prop="title" label="标题" min-width="150"/>
      <el-table-column
        prop="description"
        label="描述"
        min-width="200"
        :formatter="
          (row, column, cellValue) =>{
            if(cellValue && cellValue.length > 20){
              return cellValue.substr(0,20) + '......';
            }
          }
        "
      />
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
      <el-table-column
        prop="disableFlag"
        label="禁用"
        :formatter="
          (row, column, cellValue) => ({ false: '否', true: '是' }[cellValue])
        "
        min-width="80"
      />
      <el-table-column prop="createDate" label="添加时间" width="200"/>
      <el-table-column fixed="right" label="操作" width="130">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showCodeDialog(scope.row)"
          >
            二维码
          </el-button>
          <el-button
            size="mini"
            @click="showSortDialog(scope.row)"
          >
            排序号
          </el-button>
          <el-button
            size="mini"
            @click="$router.push(`/article/editArticle/${scope.row.id}`)"
          >
            编　辑
          </el-button>
          <el-button
            size="mini"
            @click="del(scope.$index, scope.row)"
          >
            删　除
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
import { getList, updateArticle, delArticle } from "@/api/article";
import NewDialog from "@/components/Newdialog/index.vue";
import VueQr from "vue-qr";

export default {
  name: "ArticleList",
  components: { VueQr, NewDialog },
  data() {
    return {
      sortForm: {
        sort: 0
      },
      currentRow: null,
      showCode: false,
      showSort: false,
      codeText: "",
      list: null,
      listLoading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      ruleForm: {},
      filters: {
        title: "",
        listType: null
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
    showSortDialog(row) {
      this.currentRow = row;
      this.sortForm.sort = row.sort;
      this.showSort = true;
    },
    showCodeDialog(row) {
      this.currentRow = row;
      this.codeText = `${window.location.protocol}//${window.location.host}/article/detail?id=${row.id}`;
      this.showCode = true;
    },
    submitSortForm() {
      this.loading = true;
      updateArticle({ id: this.currentRow.id, sort: this.sortForm.sort }).then(response => {
        if (response.code == 0) {
          this.$message({
            message: "修改成功",
            center: true,
            type: "success"
          });
          this.reLoadForm();
        }
        this.showSort = false;
        this.loading = false;
      });
    },
    downloadCode() {
      this.showCode = false;
      this.codeText = `${window.location.protocol}//${window.location.host}/article/detail?id=${this.currentRow.id}`;
      const a = document.createElement("a");
      const dataSrc = document.querySelector(".code-wrap img").src;
      const evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      a.download = this.currentRow.title;
      a.href = dataSrc;
      a.click();
    },
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
<style lang="scss">
.el-dialog {
  width: 28%;
  max-width: 400px;
  min-width: 340px;
}

.code-wrap {
  text-align: center;
}

.code-wrap img {
  width: 80%;
}

.cell .el-button {
  margin: 0 0 5px 0;
  padding: 7px 7px;
}
</style>
