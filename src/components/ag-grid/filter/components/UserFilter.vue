<template>
  <user-selector-input v-bind="props.params.componentProps" v-model="selected" @change="handleValueChange"   />
</template>

<script lang="ts" setup>
import { IHeaderGroupParams } from "ag-grid-community";
import {ref} from "vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";

interface HeaderFilterComponentParam extends IHeaderGroupParams {
  initValue: string
  onChange: (v: string) => void
  componentProps: Record<string, any>
}

interface Props {
  params: HeaderFilterComponentParam
}

const props = defineProps<Props>()

const selected = ref(props.params.initValue)
function handleValueChange(v: string) {
  props.params.onChange(v)
}

</script>