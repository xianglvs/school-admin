<template>
  <div>
    <new-dialog
      ref="dialog"
      :title="title"
      @closeDialog="closeDialog"
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
        <el-form-item label="用户名" prop="loginName">
          <el-input v-model="user.loginName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" placeholder="请输入手机号" type="password" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="user.qq" placeholder="请输入QQ号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="用户角色" prop="roles">
          <el-select
            v-model="user.roles"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="rolesListChange"
          >
            <el-option
              v-for="item in searchRolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </new-dialog>
	</div>
</template>
<script>
import NewDialog from "@/components/Newdialog/index.vue";
import { addUser, updateUser } from "@/api/user";
import { validPassword, validPhone, validQQ, validEmail } from "@/utils/validate";

export default {
	name: "UserDialog",
	props: {
		title: {
			type: String
		},
		rolesList: {
			type: Array
		},
		currentUser: {
			type: Object
		}
	},
	components: {
    NewDialog
	},
	data() {
		return {
			newRolesList: [],
			searchRolesList: [],
			user: this.currentUser,
      rules: {
        loginName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        name: [{ required: false, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: false, validator: validPassword, trigger: "blur" }],
        phone: [{ required: true, validator: validPhone, trigger: "blur" }],
        qq: [{ required: false, validator: validQQ, trigger: "blur" }],
        email: [{ required: false, validator: validEmail, trigger: "blur" }],
        roles: [{ required: false, message: "请选择角色", trigger: "change" }]
      },
      cloneUser: null
		}
	},
	watch: {
		rolesList: {
			handler(newVal, oldVal) {
				this.newRolesList = newVal;
				this.searchRolesList = newVal;
      },
      immediate: true,
      deep: true
		},
		currentUser: {
      handler(newVal, oldVal) {
				this.user = newVal;
      },
      immediate: true,
      deep: true
    }
	},
	methods: {
		showDialog() {
      this.$refs.dialog.handleShow();
    },
    closeDialog() {
      this.$refs["userForm"].resetFields();
      this.$emit("fetchData");
    },
		remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.searchRolesList = this.newRolesList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.searchRolesList = [];
      }
    },
    rolesListChange(item) {
      this.$forceUpdate();
    },
		submitUserForm() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.user);
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
      updateUser(params).then(response => {
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
    },
    add(user) {
      const params = {
        email: user.email,
        loginName: user.loginName,
        name: user.name,
        password: user.password,
        phone: user.phone,
        qq: user.qq,
        roles: user.roles,
        sysOfficeId: 1,
        type: 1
      };
      addUser(params).then(response => {
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
