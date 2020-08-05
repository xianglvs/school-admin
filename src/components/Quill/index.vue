<template>
  <div id="QuillEditor">
    <el-row v-loading="loadingImg">
      <quill-editor
        ref="myQuillEditor"
        v-model="content"
        class="editor"
        :style="{ width: width ? width : '100%', background: '#fff' }"
        :options="editorOption"
        @change="onEditorChange($event)"
      />
    </el-row>
    <el-upload
      class="uploader"
      :accept="'image/*'"
      :action="url"
      name="file"
      :headers="headers"
      :data="updateParams"
      :show-upload-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
    />
  </div>
</template>
<script>
import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
import { getToken } from "@/utils/auth";
const fontSizeStyle = Quill.import("attributors/style/size");
const Delta = Quill.import("delta");
fontSizeStyle.whitelist = [
  "12px",
  "14px",
  "16px",
  false,
  "20px",
  "22px",
  "24px"
];
Quill.register(fontSizeStyle, true);
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  // [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ align: [] }, { list: "ordered" }, { list: "bullet" }], // 对齐方式 有序、无序列表
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  ["clean"], // 清除文本格式
  [{ header: [5, 4, false, 3, 2, 1] }], // 标题
  [{ size: fontSizeStyle.whitelist }], // 字体大小
  // [{ direction: "rtl" },"blockquote",], // 文本方向
  // [{ header: 1 }, { header: 2 }], // 1、2 级标题
  // [{ font: [] }], // 字体种类
  ["link", "image", "video"] // 链接、图片、视频
];
// 自定义编辑器的工作条
export default {
  name: "QuillEditor",
  components: {
    quillEditor
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 500
    },
    placeholder: {
      type: String,
      default: "输入内容"
    }
  },
  data() {
    return {
      url: process.env.VUE_APP_BASE_API + "/api/file/upload",
      content: this.value,
      updateParams: {},
      headers: {
        token: getToken()
      },
      editorOption: {
        placeholder: this.placeholder ? this.placeholder : "输入内容",
        theme: "snow", // bubble, snow
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      },
      loadingImg: false
    };
  },
  watch: {
    value: function(newVal, oldVal) {
      this.content = newVal;
    }
  },
  created() {},
  mounted() {
    const quill = this.$refs.myQuillEditor.quill;
    // 当工具栏中的图片图标被单击的时候
    quill.getModule("toolbar").addHandler("image", state => {
      if (state) {
        document.querySelector(".uploader input").click();
      }
    });
    // 过滤所有特别的字符,和图片上的属性
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, function(node, delta) {
      const ops = [];
      delta.ops.forEach(op => {
        if (op.insert && (typeof op.insert === "string" || op.insert.image)) {
          ops.push({
            insert: op.insert
          });
        }
      });
      delta.ops = ops;
      return delta;
    });

    quill.clipboard.addMatcher("img", (node, delta) => {
      // delta.forEach(ele => {
      //   ele.insert.image = "http://www.baidu.com";
      // });
      return delta;
    });

    // 自定义粘贴图片功能
    quill.root.addEventListener(
      "paste",
      (evt, value) => {
        if (
          evt.clipboardData &&
          evt.clipboardData.files &&
          evt.clipboardData.files.length
        ) {
          evt.preventDefault();
          [].forEach.call(evt.clipboardData.files, file => {
            if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
              return;
            }
            this.uploadToServer(file, res => {
              const quill = this.$refs.myQuillEditor.quill;
              var range = quill.getSelection();
              if (range) {
                //  在当前光标位置插入图片
                quill.insertEmbed(
                  range.index,
                  "image",
                  process.env.VUE_APP_BASE_API + res.data.path
                );
                //  将光标移动到图片后面
                quill.setSelection(range.index + 1);
              }
            });
          });
        }
        return;
      },
      false
    );
  },
  methods: {
    uploadToServer(file, callback) {
      this.loadingImg = true;
      var xhr = new XMLHttpRequest();
      var formData = new FormData();
      formData.append("file", file);
      formData.append("token", getToken());
      xhr.open("post", this.url);
      xhr.withCredentials = true;
      xhr.responseType = "json";
      xhr.send(formData);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          callback(xhr.response);
          this.loadingImg = false;
          return;
        }
        if (xhr.readyState == 4) {
          this.loadingImg = false;
        }
      };
    },
    onEditorChange() {
      this.$emit("change", this.content);
    },
    beforeUpload(request, file) {
      // 设置上传参数
      this.updateParams.token = getToken();
      this.loadingImg = true;
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      // 上传完成以后修改图片地址，回显到quill编辑器中
      const quill = this.$refs.myQuillEditor.quill;
      const length = quill.getSelection() ? quill.getSelection().index : 0;
      // 插入图片
      quill.insertEmbed(
        length,
        "image",
        process.env.VUE_APP_BASE_API + res.data.path
      );
      // 调整光标到最后
      quill.setSelection(length + 1);
      this.loadingImg = false;
    },
    // 上传图片失败
    uploadError(error, file, list) {
      console.error(error, file, list, "error");
      this.loadingImg = false;
      this.$message({
        type: "error",
        message: list.name + " 上传出错，请重新上传！"
      });
    }
  }
};
</script>

