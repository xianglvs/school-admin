<template lang="html">
  <div ref="editorWrap" class="editor">
    <div ref="toolbar" class="toolbar" />
    <div ref="editor" class="text" />
  </div>
</template>

<script>
import E from "wangeditor";
import { getToken } from "@/utils/auth";

export default {
  name: "Editoritem",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null
    };
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    }
    // value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      window.wangEditor = this.editor;
      this.editor.customConfig.showLinkImg = false;
      this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.customConfig.uploadImgServer =
        "http://120.78.133.215:9998/api/file/upload"; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = { token: getToken() }; // 自定义 header
      this.editor.customConfig.uploadFileName = "file"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 30 * 1024 * 1024; // 将图片大小限制为 30M
      this.editor.customConfig.uploadImgMaxLength = 1; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

      this.editor.fullscreen = {
        // editor create之后调用
        init: () => {
          var node = document.createElement("div");
          node.innerHTML =
            '<div class="w-e-menu"><a class="_wangEditor_btn_fullscreen" href="###" onclick="window.wangEditor.fullscreen.toggleFullscreen()">全屏</a></div>';
          this.$refs.editorWrap.querySelector(".w-e-toolbar").appendChild(node);
        },
        toggleFullscreen: () => {
          if (this.$refs.editorWrap.classList.contains("fullscreen-editor")) {
            this.$refs.editorWrap.classList.remove("fullscreen-editor");
          } else {
            this.$refs.editorWrap.classList.add("fullscreen-editor");
          }
          if (
            this.$refs.editorWrap.querySelector("._wangEditor_btn_fullscreen")
              .innerText == "全屏"
          ) {
            this.$refs.editorWrap.querySelector(
              "._wangEditor_btn_fullscreen"
            ).innerText = "退出全屏";
          } else {
            this.$refs.editorWrap.querySelector(
              "._wangEditor_btn_fullscreen"
            ).innerText = "全屏";
          }
        }
      };

      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        // "code", // 插入代码
        "undo", // 撤销
        "redo", // 重复
        "fullscreen" // 全屏
      ];

      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          console.log(result);
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          console.log(xhr);
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          console.log(xhr);
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          if (result.code == 0) {
            const url = "http://120.78.133.215" + result.data.path;
            insertImg(url);
          }
        }
      };
      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
      this.editor.fullscreen.init();
    }
  }
};
</script>

<style lang="css">
.editor {
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 500px;
}
.w-e-toolbar {
	flex-wrap: wrap;
	-webkit-box-lines: multiple;
}

.w-e-toolbar .w-e-menu:hover{
	z-index: 10002!important;
}

.w-e-menu a {
	text-decoration: none;
}

.w-e-menu ._wangEditor_btn_fullscreen{
  color: #888;
}

.fullscreen-editor {
	position: fixed !important;
	width: 100% !important;
	height: 100% !important;
	left: 0px !important;
	top: 0px !important;
	background-color: white;
	z-index: 9999;
}

.fullscreen-editor .w-e-text-container {
	width: 100% !important;
	height: 95% !important;
}
</style>
