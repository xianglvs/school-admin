<template>
  <div class="app-container" style="position: relative;">
    <el-form :inline="true"  :model="filters">
          <el-form-item>
                文章标题：<el-input placeholder="文章标题" v-model="filters.title" style="width:200px;margin-right:10px;"></el-input>
          </el-form-item>
          <el-form-item>
                <el-button @click="search()">快速查找</el-button>
                <el-button type="primary" @click="showAddDialog()">添加</el-button>
          </el-form-item>
    </el-form>
    <el-table :data="list" highlight-current-row  style="width: 100%;" v-loading='listLoading'>
							<el-table-column prop="title" label="标题" min-width="150"></el-table-column>
              <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
              <el-table-column prop="createDate" label="添加时间" width="200"></el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="mini"  @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
                     <el-button size="mini" type="danger"  @click="del(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
    </el-table>
    <el-col :span="24"  >
              <el-pagination class="page" style="float:right;margin:20px 0"
                             @current-change="handleCurrentChange"
                             :page-size="10"
                             layout="prev, pager, next, total"
                             :total="total">
              </el-pagination>
    </el-col>
    <div style="width:100%;height:100%;position:absolute;z-index: 50;background-color:#ffffff;top:20px;left:20px" v-show="tanKuang" ref="tanKuang">
     <article-edit :rowRecord="ruleForm" @resetForm="resetForm" @reLoadForm="reLoadForm"></article-edit>
    </div>
  </div>
</template>


<script>
import  articleEdit from '@/views/article/edit'
import { getList,delArticle } from '@/api/article'


export default {
  name: 'article-list',
  components: {articleEdit },
  data() {
    return {
      list: null,
      listLoading: false,
      tanKuang:false,
      ruleDialog:false,
      total:0,
      page:1,
      ruleForm: {},
      filters: {
        title: '',
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      let params={}
      params.pageNum= this.page,
      params.pageSize= 10;
      if(this.filters.title){
        params.title=this.filters.title;
      }
      this.listLoading = true
      getList(params).then(response => {
        if(response.code==0){
            this.list = response.data.list || []
            this.total = response.data.total || 0
        }
        this.listLoading = false
      })
    },
      showEditDialog: function (index,row) {
				this.tanKuang=true;
        this.ruleForm = Object.assign({}, row);
      },
      showAddDialog: function () {
        this.tanKuang=true;
        this.ruleForm = {delFlag:false,sort:0};
      },
      resetForm() {
        this.tanKuang = false;
      },
      reLoadForm() {
        this.tanKuang = false;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.fetchData();
      },
      del(index,row){
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
              delArticle({id:row.id}).then(response => {
                  if(response.code==0){
                    this.$message({
                      message: '删除成功',
                      center: true,
                      type: 'success'
                    });
                    this.page=1;
                    this.fetchData();
                  }
              })
        })

      },
      search(){
        this.page = 1;
        this.fetchData();
      }
      
  }
}
</script>
