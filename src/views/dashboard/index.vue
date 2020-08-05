<template>
  <div class="app-container">
    <div class="user-wrapper">
      <div class="user-logo-box">
        <div class="user-logo">
          <svg-icon class="user" icon-class="user" />
        </div>
      </div>
      <div class="user-info-box">
        <div class="item">用户名：admin</div>
        <div class="item">手机号：18801911112</div>
        <div class="item">QQ号：760387011@qq.com</div>
        <div class="item">邮箱：760387011@qq.com</div>
      </div>
      <div class="state-box">
        <a href="javascrip:(void)">重置密码</a>
        <a>修改</a>
      </div>
    </div>
    <!-- <div class="dashboard-text">roles: <span v-for="role in user.data.roles" :key="role">{{ role }}</span></div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters([
      "user"
    ])
  },
  created() {
    console.log(this.user, 111);
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
@import '~@/styles/mixin.scss';

.app-container {
  .user-wrapper{
    width: 33%;
    padding: 20px;
    background-color: #{$lightGray};
    border-radius: 2px;
    display: flex;
    position: relative;
    @include clearfix;
    .user-logo-box{
      float: left;
      width: 54px;
      display: flex;
      align-items: center;
      .user-logo{
        width: 54px;
        height: 54px;
        background-color: $menuActiveText;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .user{
          font-size: 24px;
          color: #fff;
        }
      }
    }
    .user-info-box{
      flex: 1;
      margin-left: 15px;
      .item{
        font-size: $basicFontSize;
        line-height: 27px;
        color: #909399;
      }
    }
    .state-box{
      position: absolute;
      top: 14px;
      right: 0;
      a{
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
</style>
<style>
@media screen and (max-width: 640px) {
  .app-main .app-container .user-wrapper{
    width: 100%;
  }
}
</style>
