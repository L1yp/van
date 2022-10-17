<template>
  <el-form :model="formData">
    <v-form-nested-item
      v-for="item in props.schemes"
      :item="item"
      :key="item.id"
    ></v-form-nested-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElForm } from 'element-plus'
import {ComponentConfig, FormFieldMode} from "@/components/form/types";
import {computed, provide, ref} from "vue";
import VFormNestedItem from "@/components/form/designer/VFormNestedItem.vue";
import {formModeKey} from "@/components/form/state.key";


interface Props {
  schemes: ComponentConfig[]
  mode: FormFieldMode
}

const props = defineProps<Props>()

const mode = computed<FormFieldMode>(() => props.mode)
provide(formModeKey, mode)


const formData = ref({})

</script>

<style scoped>

</style>