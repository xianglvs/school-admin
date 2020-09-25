<template>
  <div>
    <new-dialog
      ref="dialog"
      :title="title"
      @closeDialog="closeDialog"
      @submitDialog="submitMenu"
    >
      <el-tree
        ref="tree"
        :data="menuList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="checkedKeysList"
        :default-checked-keys="checkedKeysList"
        :props="defaultProps"
      />
    </el-tree>
    </new-dialog>
  </div>
</template>
<script>
import NewDialog from "@/components/Newdialog/index.vue";
import { updateRole, getRole } from "@/api/roles";

export default {
  name: "MenuDailog",
  props: {
    menuList: {
      type: Array,
      required: true
    }
  },
  components: {
    NewDialog
  },
  data() {
		return {
      roleId: '',
      title: "选择菜单",
      defaultProps: {
        children: "children",
        label: "name"
      },
      checkedKeysList: []
    }
  },
  created() {
    console.log(this.menuList, "menuList");
  },
  methods: {
    showDialog(roleId) {
      this.$refs.dialog.handleShow();
      this.roleId = roleId;
      getRole(roleId).then(response => {
        if (response.code == 0) {
          const checkedMenuList = response.data || [];
          let list = [];
          checkedMenuList.forEach(item => {
            list.push(item.id);
          });
          this.checkedKeysList = list;
          this.$refs.tree.setCheckedKeys(this.checkedKeysList); // 设置选中的值
        }
      });
    },
    closeDialog() {
      this.$refs.tree.setCheckedKeys([]);
    },
    submitMenu() {
      const params = {
        id: this.roleId,
        menuIds: this.$refs.tree.getCheckedKeys()
      };
      updateRole(params).then(response => {
        if (response.code == 0) {
          this.$message({
            message: "修改成功",
            center: true,
            type: "success"
          });
          this.$refs.dialog.handleClose();
          this.$emit("fetchData");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
