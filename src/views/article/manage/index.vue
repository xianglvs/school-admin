<template>
  <el-form
    ref="form"
    class="form"
    label-width="0"
    :rules="rules"
    :model="record"
  >
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="record.title"/>
    </el-form-item>
    <el-form-item label="首页显示文章描述">
      <el-input
        v-model="record.description"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 8 }"
      />
    </el-form-item>
    <el-form-item label="首页文章排序" prop="sort">
      <el-input-number v-model="record.sort" :min="0" :max="10000"/>
    </el-form-item>
    <el-form-item label="首页列表显示类型" prop="listType">
      <el-select v-model="record.listType" placeholder="请选择列表样式">
        <el-option label="纯文字" value="0"/>
        <el-option label="单图" value="3"/>
        <el-option label="上文字下图" value="2"/>
        <el-option label="左文字右图" value="1"/>
        <el-option label="三图并排" value="4"/>
      </el-select>
    </el-form-item>
    <el-form-item label="首页列表是否可见" prop="disableFlag">
      <el-radio-group v-model="record.disableFlag">
        <el-radio :label="false">是</el-radio>
        <el-radio :label="true">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="内容：" prop="content">
      <wang-editor
        v-model="record.content"
        :is-clear="isClear"
        @change="change"
      />
    </el-form-item> -->
    <el-form-item label="文章具体内容" prop="content">
      <quill-editor
        v-model="record.content"
        :preview="preview"
        placeholder="请输入文章内容"
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
import { getDetail, updateArticle, addArticle, setImageIds, addPreview } from "@/api/article";

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
    preview(content) {
      this.loading = true;
      const params = { title: this.record.title || "未设置", content: content || "<p>未设置</p>" };
      addPreview(params).then(res => {
        if (res.code == 0) {
          const key = res.data;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("src", `/article/preview?key=${key}`);
          iframe.setAttribute("class", "iframe-preview");
          document.body.appendChild(iframe);
          const close = document.createElement("div");
          close.innerText = "退出";
          close.setAttribute("class", "close-preview");
          document.body.appendChild(close);
          const app = document.querySelector("#app");
          app.setAttribute("style", "display:none;");
          close.addEventListener("click", () => {
            document.body.removeChild(iframe);
            document.body.removeChild(close);
            app.removeAttribute("style");
          });
        }
        this.loading = false;
      });
    },
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
    setImagesArticleId(id, content) {
      let list = this.getListImage(content);
      list = list.map(src => {
        return src.split("!")[0].replace(process.env.VUE_APP_BASE_API, "");
      });
      setImageIds({ articleId: id, imagePaths: list });
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
          this.setImagesArticleId(params.id, params.content);
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
          this.setImagesArticleId(this.record.id, params.content);
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
.form{

}
.el-form-item__label{
  white-space: nowrap;
  float: none;
}
.close-preview {
  width: 50px;
  height: 50px;
  position: fixed;
  z-index: 1001;
  background-color: #000;
  border-radius: 50%;
  opacity: 0.5;
  right: 1vw;
  top: 1vh;
  font-size: 14px;
  text-align: center;
  color: #FFF;
  line-height: 50px;
  cursor: pointer;
}

.iframe-preview {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #FFF;
  z-index: 1000;
}

.mybutton {
  margin-top: 40px;
}

.quill-editor {
  .ql-toolbar.ql-snow {
    padding-bottom: 0;
  }
}

.form {
  padding: 50px 2vw;
  max-width: 530px;
  @media screen and (min-width: 650px) {
    padding: 50px 40px;
  }
}
</style>
