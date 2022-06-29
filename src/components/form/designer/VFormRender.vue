<template>
  <el-form>
    <v-form-nested-item
      v-for="item in props.schemes"
      :item="item"
      :key="item.id"
    ></v-form-nested-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElForm } from 'element-plus'
import { ComponentConfig } from "@/components/form/types";
import {ref} from "vue";
import VFormNestedItem from "@/components/form/designer/VFormNestedItem.vue";


interface Props {
  schemes: ComponentConfig[]
}

const props = defineProps<Props>()

const formData = ref({})

</script>

<style scoped>

</style>