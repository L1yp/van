<template>
  <template v-if="Array.isArray(data) && data.length > 0">
    <el-popover
      v-for="user in data"
      trigger="click"
      width="200px"
    >
      <template #reference>
        <span class="user-trigger" v-text="user?.nickname"></span>
      </template>
      <UserContent :user="user"></UserContent>
    </el-popover>

  </template>
  <template v-else-if="!Array.isArray(data)">
    <el-popover
      trigger="click"
      width="200px"
    >
      <template #reference>
        <div class="user-trigger" v-text="data?.nickname"></div>
      </template>
      <UserContent :user="data"></UserContent>
    </el-popover>
  </template>

</template>

<script lang="ts">
import { ElPopover } from "element-plus";
import {defineComponent, PropType} from "vue";
import UserContent from "@/components/common/viewer/user/UserContent.vue";


export default defineComponent({
  components: {UserContent, ElPopover },
  props: {
    data: [Object, Array] as PropType<UserView | UserView[]>
  },

  setup(props) {



    return {

    }
  }
})
</script>

<style scoped>
.user-trigger {
  cursor: pointer;
  text-decoration: underline;
}
.user-trigger + .user-trigger {
  margin-left: 6px;
}
</style>