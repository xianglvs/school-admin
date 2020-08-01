<template>
  <div id="quillEditorQiniu" class="editor-row">
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
      class="avatar-uploader"
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
import { ImageResize } from "quill-image-resize-module";
import { ImageDrop } from "quill-image-drop-module";
import { ImageExtend } from "quill-image-paste-module";
import { getToken } from "@/utils/auth";
const fontSizeStyle = Quill.import("attributors/style/size");
fontSizeStyle.whitelist = ["16px", "18px", "20px", "24px", "32px"];
Quill.register(fontSizeStyle, true);
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/ImageExtend", ImageExtend);
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ header: [false, 1, 2, 3, 4] }], // 标题
  [{ size: fontSizeStyle.whitelist }], // 字体大小
  // [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ direction: "rtl" }], // 文本方向
  // [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ["clean"], // 清除文本格式
  ["link", "image", "video"] // 链接、图片、视频
];
// 自定义编辑器的工作条
export default {
  name: "QuillEditorQiniu",
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
      headers: {
        token: getToken()
      },
      editorOption: {
        placeholder: this.placeholder ? this.placeholder : "输入内容",
        theme: "snow", // bubble, snow
        modules: {
          toolbar: {
            container: toolbarOptions
          },
          // 拖拽上传和调整图片大小
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          },
          // 截屏上传
          ImageExtend: {
            loading: true,
            name: "file",
            change: (xhr, FormData) => {
              FormData.append("token", getToken());
            },
            action: this.url,
            response: res => {
              console.log(res, "response");
              return this.$store.getters.upload_url + res.key;
            }
          }
        }
      },
      updateParams: {},
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
    // 工具栏中的图片图标被单击的时候调用这个方法
    const imgHandler = state => {
      if (state) {
        document.querySelector(".avatar-uploader input").click();
      }
    };
    // 当工具栏中的图片图标被单击的时候
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("image", imgHandler);
  },
  methods: {
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
      // 插入图片  res.info为服务器返回的图片地址
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
      console.log(error, file, list, "error");
      this.loadingImg = false;
      if (file.error === "file exists") {
        this.$message({
          type: "error",
          message: list.name + " 已存在，请重新选择！"
        });
      } else {
        this.$message({
          type: "error",
          message: list.name + " 上传出错，请重新上传！"
        });
      }
    }
  }
};
</script>

<style>
.editor {
  line-height: normal !important;
  height: 500px;
}
.editor-row {
  padding-bottom: 100px;
}
.ql-editor p {
  font-size: 16px;
}
.ql-snow .ql-picker {
  line-height: 24px;
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

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  content: "较小";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  font-size: 18px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  content: "适中";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  font-size: 20px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  content: "较大";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
  font-size: 24px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
  content: "特大";
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
  font-size: 32px;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "正文";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
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
</style>
