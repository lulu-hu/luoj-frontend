<template>
  <div id="userLayout">
    <a-layout style="height: 100%">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/OIP-C.jpg" class="logo" />
          <div>虂 OJ</div>
        </a-space>
      </a-layout-header>
      <a-layout-content style="height: 600px" class="content">
        <UserLoginView />
      </a-layout-content>
      <a-layout-footer class="footer">Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0% 0% / 100% 100%;
}

#userLayout .logo {
  width: 64px;
  height: 64px;
}

#userLayout .header {
  margin-top: 16px;
  margin-bottom: 110px;
}

#userLayout .content {
  margin-bottom: 264px;
  padding: 20px;
}

#userLayout .footer {
  padding: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script>
import { defineComponent } from "vue";
import UserLoginView from "@/views/user/UserLoginView.vue";

export default defineComponent({
  components: { UserLoginView },
});
</script>
