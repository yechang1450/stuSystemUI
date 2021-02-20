<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
    // Menu
  },
};
</script>

<style>
body {
  margin: 0;
}
#app {
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
</style>
