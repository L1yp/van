<template>
  <ElTabs v-model="activePane">
    <el-tab-pane label="组件属性" name="component">
      <el-scrollbar :height="collapseScrollHeight" always>
        <el-collapse v-model="openedItems" style="padding: 0 6px">
          <el-collapse-item name="form-item" title="FormItem配置" v-show="vFormSelectElem?.category === 'form-item'">
            <el-form
              v-if="vFormSelectElem?.formItemAttrs"
              :model="vFormSelectElem?.formItemAttrs"
              label-position="left"
              label-width="120px"
              style="padding: 5px;"
            >
              <el-form-item prop="id" label="字段名">
                <el-input type="text" v-model="vFormSelectElem.id"></el-input>
              </el-form-item>
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
            <component :is="configMap[vFormSelectElem?.component]" />
            
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="表单属性" name="form">
      <div>
        <el-scrollbar :height="collapseScrollHeight" always>
          <el-collapse v-model="formOpenedItems" style="padding: 0 6px">
            <el-collapse-item name="component" title="组件配置" v-if="!!vFormSelectElem">
              
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
    </el-tab-pane>
  </ElTabs>
</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElTabs, ElTabPane, ElCollapse, ElRadioGroup, ElRadioButton,
  ElCollapseItem, ElForm, ElFormItem, ElInput,
} from 'element-plus'
import { computed, inject, markRaw, ref } from "vue";
import { vFormActiveElementKey } from "@/config/app.keys";
import NumberInputConfig from "@/components/form/designer/config/NumberInputConfig.vue";
import TextInputConfig from "@/components/form/designer/config/TextInputConfig.vue";
import TextAreaInputConfig from "@/components/form/designer/config/TextAreaInputConfig.vue";
import SingleSelectConfig from "@/components/form/designer/config/SingleSelectConfig.vue";
import MultiSelectConfig from "@/components/form/designer/config/MultiSelectConfig.vue";
import RowConfig from "@/components/form/designer/config/RowConfig.vue";
import ColConfig from "@/components/form/designer/config/ColConfig.vue";
import DateConfig from "@/components/form/designer/config/DateConfig.vue";
import DateRangeConfig from "@/components/form/designer/config/DateRangeConfig.vue";
import UserSelectorInputConfig from "@/components/form/designer/config/UserSelectorInputConfig.vue";
import DeptSelectorInputConfig from "@/components/form/designer/config/DeptSelectorInputConfig.vue";

interface Props {
  height: string
}

const props = defineProps<Props>()

const collapseScrollHeight = computed<string>(() => `calc(${props.height} - 15px)`)

const vFormSelectElem = inject(vFormActiveElementKey)

const activePane = ref<string>('component')
const openedItems = ref<string[]>(['form-item', 'component'])

const formOpenedItems = ref<string[]>([])

const configMap = {
  'date-picker': markRaw(DateConfig),
  'date-range-picker': markRaw(DateRangeConfig),
  'number-input': markRaw(NumberInputConfig),
  'text-input': markRaw(TextInputConfig),
  'text-area-input': markRaw(TextAreaInputConfig),
  'single-select': markRaw(SingleSelectConfig),
  'multi-select': markRaw(MultiSelectConfig),
  'user-select': markRaw(UserSelectorInputConfig),
  'dept-select': markRaw(DeptSelectorInputConfig),
  'el-row': markRaw(RowConfig),
  'el-col': markRaw(ColConfig),
}

</script>

<style scoped>
:deep(.el-tabs__content) {
  padding: 10px;
}

</style>