<style>
.quill-editor .ql-editor ol li,
.quill-editor .ql-editor ul li {
  margin: 0;
  padding: 0;
}
.ql-editor ol,
.ql-editor ul {
  padding: 0 25px;
  font-size: 18px;
}

.ql-editor li::before {
  font-size: 16px;
}

.ql-snow .ql-editor h1 {
  font-size: 24px;
  margin: 0;
}
.ql-snow .ql-editor h2 {
  font-size: 22px;
  margin: 0;
}
.ql-snow .ql-editor h3 {
  font-size: 20px;
  margin: 0;
}
.ql-snow .ql-editor h4 {
  font-size: 16px;
  margin: 0;
}
.ql-snow .ql-editor h5 {
  font-size: 14px;
  margin: 0;
}
.ql-snow .ql-editor h6 {
  font-size: 12px;
  margin: 0;
}

.ql-snow .ql-editor a {
  text-decoration: none;
}

.ql-editor img {
  width: 100%;
  display: block;
}
.uploader {
  display: none;
}
.ql-editor {
  line-height: normal !important;
  box-sizing: border-box;
  height: 700px;
}
.ql-editor p {
  font-size: 18px;
  margin: 0;
}
.ql-snow .ql-picker {
  line-height: 24px;
}

.ql-snow .ql-tooltip::before {
  content: "地址";
}

.ql-snow .ql-tooltip a.ql-action::after {
  content: "编辑";
}

.ql-snow .ql-tooltip a.ql-remove::before {
  content: "移除";
}

.ql-snow .ql-tooltip a.ql-preview {
  line-height: 40px;
}

.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "正常";
}

.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  font-size: 16px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  content: "极大";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  font-size: 24px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="22px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="22px"]::before {
  content: "特大";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="22px"]::before {
  font-size: 20px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  content: "较大";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  font-size: 20px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  content: "正常";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  font-size: 18px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
  content: "较小";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
  font-size: 16px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
  content: "小";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
  font-size: 14px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
  content: "极小";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
  font-size: 12px;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "正常";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "巨大";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "特大";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "较大";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "较小";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "小";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
.ql-clean {
  position: relative;
}
.ql-clean:hover::before {
  content: "清除字体样式";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 85px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}

.ql-bold {
  position: relative;
}
.ql-bold:hover::before {
  content: "加粗";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 40px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-italic {
  position: relative;
}
.ql-italic:hover::before {
  content: "斜体";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 40px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-underline {
  position: relative;
}
.ql-underline:hover::before {
  content: "下划线";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 50px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}

.ql-strike {
  position: relative;
}
.ql-strike:hover::before {
  content: "删除线";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 50px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}

.ql-icon-picker {
  position: relative;
}
.ql-icon-picker:hover::before {
  content: "对齐方式";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-blockquote {
  position: relative;
}
.ql-blockquote:hover::before {
  content: "引用段落";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-indent[value="-1"] {
  position: relative;
}
.ql-indent[value="-1"]:hover::before {
  content: "缩进-";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 50px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-indent[value="+1"] {
  position: relative;
}
.ql-indent[value="+1"]:hover::before {
  content: "缩进+";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 50px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-list[value="ordered"] {
  position: relative;
}
.ql-list[value="ordered"]:hover::before {
  content: "有序列表";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-list[value="bullet"] {
  position: relative;
}
.ql-list[value="bullet"]:hover::before {
  content: "无序列表";
  position: absolute;
  color: #fff;
  top: -20px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}

.ql-color {
  position: relative;
}
.ql-color:hover::before {
  content: "文字颜色";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}

.ql-background {
  position: relative;
}
.ql-background:hover::before {
  content: "背景颜色";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-header {
  position: relative;
}
.ql-header:hover::before {
  content: "文章标题";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 35px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-size {
  position: relative;
}
.ql-size:hover::before {
  content: "字体大小";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 35px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-direction {
  position: relative;
}
.ql-direction:hover::before {
  content: "文本方向";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-script[value="sub"] {
  position: relative;
}
.ql-script[value="sub"]:hover::before {
  content: "下标";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 35px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-script[value="super"] {
  position: relative;
}
.ql-script[value="super"]:hover::before {
  content: "上标";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 35px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-link {
  position: relative;
}
.ql-link:hover::before {
  content: "超链接";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 50px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-image {
  position: relative;
}
.ql-image:hover::before {
  content: "上传图片";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
.ql-video {
  position: relative;
}
.ql-video:hover::before {
  content: "插入视频";
  position: absolute;
  color: #fff;
  top: -20px;
  left: 15px;
  line-height: 12px;
  z-index: 1100;
  font-size: 12px;
  display: inline-block;
  width: 60px;
  border-radius: 2px;
  padding: 5px;
  background-color: #409eff;
}
</style>
