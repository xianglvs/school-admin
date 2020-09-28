<template>
  <div>
    <new-dialog
      ref="dialog"
      :title="title"
      @closeDialog="closeDialog"
      @submitDialog="submitRoleForm"
    >
      <el-form
        ref="roleForm"
				v-if="role"
        class="dialog-form"
        label-width="100px"
        :rules="rules"
        :model="role"
      >
        <el-form-item label="角色中文名" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色中文名" />
        </el-form-item>
        <el-form-item label="角色英文名" prop="enName">
          <el-input v-model="role.enName" placeholder="请输入角色英文名" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="role.disableFlag"
            active-text="禁用"
            inactive-text="启用">
          </el-switch>
        </el-form-item>
      </el-form>
    </new-dialog>
	</div>
</template>
<script>
import NewDialog from "@/components/Newdialog/index.vue";
import { addRole, updateRole } from "@/api/roles";

export default {
  name: "RoleDialog",
  props: {
		title: {
			type: String
    },
    currentRole: {
			type: Object
		}
	},
	components: {
    NewDialog
  },
  watch: {
    currentRole: {
      handler(newVal, oldVal) {
        this.role = newVal;
      },
      deep: true,
      immediate: true
    }
  },
	data() {
		return {
      role: this.currentRole,
      rules: {
        name: [{ required: true, message: "请输入角色中文名", trigger: "blur" }],
        enName: [{ required: false, message: "请输入角色英文名", trigger: "blur" }]
      }
		}
  },
	methods: {
    showDialog() {
      this.$refs.dialog.handleShow();
    },
    closeDialog() {
      this.$refs["roleForm"].resetFields();
      this.$emit("fetchData");
    },
    submitRoleForm() {
      this.$refs["roleForm"].validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.role);
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
    add(role) {
      const params = {
        disableFlag: role.disableFlag,
        enName: role.enName,
        menuIds: [],
        name: role.name,
        officeId: "0",
        parentId: "0",
        remarks: ""
      };
      addRole(params).then(response => {
        if (response.code == 0) {
          this.$message({
            message: "添加成功",
            center: true,
            type: "success"
          });
          this.$refs.dialog.handleClose();
          this.$emit("fetchData");
        }
      });
    },
    update(role) {
      const params = {
        disableFlag: role.disableFlag,
        enName: role.enName,
        id: role.id,
        menuIds: role.menuIds || [],
        name: role.name,
        officeId: role.officeId,
        parentId: role.parentId,
        remarks: role.remarks
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
.dialog-form{
	width: 86%;
	margin: 0 auto;
	.el-select{
		width: 100%;
	}
}
</style>
