<template>
  <el-form
    ref="form"
    class="form"
    label-width="80px"
    :rules="rules"
    :model="record"
  >
    <el-form-item label="标题：" prop="title">
      <el-input v-model="record.title"/>
    </el-form-item>
    <el-form-item label="描述：">
      <el-input
        v-model="record.description"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 8 }"
      />
    </el-form-item>
    <el-form-item label="排序：" prop="sort">
      <el-input-number v-model="record.sort" :min="0" :max="10000"/>
    </el-form-item>
    <el-form-item label="列表显示" prop="listType">
      <el-select v-model="record.listType" placeholder="请选择列表样式">
        <el-option label="纯文字" value="0"/>
        <el-option label="单图" value="3"/>
        <el-option label="上文字下图" value="2"/>
        <el-option label="左文字右图" value="1"/>
        <el-option label="三图并排" value="4"/>
      </el-select>
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
    <el-form-item label="内容" prop="content">
      <quill-editor
        v-model="record.content"
        @placeholder="
          '请输入文章内容';

        "
        @change="change"
      />
    </el-form-item>
    <el-form-item class="mybutton">
      <el-button :loading="loading" type="primary" @click="submitForm('form')">
        保存
      </el-button>
      <el-button @click="$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import WangEditor from "@/components/WangEditor";
import QuillEditor from "@/components/Quill";
import { getDetail, updateArticle, addArticle, clearImages } from "@/api/article";

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
      loading: false,
      record: {
        disableFlag: false,
        sort: 0,
        listType: "0"
      },
      rules: {
        title: [{ required: true, message: "不能为空", trigger: "blur" }],
        description: [
          { required: false, message: "不能为空", trigger: "blur" }
        ],
        sort: [{ required: true, message: "不能为空", trigger: "blur" }],
        listType: [{ required: true, message: "不能为空", trigger: "change" }],
        disableFlag: [
          { required: true, message: "必须选择", trigger: "change" }
        ],
        content: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            validator: this.validatorContent
          }
        ]
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
    getListImage(content) {
      const div = document.createElement("div");
      div.innerHTML = content;
      const imgs = div.querySelectorAll("img");
      const listImage = [];
      imgs.forEach(ele => {
        const src = ele.getAttribute("src");
        if (src) {
          if (!src.startsWith("http")) {
            listImage.push(ele.getAttribute("src").split("!")[0]);
          } else {
            listImage.push(ele.getAttribute("src"));
          }
        }
      });
      return listImage;
    },
    validatorContent(rule, value, callback) {
      const listImage = this.getListImage(value);
      const listTypeValidMap = {
        "0": 0,
        "1": 1,
        "2": 1,
        "3": 1,
        "4": 3
      };
      const imageCount = listTypeValidMap[this.record.listType + ""];
      const listTypeWord = [
        "纯文字",
        "左文字右图",
        "上文字下图",
        "单图",
        "三图并排"
      ];
      if (imageCount > listImage.length) {
        callback(
          new Error(
            `因为"列表显示"选择了"${
              listTypeWord[this.record.listType]
            }",则文章内容至少需要存在"${imageCount}"张图片才可以正常显示`
          )
        );
      } else {
        callback();
      }
    },
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
    clearServerImage(content) {
      let clearList = this.getListImage(content);
      clearList = clearList.map(src => {
        return src.substr(src.lastIndexOf("/") + 1).split("!")[0];
      });
      clearImages(clearList);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.record);
          params.listImage = this.getListImage(params.content).join(",");
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
      this.loading = true;
      updateArticle(params).then(response => {
        if (response.code == 0) {
          this.$message({
            message: "修改成功",
            center: true,
            type: "success"
          });
          this.clearServerImage(params.content);
        }
        this.loading = false;
      });
    },
    add(params) {
      this.loading = true;
      addArticle(params).then(response => {
        if (response.code == 0) {
          this.record.id = response.data;
          this.$message({
            message: "添加成功",
            center: true,
            type: "success"
          });
          this.clearServerImage(params.content);
        }
        setTimeout(() => {
          this.loading = false;
        }, 200);
      });
    }
  }
};
</script>
<style lang="scss">
.mybutton {
  margin-top: 40px;
}

.quill-editor {
  .ql-toolbar.ql-snow {
    padding-bottom: 40px;
  }
}

.form {
  padding: 50px 10px 50px 0;
  max-width: 530px;
  @media screen and (min-width: 650px) {
    padding: 50px 40px;
  }
}
</style>
