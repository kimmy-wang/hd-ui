<template>
  <div id="app">
    <hello title="hello hd ui ts" />
    <i class="hd-ui-icon-code"></i>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "app"
});
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

i {
  font-size: 26px;
  color: red;
}
</style>
