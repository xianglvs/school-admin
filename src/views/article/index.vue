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
                  	<a  size="small" @click="showEditDialog(scope.$index,scope.row)" class="edit" >编辑</a>
                 	</el-tooltip>
                 	<el-tooltip class="item" effect="dark" content="删除" placement="top">
                  	<a  type="danger" @click="del(scope.$index,scope.row)" class="delete">删除</a>
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
      <el-col :span="24" class="warp-main">
        <el-form   ref="ruleForm" label-width="100px" class="demo-ruleForm ">

          <el-form-item  label="标题：" prop="title" >
            <el-input  v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item  label="描述：" prop="description" >
            <el-input  v-model="ruleForm.description"></el-input>
          </el-form-item>
         
          <el-form-item>
            <el-button type="primary">保存</el-button>
            <el-button @click="resetForm">返回</el-button>
          </el-form-item>

        </el-form>

      </el-col>

    </div>
  </div>
</template>

<script>
import { getList } from '@/api/article'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
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
        console.log(Object.assign({}, row))
        this.ruleForm = Object.assign({}, row);
        this.$refs.tanKuang.setAttribute("class", "edit");
      },
       //显示添加页面
      showAddDialog: function () {
        this.tanKuang=true;
				this.$refs.tanKuang.setAttribute("id", "add");
      },
       clearRuleForm(){
        this.$refs['ruleForm'].resetFields();
        this.ruleForm.title='';
        this.ruleForm.description='';
      },
      resetForm() {
        this.tanKuang = false;
        this.clearRuleForm();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.fetchData();
      },
      
  }
}
</script>
