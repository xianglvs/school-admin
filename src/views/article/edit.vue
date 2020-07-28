<template>
  <el-form
    ref="rowRecord"
    label-width="100px"
    :rules="rules"
    :model="rowRecord"
    style="max-width:520px;overflow:auto;padding-right:50px"
  >
    <el-form-item label="标题：" prop="title">
      <el-input v-model="rowRecord.title" />
    </el-form-item>
    <el-form-item label="描述：" prop="description">
      <el-input
        v-model="rowRecord.description"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 8 }"
      />
    </el-form-item>
    <el-form-item label="排序：" prop="sort">
      <el-input-number v-model="rowRecord" :min="0" :max="10000" />
    </el-form-item>
    <el-form-item label="状态：" prop="delFlag">
      <el-radio-group v-model="rowRecord.delFlag">
        <el-radio :label="false">启用</el-radio>
        <el-radio :label="true">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="内容：" prop="content">
      <wang-editor
        v-model="rowRecord.content"
        :is-clear="isClear"
        @change="change"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('rowRecord')">
        保存
      </el-button>
      <el-button @click="resetForm">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import WangEditor from "@/components/WangEditor";
import { updateArticle, addArticle } from "@/api/article";

export default {
  name: "ArticleEdit",
  components: { WangEditor },
  props: {
    rowRecord: {}
  },
  data() {
    return {
      isClear: false,
      rules: {
        title: [{ required: true, message: "不能为空", trigger: "blur" }],
        description: [{ required: true, message: "不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "不能为空", trigger: "blur" }],
        delFlag: [{ required: true, message: "不能为空", trigger: "blur" }],
        content: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    resetForm() {
      this.$emit("resetForm");
      this.clearRuleForm();
    },
    clearRuleForm() {
      this.$refs["rowRecord"].resetFields();
      this.rowRecord.title = "";
      this.rowRecord.description = "";
    },
    change(val) {
      if (val == "<p><br></p>") {
        val = "";
      }
      this.rowRecord.content = val;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.rowRecord);
          if (params.id) {
            this.update(params);
          } else {
            this.add(params);
          }
        } else {
          return false;
        }
      });
    },
    update(params) {
      updateArticle(params).then(response => {
        if (response.code == 0) {
          this.$message({
            message: "修改成功",
            center: true,
            type: "success"
          });
          this.$emit("reLoadForm");
        }
      });
    },
    add(params) {
      delete params.id;
      addArticle(params).then(response => {
        if (response.code == 0) {
          this.$message({
            message: "添加成功",
            center: true,
            type: "success"
          });
          this.$emit("reLoadForm");
        }
      });
    }
  }
};
</script>
