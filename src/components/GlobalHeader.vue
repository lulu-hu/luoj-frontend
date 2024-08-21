<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        :default-selected-keys="['1']"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/OIP-C.jpg" />
            <div class="title">小鹿 OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path"
          >{{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <a-dropdown>
        <a-avatar class="AvatarHover" v-if="store.state.user.loginUser.id">
          {{ store.state.user.loginUser.userName ?? "无名" }}
        </a-avatar>
        <a-avatar class="AvatarHover" v-else> 未登录</a-avatar>
        <template #content>
          <a-doption v-if="!store.state.user.loginUser.id">
            <template #icon>
              <icon-user />
            </template>
            <template #default>
              <a-anchor-link @click="Login"> 登录</a-anchor-link>
            </template>
          </a-doption>
          <a-doption v-if="store.state.user.loginUser.id">
            <template #icon>
              <icon-poweroff />
            </template>
            <template #default>
              <a-anchor-link @click="Layout"> 退出登录</a-anchor-link>
            </template>
          </a-doption>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import accessEnum from "@/access/accessEnum";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService } from "../../generated";

const router = useRouter();
const store = useStore();

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "lulu",
//     // userRole: accessEnum.ADMIN,
//   });
// }, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

/**
 *  登录
 * @param key
 */
const Login = async () => {
  router.push({
    path: "/user/login",
    replace: true,
  });
};

/**
 *  退出登录
 * @param key
 */
const Layout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  localStorage.removeItem("Authorization");
  if (res.code === 0) {
    message.success("退出成功");
    router.push({
      path: "/",
      replace: true,
    });
    location.reload();
  } else {
    message.error("退出失败");
  }
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 50px;
}

.AvatarHover {
  cursor: pointer;
}
</style>
