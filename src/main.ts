import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import router from "./router";
import store from "./store";
import "@/access/index";
import "bytemd/dist/index.css";
import "@/plugins/axios";

createApp(App)
  .use(ArcoVueIcon)
  .use(ArcoVue)
  .use(store)
  .use(router)
  .mount("#app");
