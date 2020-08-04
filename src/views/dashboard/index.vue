<template>
  <div class="dashboard-container">
    <div class="dashboard-user-wrapper">
      <div class="user-logo">
        <svg-icon class="user" icon-class="user" />
      </div>
      <div class="user-info">
        <div class="item">用户名：admin</div>
        <div class="item">创建时间：2020-01-01 08:00:00</div>
        <div class="item">手机号：18801911112</div>
        <div class="item">地址：土湾街道</div>
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

.dashboard {
  &-container {
    margin: 20px;
  }
  &-user-wrapper{
    padding: 20px;
    background-color: #{$lightGray};
    border-radius: 2px;
    @include clearfix;
    .user-logo{
      float: left;
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
    .user-info{
      float: left;
      margin-left: 15px;
      .item{
        font-size: $basicFontSize;
        line-height: 27px;
        color: #909399;
      }
    }
  }
}
</style>
