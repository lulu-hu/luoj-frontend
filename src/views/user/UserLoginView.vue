<template>
  <div id="userLoginView">
    <h2 style="margin-bottom: 16px">用户登录</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      auto-label-width
      label-align="left"
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
          :invisible-button="false"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="verifyCode" label="验证码">
        <a-input
          v-model="form.verifyCode"
          placeholder="请输入验证码"
          :invisible-button="false"
          allow-clear
        />
        <img :src="captchaImage" alt="验证码" />
      </a-form-item>
      <a-form-item>
        <a-button
          style="
            width: 120px;
            margin-left: 50px;
            margin-right: 100px;
            background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
          "
          html-type="submit"
          >登录
        </a-button>

        <a-button
          style="
            width: 120px;
            background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
          "
          href="/user/register"
          >注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  verifyCode: "",
  verifyCodeKey: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();
const captchaImage = ref("");

/**
 * 获取验证码
 */
const fetchCaptcha = async () => {
  try {
    const response =
      await UserControllerService.generateVerificationCodeUsingPost();
    if (response.code === 0) {
      const data = response.data;
      // 确保 base64String 的格式正确
      let base64String = data.base64String;
      if (!base64String.startsWith("data:image/")) {
        // 如果没有正确的前缀，添加前缀
        base64String = `data:image/png;base64,${base64String}`;
      }
      captchaImage.value = base64String; // 显示验证码图片
      form.verifyCodeKey = data.verifyCodeKey; // 保存验证码的key
    } else {
      message.error("获取验证码失败");
    }
  } catch (error) {
    console.error("Error fetching captcha:", error);
    message.error("获取验证码失败");
  }
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  // 登录成功
  if (res.code === 0) {
    localStorage.setItem("Authorization", res?.data?.token);
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
    message.success("登录成功");
  } else {
    message.error("登录失败，" + res.message);
  }
};

onMounted(() => {
  // 页面加载时初始化验证码
  fetchCaptcha();
});
</script>
