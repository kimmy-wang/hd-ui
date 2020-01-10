import Vue from "vue";
import HdUI from 'hd-ui';
import 'hd-ui/lib/theme-chalk/index.css';
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(HdUI);

new Vue({
  render: h => h(App)
}).$mount("#app");
