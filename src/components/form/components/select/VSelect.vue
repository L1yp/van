<template>
  <el-select v-model="selectModel" @change="handleSelectChanged" :value-key="valueField" v-bind="selectAttrs">
    <el-option
      v-for="item in options"
      :key="item[keyField]"
      :label="item[labelField]"
      :value="item[valueField]"
    >

    </el-option>
  </el-select>
</template>

<script lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import {defineComponent, ref} from "vue";
import {VSelectProps} from "@/components/form/components/select/util";



export default defineComponent({
  components: {
    ElSelect, ElOption
  },
  props: VSelectProps,
  emits: [ 'update:modelValue' ],
  setup(props, { emit }) {

    const selectModel = ref(props.modelValue || null)

    function handleSelectChanged() {
      emit('update:modelValue', selectModel.value)
    }


    return {
      selectModel, handleSelectChanged
    }

  }
})
</script>

<style scoped>

</style>