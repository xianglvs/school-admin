<template>
  <el-form
    ref="form"
    class="form"
    label-width="100px"
    :rules="rules"
    :model="record"
  >
    <el-form-item label="标题：" prop="title">
      <el-input v-model="record.title" />
    </el-form-item>
    <el-form-item label="描述：">
      <el-input
        v-model="record.description"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 8 }"
      />
    </el-form-item>
    <el-form-item label="排序：" prop="sort">
      <el-input-number v-model="record.sort" :min="0" :max="10000" />
    </el-form-item>
    <el-form-item label="状态：" prop="disableFlag">
      <el-radio-group v-model="record.disableFlag">
        <el-radio :label="false">启用</el-radio>
        <el-radio :label="true">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="内容：" prop="content">
      <wang-editor
        v-model="record.content"
        :is-clear="isClear"
        @change="change"
      />
    </el-form-item> -->
    <el-form-item label="内容：" prop="content">
      <quill-editor v-model="record.content" @change="change" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">
        保存
      </el-button>
      <el-button @click="$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import WangEditor from "@/components/WangEditor";
import QuillEditor from "@/components/Quill";
import { getDetail, updateArticle, addArticle } from "@/api/article";

export default {
  name: "ArticleEdit",
  components: { QuillEditor },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isClear: false,
      record: {
        disableFlag: false,
        sort: 0
      },
      rules: {
        title: [{ required: true, message: "不能为空", trigger: "blur" }],
        // description: [{ required: false, message: "不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "不能为空", trigger: "blur" }],
        disableFlag: [
          { required: true, message: "必须选择", trigger: "change" }
        ],
        content: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.$route.params.id &&
      getDetail(this.$route.params.id).then(response => {
        if (response.code == 0) {
          this.record = response.data;
        }
      });
  },
  methods: {
    resetForm() {
      this.$emit("resetForm");
      this.clearRuleForm();
    },
    clearRuleForm() {
      this.$refs["record"].resetFields();
      this.record.title = "";
      this.record.description = "";
    },
    change(val) {
      if (val == "<p><br></p>") {
        val = "";
      }
      this.record.content = val;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.record);
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
          this.$route.go(-1);
        }
      });
    }
  }
};
</script>
<style>
.form {
  padding: 100px 50px;
  max-width: 530px;
}
</style>
