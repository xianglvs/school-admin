<template>
  <div class="app-container" style="position: relative;">
    <el-form :inline="true">
          <el-form-item>
                文章标题：<el-input placeholder="文章标题" style="width:200px;margin-right:10px;"></el-input>
          </el-form-item>
          <el-form-item>
                <el-button ><i class="iconfont">&#xe60e;</i>快速查找</el-button>
                <el-button type="primary" @click="showAddDialog()"><i class="iconfont" style="margin-right:3px;">&#xe6ff;</i>添加</el-button>
          </el-form-item>
    </el-form>
    <el-table :data="list" highlight-current-row  style="width: 100%;">
							<el-table-column prop="title" label="标题" min-width="150"></el-table-column>
              <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
              <el-table-column prop="createDate" label="添加时间" width="200"></el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                	<el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <el-button size="mini"  @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
                 	</el-tooltip>
                 	<el-tooltip class="item" effect="dark" content="删除" placement="top">
                     <el-button size="mini" type="danger"  @click="del(scope.$index, scope.row)">删除</el-button>
                	</el-tooltip>
                </template>
              </el-table-column>
    </el-table>
    <el-col :span="24"  class="toolbar" >
              <el-pagination class="page" style="float:right;margin-bottom:20px"
                             @current-change="handleCurrentChange"
                             :page-size="10"
                             layout="prev, pager, next, jumper"
                             :total="total">
              </el-pagination>
    </el-col>
    <div style="width:100%;height:100%;position:absolute;z-index: 50;background-color:#ffffff;top:0;left:0" v-show="tanKuang" ref="tanKuang">
     <articleEdit :rowRecord="ruleForm" @resetForm="resetForm"></articleEdit>

    </div>
  </div>
</template>


<script>
import  articleEdit from '@/views/article/edit'
import { getList } from '@/api/article'


export default {
  name: 'article-list',
  components: {articleEdit },
  data() {
    return {
      list: null,
      listLoading: true,
      tanKuang:false,
      ruleDialog:false,
      total:0,
      page:1,
      ruleForm: {
          id:'',
          title:'',
        },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      let params = {
          pageNum: this.page,
          pageSize: 10,
        };
      this.listLoading = true
      getList(params).then(response => {
        if(response.code==0){
            this.list = response.data.list || []
            this.total = response.data.total || 0
        }
        this.listLoading = false
      })
    },
    //显示编辑界面
      showEditDialog: function (index,row) {
				this.tanKuang=true;
        this.ruleForm = Object.assign({}, row);
      },
       //显示添加页面
      showAddDialog: function () {
        this.tanKuang=true;
      },
      resetForm() {
        this.tanKuang = false;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.fetchData();
      },
      
  }
}
</script>
