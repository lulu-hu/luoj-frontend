<template>
  <div id="userRegisterView">
    <h2 style="margin-bottom: 16px">用户注册</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      auto-label-width
      label-align="left"
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 4, message: '账号长度不能少于4位' },
        ]"
        label="账号"
      >
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item
        field="userPassword"
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 8, message: '密码不能少于8位' },
        ]"
        tooltip="密码不少于8位"
        label="密码"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
          :invisible-button="false"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        field="checkPassword"
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 8, message: '密码不能少于8位' },
        ]"
        tooltip="密码不少于8位"
        label="密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="再次输入密码"
          :invisible-button="false"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button
          style="
            width: 120px;
            margin-left: 150px;
            background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
          "
          html-type="submit"
          >注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Message } from "@arco-design/web-vue";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});

const router = useRouter();
const store = useStore();

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (form.userAccount?.length < 4 || form.userPassword?.length < 8) {
    return;
  }

  if (
    form.userPassword.length !== form.checkPassword.length ||
    form.userPassword !== form.checkPassword
  ) {
    Message.error("两次密码输入不一致");
    return;
  }

  const res = await UserControllerService.userRegisterUsingPost(form);
  // 注册成功
  if (res.code === 0) {
    Message.success("注册成功");
    await router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("注册失败，" + res.message);
  }
};
</script>
