<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <slot />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "NewDialog",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    handleClose(done) {
      this.dialogVisible = false;
      this.$emit("closeDialog");
    },
    handleShow() {
      this.dialogVisible = true;
    },
    submitDialog() {
      this.$emit("submitDialog");
    }
  }
};
</script>
<style lang="scss">
.el-form-item__label {
  font-weight: normal;
}
.el-dialog{
  width: 32%;
  max-width: 600px;
  min-width: 340px;
}
</style>
