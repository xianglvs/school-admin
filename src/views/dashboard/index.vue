<template>
  <div class="app-container">
    <div class="user-wrapper">
      <div class="user-logo-box">
        <div class="user-logo">
          <svg-icon class="user" icon-class="user"/>
        </div>
      </div>
      <div class="user-info-box">
        <div class="item">
          首页二维码：
          <vue-qr :autoColor="false" colorDark="#000" :text="codeText" :size="400" :margin="0"></vue-qr>
        </div>
        <div class="item">ㅤ首页名称：{{ home.title }}</div>
        <div class="item">ㅤ联系方式：{{ home.mobile }}</div>
      </div>
      <div class="state-box">
        <a href="#" @click="showChangeHomeDialog">修改</a>
        <a href="#" @click="showChangePsdDialog">重置密码</a>
        <a href="#" @click="downloadCode">下载二维码</a>
      </div>
    </div>

    <!--    <div class="user-wrapper">-->
    <!--      <div class="user-logo-box">-->
    <!--        <div class="user-logo">-->
    <!--          <svg-icon class="user" icon-class="user"/>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="user-info-box">-->
    <!--        <div class="item">用户名：{{ user.loginName }}</div>-->
    <!--        <div class="item">手机号：{{ user.phone }}</div>-->
    <!--        <div class="item">QQ号：{{ user.qq }}</div>-->
    <!--        <div class="item">邮箱：{{ user.email }}</div>-->
    <!--      </div>-->
    <!--      <div class="state-box">-->
    <!--        <a href="#" @click="showChangePsdDialog">重置密码</a>-->
    <!--        <a href="#" @click="showChangeUserDialog">修改</a>-->
    <!--      </div>-->
    <!--    </div>-->
    <new-dialog
      ref="changeHomeDialog"
      title="网站信息"
      :show="site"
      :on-close="closeChangeHomeDialog"
      :on-submit="submitChangeHomeForm"
    >
      <el-form
        ref="changeHomeForm"
        class="dialog-form"
        label-width="80px"
        :model="homeForm"
        :rules="homeRules"
      >
        <el-form-item label="网站标题" prop="title">
          <el-input v-model="homeForm.title" placeholder="请输入网站标题"/>
        </el-form-item>
        <el-form-item label="网站电话" prop="phone">
          <el-input v-model="homeForm.mobile" placeholder="请输入网站电话"/>
        </el-form-item>
      </el-form>
    </new-dialog>

    <!-- <div class="dashboard-text">roles: <span v-for="role in user.data.roles" :key="role">{{ role }}</span></div> -->
    <new-dialog
      ref="changePsdDialog"
      title="重置密码"
      :show="pwd"
      :on-close="closeChangePsdDialog"
      :on-submit="submitChangePsdForm"
    >
      <el-form ref="changePsdForm" class="dialog-form" label-width="90px" :model="psdForm" :rules="psdRules">
        <el-form-item label="原密码" prop="password">
          <el-input v-model="psdForm.password" type="password" placeholder="请输入原密码"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="psdForm.newPassword" type="password" placeholder="请设置新密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword2">
          <el-input v-model="psdForm.newPassword2" type="password" placeholder="请确认新密码"/>
        </el-form-item>
      </el-form>
    </new-dialog>

    <new-dialog
      ref="changeUserDialog"
      title="用户信息"
      :on-submit="submitChangeUserForm"
    >
      <el-form
        ref="changeUserForm"
        class="dialog-form"
        label-width="80px"
        :model="userForm"
        :rules="userRules"
      >
        <el-form-item label="用户名" prop="loginName">
          <el-input v-model="userForm.loginName" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="userForm.qq" placeholder="请输入QQ号"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"/>
        </el-form-item>
      </el-form>
    </new-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { updatePassword, updateUser } from "@/api/user";
import { getHome, updateHome } from "@/api/home";
import NewDialog from "@/components/Newdialog/index.vue";
import VueQr from "vue-qr";

