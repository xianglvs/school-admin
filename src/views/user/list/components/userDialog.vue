<template>
  <div>
    <new-dialog
      :show="isShow"
      :title="title"
      :on-close="closeDialog"
      :on-submit="submitUserForm"
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
          <el-input v-model="user.loginName" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" placeholder="请输入密码" type="password"/>
        </el-form-item>
        <el-form-item label="用户类型" prop="type">
          <el-select v-model="user.type" placeholder="请选择用户类型">
            <el-option label="个人" :value="2"/>
            <el-option label="系统" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="请输入用户姓名"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="user.qq" placeholder="请输入QQ号"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="请输入邮箱"/>
        </el-form-item>
      </el-form>
    </new-dialog>
  </div>
</template>
<script>
import NewDialog from "@/components/Newdialog/index.vue";
import { addUser, updateUser } from "@/api/user";
import { validPassword, validPhone, validQQ, validEmail } from "@/utils/validate";
import md5 from "js-md5";

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
      isShow: false,
      user: this.currentUser,
      rules: {
        loginName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        type: [{ required: true, message: "请选择用户类型", trigger: "change" }],
        name: [{ required: false, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: false, validator: validPassword, trigger: "blur" }],
        phone: [{ required: false, validator: validPhone, trigger: "blur" }],
        qq: [{ required: false, validator: validQQ, trigger: "blur" }],
        email: [{ required: false, validator: validEmail, trigger: "blur" }]
      },
      cloneUser: null
    };
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
      this.isShow = true;
    },
    closeDialog() {
      this.isShow = false;
      this.$refs["userForm"].resetFields();
      this.$emit("fetchData");
    },
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.searchRolesList = this.newRolesList.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
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
          if (params.password != null) {
            params.password = md5(params.password + "/ab12&%*&&%%$$#@");
          }
          if (params.id) {
            this.update(params);
          } else {
            this.add(params);
          }
          this.isShow = false;
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
          this.isShow = false;
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
        type: user.type
      };
      addUser(params).then(response => {
        if (response.code == 0) {
          this.$message({
            message: "添加成功",
            center: true,
            type: "success"
          });
          this.isShow = false;
          this.$emit("fetchData");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-form {
  width: 86%;
  margin: 0 auto;

  .el-select {
    width: 100%;
  }
}
</style>
