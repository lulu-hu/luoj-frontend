<template>
  <div id="globalHeader">
    <a-menu mode="horizontal" :default-selected-keys="['1']">
      <a-menu-item
        key="0"
        :style="{ padding: 0, marginRight: '38px' }"
        disabled
      >
        <div class="title-bar">
          <img class="logo" src="../assets/OIP-C.jpg" />
          <div class="title">虂 OJ</div>
        </div>
      </a-menu-item>
      <a-menu-item v-for="item in routes" :key="item.path">{{
        item.name
      }}</a-menu-item>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
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
</style>
