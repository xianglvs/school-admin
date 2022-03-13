<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <slot/>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "NewDialog",
  props: {
    /**
     * 点击确认的时候调用
     */
    onSubmit: {
      type: Function,
      require: false,
      default: () => {
      }
    },
    /**
     * 显示对话框
     */
    show: {
      type: Boolean,
      require: false,
      default: false
    },
    /**
     * 关闭对话框调用,对话框在关闭的时候都会调用
     */
    onClose: {
      type: Function,
      require: false,
      default: () => {
      }
    },
    /**
     * 只是点击取消的时候调用
     */
    onCancel: {
      type: Function,
      require: false,
      default: () => {
      }
    },
    /**
     * 标题
     */
    title: {
      type: String,
      required: true
    }
  },
  watch: {
    show(val) {
      this.dialogVisible = val;
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    close() {
      this.onClose();
    },
    cancel() {
      this.onCancel();
      this.onClose();
    },
    submit() {
      this.onSubmit();
    }
  }
};
</script>
<style lang="scss">
.el-form-item__label {
  font-weight: normal;
}

.el-dialog {
  width: 28%;
  max-width: 600px;
  min-width: 340px;

  .el-dialog__body {
    border-top: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  .el-dialog__footer {
    padding-top: 20px;
  }
}
</style>