export default {
  name: "Dashboard",
  components: {
    NewDialog, VueQr
  },
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value === this.psdForm.password) {
        callback(new Error("新密码不能与原密码相同!"));
      } else {
        callback();
      }
    };
    const validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.psdForm.newPassword) {
        callback(new Error("与新密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      site: false,
      pwd: false,
      codeText: `${window.location.protocol}//${window.location.host}`,
      psdForm: {
        password: "",
        newPassword: "",
        newPassword2: ""
      },
      psdRules: {
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请设置新密码", trigger: "blur" },
          { validator: validateNewPassword, trigger: "blur" }
        ],
        newPassword2: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: validateNewPassword2, trigger: "blur" }
        ]
      },
      home: {
        title: "",
        mobile: ""
      },
      homeForm: {
        title: "",
        mobile: ""
      },
      homeRules: {
        title: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ]
      },
      userForm: {
        loginName: "",
        phone: "",
        qq: "",
        email: ""
      },
      userRules: {
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        phone: [
          { message: "请输入手机号", trigger: "blur" },
          { pattern: /^1(3|4|5|6|7|8|9)\d{9}$/, message: "手机格式不对" }
        ],
        qq: [
          { message: "请输入QQ号", trigger: "blur" },
          { pattern: /^[1-9][0-9]{4,9}$/, message: "QQ号格式不对" }
        ],
        email: [
          { message: "请输入邮箱", trigger: "blur" },
          { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: "请输入有效的邮箱" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      "user"
    ])
  },
  async created() {
    this.userForm = Object.assign({}, this.user);
    const res = await getHome();
    this.home = res.data;
  },
  methods: {
    ...mapActions({
      "getInfo": "user/getInfo"
    }),
    closeChangeHomeDialog() {
      this.site = false;
    },
    showChangeHomeDialog() {
      this.homeForm = { ...this.home };
      this.site = true;
    },
    submitChangeHomeForm() {
      this.$refs["changeHomeForm"].validate(valid => {
        if (valid) {
          this.home = { ...this.homeForm };
          return updateHome({ ...this.home }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: "修改成功",
                center: true,
                type: "success"
              });
              this.site = false;
            }
          });
        } else {
          this.$message.error("请正确填写表单");
          return false;
        }
      });
    },
    downloadCode() {
      const a = document.createElement("a");
      const dataSrc = document.querySelector(".item img").src;
      const evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true);
      a.download = "首页二维码";
      a.href = dataSrc;
      a.click();
    },
    closeChangePsdDialog() {
      this.pwd = false;
      this.$refs["changePsdForm"].resetFields();
    },
    showChangePsdDialog() {
      this.pwd = true;
    },
    submitChangePsdForm() {
      this.$refs["changePsdForm"].validate(valid => {
        if (valid) {
          const params = {
            oldPassword: this.psdForm.password,
            password: this.psdForm.newPassword
          };
          updatePassword(params).then(res => {
            if (res.code == 0) {
              this.$message({
                message: "修改成功",
                center: true,
                type: "success"
              });
              this.closeChangePsdDialog();
            }
          });
        } else {
          this.$message.error("请正确填写表单");
          return false;
        }
      });
    },
    showChangeUserDialog() {
      this.$refs.changeUserDialog.handleShow();
    },
    submitChangeUserForm() {
      this.$refs["changeUserForm"].validate(valid => {
        if (valid) {
          const params = {
            email: this.userForm.email,
            id: this.userForm.id,
            latitude: this.userForm.latitude || 0,
            longitude: this.userForm.longitude || 0,
            mobile: this.userForm.mobile,
            name: this.userForm.loginName,
            no: this.userForm.no,
            phone: this.userForm.phone || "",
            photo: this.userForm.photo || "",
            qq: this.userForm.qq || "",
            remarks: this.userForm.remarks || "",
            // roles: this.userForm.roles || [],
            roles: [],
            sysAreaId: this.userForm.sysAreaId,
            sysOfficeId: this.userForm.sysOfficeId,
            type: this.userForm.type,
            weixin: this.userForm.weixin || ""
          };
          updateUser(params).then(res => {
            if (res.code == 0) {
              this.$message({
                message: "修改成功,即将退出登录",
                center: true,
                type: "success"
              });
              this.$refs.changeUserDialog.handleClose();
              this.$store.dispatch("user/logout");
              setTimeout(async() => {
                await this.$store.dispatch("user/logout");
                this.$router.push(`/login?redirect=${this.$route.fullPath}`);
              }, 2000);
            }
          });
        } else {
          this.$message.error("请正确填写表单");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/mixin.scss";

.app-container {
  .user-wrapper {
    width: 33%;
    padding: 20px;
    margin-bottom: 10px;
    background-color: #{$lightGray};
    border-radius: 2px;
    display: flex;
    position: relative;
    @include clearfix;

    .user-logo-box {
      float: left;
      width: 54px;
      display: flex;
      align-items: center;

      .user-logo {
        width: 54px;
        height: 54px;
        background-color: $menuActiveText;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        .user {
          font-size: 24px;
          color: #fff;
        }
      }
    }

    .user-info-box {
      flex: 1;
      margin-left: 15px;

      .item {
        font-size: $basicFontSize;
        line-height: 27px;
        color: #909399;
      }

      .item img {
        width: 100px;
        height: 100px;
        vertical-align: middle;
        margin-bottom: 10px;
      }
    }

    .state-box {
      position: absolute;
      top: 14px;
      right: 0;

      a {
        display: block;
        width: 64px;
        height: 24px;
        border: none;
        font-size: $minFontSize;
        color: $white;
        line-height: 24px;
        text-align: center;
        background-color: $green;
        margin-bottom: 6px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
      }
    }
  }
}

.dialog-form {
  padding-right: 1.5vw;
}
</style>
<style>
@media screen and (max-width: 640px) {
  .app-main .app-container .user-wrapper {
    width: 100%;
  }
}
</style>
