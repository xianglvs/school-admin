<template>
  <div>
    <new-dialog
      ref="dialog"
      :title="title"
      @submitDialog="submitUserForm"
    >
      <el-form
        ref="userForm"
				v-if="user"
        class="dialog-form"
        label-width="80px"
        :rules="rules"
        :model="user"
      >
        <el-form-item label="角色中文名" prop="name">
          <el-input v-model="user.loginName" placeholder="请输入角色中文名" />
        </el-form-item>
        <el-form-item label="角色英文名" prop="enName">
          <el-input v-model="user.name" placeholder="请输入角色英文名" />
        </el-form-item>
      </el-form>
    </new-dialog>
	</div>
</template>
<script>
import NewDialog from "@/components/Newdialog/index.vue";

export default {
	name: "RoleDialog",
	components: {
    NewDialog
	},
	data() {
		return {
      rules: {
        name: [{ required: true, message: "请输入角色中文名", trigger: "blur" }],
        enName: [{ required: false, message: "请输入角色英文名", trigger: "blur" }]
      }
		}
	},
	methods: {
    submitUserForm() {}
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
