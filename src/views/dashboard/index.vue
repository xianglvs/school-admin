<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ this.$store.state.user}}</div>
    <!-- <div class="dashboard-text">roles: <span v-for="role in user.data.roles" :key="role">{{ role }}</span></div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'user'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
