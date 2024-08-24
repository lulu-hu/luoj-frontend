<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 3, lg: 4 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig?.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig?.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig?.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="gold"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="content" title="历史提交">
            <a-list
              :data="dataList"
              :pagination-props="{
                showTotal: true,
                pageSize: searchParams.pageSize,
                current: searchParams.current,
                total,
              }"
              @page-change="onPageChange"
            >
              <a-collapse v-for="(item, index) in dataList" :key="index">
                <a-collapse-item
                  :header="`${item?.questionId || '无内容'} - 创建时间 ${
                    item?.createTime || '无时间'
                  }`"
                  key="index"
                >
                  <div>{{ item?.code }}</div>
                </a-collapse-item>
              </a-collapse>
            </a-list>
          </a-tab-pane>
          <a-tab-pane key="answer" title="答案"> 答案</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 280px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="选择编程语言"
              allow-search
            >
              <a-option>java</a-option>
              <a-option>python</a-option>
              <a-option>golang</a-option>
              <a-option>cpp</a-option>
              <a-option>javascript</a-option>
              <a-option>php</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-button
          type="primary"
          style="min-width: 200px; margin-top: 20px"
          @click="doSubmit"
          >提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, withDefaults, watchEffect } from "vue";
import {
  QuestionControllerService,
  type QuestionSubmitAddRequest,
  QuestionSubmitQueryRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import { useRouter } from "vue-router";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const router = useRouter();
const dataList = ref([]);
const total = ref(0);

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  console.log("res1", res);
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败." + res.message);
  }
};

const listData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败." + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value?.id,
  });
  if (res.code === 0) {
    router.push({
      path: `/`,
    });
    message.success("提交成功");
  } else {
    message.error("提交失败，" + res.message);
  }
};

/**
 *  页面加载时，请求数据
 */
onMounted(() => {
  loadData();
  listData();
});

/**
 *  监听 searchParams 变量, 改变时出发页面的重新加载
 */
watchEffect(() => {
  loadData();
  listData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>
<style>
#viewQuestionView {
  max-width: 1440px;
  margin: 0 auto;
}
</style>
