<template>
      <el-col :span="24" class="warp-main">
        <el-form   ref="ruleForm" label-width="100px" class="demo-ruleForm ">

          <el-form-item  label="标题：" prop="title" >
            <el-input  v-model="rowRecord.title"></el-input>
          </el-form-item>
          <el-form-item  label="描述：" prop="description" >
            <el-input  v-model="rowRecord.description"></el-input>
          </el-form-item>
         
          <el-form-item>
            <el-button type="primary">保存</el-button>
            <el-button @click="resetForm">返回</el-button>
          </el-form-item>

        </el-form>

      </el-col>

</template>


<script>

export default {
  name: 'article-edit',
  props: {
    rowRecord: {}
  },
  data() {
    return {
      ruleForm: {
          id:'',
          title:'',
        },
    }
  },
  created() {
    
  },
  methods: {
    resetForm() {
        this.$emit('resetForm');
        this.clearRuleForm();
      },
      clearRuleForm(){
        this.$refs['ruleForm'].resetFields();
        this.rowRecord.title='';
        this.rowRecord.description='';
      },
  }
}
</script>
