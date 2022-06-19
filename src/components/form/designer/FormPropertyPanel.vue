<template>
  <ElTabs v-model="activePane">
    <el-tab-pane label="组件属性" name="component">
      <el-scrollbar :height="collapseScrollHeight" always>
        <el-collapse v-model="openedItems" style="padding: 0 6px">
          <el-collapse-item name="form-item" title="FormItem配置">
            <el-form
              v-if="vFormSelectElem?.formItemAttrs"
              :model="vFormSelectElem?.formItemAttrs"
              label-position="left"
              label-width="120px"
              style="padding: 5px;"
            >
              <el-form-item prop="label" label="标签文本" required>
                <el-input v-model="vFormSelectElem.formItemAttrs.label"></el-input>
              </el-form-item>
              <el-form-item prop="labelWidth" label="标签宽度">
                <el-input v-model="vFormSelectElem.formItemAttrs.labelWidth"></el-input>
              </el-form-item>
              <el-form-item prop="required" label="是否必填">
                <el-radio-group v-model="vFormSelectElem.formItemAttrs.required">
                  <el-radio-button :label="true">是</el-radio-button>
                  <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="showMessage" label="显示错误信息">
                <el-radio-group v-model="vFormSelectElem.formItemAttrs.showMessage">
                  <el-radio-button :label="true">显示</el-radio-button>
                  <el-radio-button :label="false">隐藏</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="error" label="错误提示内容">
                <el-input v-model="vFormSelectElem.formItemAttrs.error"></el-input>
              </el-form-item>

              <el-form-item prop="inlineMessage" label="行内错误信息">
                <el-radio-group v-model="vFormSelectElem.formItemAttrs.inlineMessage">
                  <el-radio-button :label="true">显示</el-radio-button>
                  <el-radio-button :label="false">隐藏</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="size" label="大小">
                <el-radio-group v-model="vFormSelectElem.formItemAttrs.size">
                  <el-radio-button label="large">大</el-radio-button>
                  <el-radio-button label="default">默认</el-radio-button>
                  <el-radio-button label="small">小</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item name="component" title="组件配置">
            <input-config v-if="vFormSelectElem?.component === 'el-input'"></input-config>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="表单属性" name="form"></el-tab-pane>
  </ElTabs>
</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElTabs, ElTabPane, ElCollapse, ElRadioGroup, ElRadioButton,
  ElCollapseItem, ElForm, ElFormItem, ElInput,
} from 'element-plus'
import {computed, inject, ref} from "vue";
import {vFormActiveElementKey} from "@/config/app.keys";
import InputConfig from "@/components/form/designer/config/InputConfig.vue";

interface Props {
  height: string
}

const props = defineProps<Props>()

const collapseScrollHeight = computed<string>(() => `calc(${props.height} - 15px)`)

const vFormSelectElem = inject(vFormActiveElementKey)

const activePane = ref<string>('component')
const openedItems = ref<string[]>(['form-item', 'component'])

</script>

<style scoped>
:deep(.el-tabs__content) {
  padding: 10px;
}

</style>