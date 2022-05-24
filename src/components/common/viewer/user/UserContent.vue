<template>
  <el-descriptions size="small" :column="1" border>
    <el-descriptions-item label="ID" label-align="left">
      <span v-text="user?.id"></span>
    </el-descriptions-item>
    <el-descriptions-item label="用户名" label-align="left">
      <span v-text="user?.username"></span>
    </el-descriptions-item>
    <el-descriptions-item label="昵称" label-align="left">
      <span v-text="user?.nickname"></span>
    </el-descriptions-item>
    <el-descriptions-item label="手机号" label-align="left">
      <span v-text="user?.phone"></span>
    </el-descriptions-item>
    <el-descriptions-item label="邮箱" label-align="left">
      <span v-text="user?.email"></span>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import { ElDescriptions, ElDescriptionsItem } from "element-plus"

export default defineComponent({
  components: { ElDescriptions, ElDescriptionsItem },
  props: {
    user: Object as PropType<UserView>
  },
})

</script>

<style scoped>

</style>