<template>
  <div class="form-container">
    <el-form v-bind="formAttr">
      <el-row v-for="(row, idx) in scheme" :key="idx" :gutter="10">
        <el-col v-for="col in row" :span="col.span">
          <el-form-item style="width: 100%" :label="col.label" v-bind="col.formItemAttrs">
            <template v-if="col">
              <template v-if="col.writeable">
                <component
                  :is="col.component"
                  v-bind="col.componentAttrs"
                  :modelValue="model[col.name]"
                  @update:modelValue="(val) => handleUpdateModel(col.name, val)"
                >
                </component>
              </template>
              <template v-else>
                <component
                  :is="col.component"
                  v-bind="col.componentAttrs"
                >
                </component>
              </template>

            </template>
            <template v-else>
              <div v-text="col.value"></div>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts">
import {ElRow, ElCol, ElInput, ElSelect, ElForm, ElFormItem, ElInputNumber } from "element-plus"
import {defineComponent, onBeforeUpdate, PropType, ref} from "vue"
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue"
import UserViewer from "@/components/common/viewer/user/UserViewer.vue";

interface ElFormProps extends Record<string, any> {

}

export default defineComponent({
  props: {
    formAttr: Object as PropType<ElFormProps>,
    scheme: Array as PropType<FormScheme[][]>,
    modelValue: Object as PropType<Record<string, any>>
  },
  emits: ['update:modelValue'],
  components: {
    ElRow, ElCol, ElInput, ElInputNumber, ElSelect, UserSelectorInput,
    ElForm, ElFormItem, UserViewer,
  },
  setup(props, { emit: emits }){

    const model = ref<Record<string, any>>(props.modelValue || {})
    // 需要更新model 否则modelValue类型不匹配(DictTag/DictInput)
    onBeforeUpdate(() => model.value = props.modelValue || {})

    function handleUpdateModel(name: string, val: any) {
      model.value[name] = val
      emits('update:modelValue', model.value)
    }

    return {
      props, model, handleUpdateModel
    }
  },
})
</script>

<style scoped>
.form-container {
  background-color: #FFFFFF;
}

.el-col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
}

/*:deep(.el-form-item__label) {*/
/*  border-top: 1px solid #ebeef5;*/
/*  border-bottom: 1px solid #ebeef5;*/
/*}*/

/*:deep(.el-form-item__content) {*/
/*  border-top: 1px solid #ebeef5;*/
/*  border-bottom: 1px solid #ebeef5;*/
/*}*/

:deep(.el-select) {
  width: 100%;
}

</style>
