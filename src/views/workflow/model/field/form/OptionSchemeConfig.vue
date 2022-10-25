<template>
  <el-form-item :prop="['scheme', 'component']" label="组件类型" required>
    <el-select v-model="props.formData.scheme.component" :disabled="props.disabled" style="width: 100%;" @change="handleComponentChange">
      <el-option label="单选框" value="radio" />
      <el-option label="单选按钮" value="radio-button" />
      <el-option label="多选框" value="checkbox" />
      <el-option label="多选按钮" value="checkbox-button" />
      <el-option label="级联单选框" value="single-cascader" />
      <el-option label="级联多选框" value="multi-cascader" />
      <el-option label="下拉单选框" value="single-select" />
      <el-option label="下拉多选框" value="multi-select" />
    </el-select>
  </el-form-item>
  <el-form-item :prop="['scheme', 'optionContent', 'from']" label="数据来源">
    <el-radio-group v-model="props.formData.scheme.optionContent.from" :disabled="props.disabled">
      <el-radio-button label="DEFAULT">默认</el-radio-button>
      <el-radio-button label="CLASS">Java类</el-radio-button>
      <el-radio-button label="TABLE">指定表</el-radio-button>
    </el-radio-group>
  </el-form-item>

  <template v-if="props.formData.scheme.optionContent.from === 'DEFAULT'">
    <el-form-item :prop="['scheme', 'optionContent', 'optionTypeId']" label="数据源" required>
      <el-select 
        v-model="props.formData.scheme.optionContent.optionTypeId" 
        @change="v => findWorkflowOptionValues({typeId: v})"
        :disabled="props.disabled"
        style="width: 100%;"
      >
        <el-option 
          v-for="type in workflowOptionTypes" 
          :key="type.id" :label="type.name" 
          :value="type.id" 
        />
      </el-select>
    </el-form-item>
    <el-form-item :prop="['scheme', 'optionContent', 'defaultValue']" label="默认值">
      <el-tree-select
        :key="defValKey"
        v-model="props.formData.scheme.optionContent.defaultValue"
        filterable clearable fit-input-width
        :loading="loading"
        node-key="id"
        check-strictly
        default-expand-all
        :disabled="props.disabled"
        multiple
        :multiple-limit="props.formData.scheme.component?.startsWith('checkbox') || props.formData.scheme.component?.startsWith('multi') ? 0 : 1"
        :props="{ label: 'name', children: 'children', disabled: 'disabled' }"
        :data="workflowOptionValues"
        style="width: 100%;"
      />
    </el-form-item>
  </template>
  <template v-if="props.formData.scheme.optionContent.from === 'CLASS'">
    <el-form-item :prop="['scheme', 'className']" label="类名" required>
      <el-input v-model="props.formData.scheme.optionContent.className" :disabled="props.disabled" />
    </el-form-item>
    <el-form-item :prop="['scheme', 'fromTable']" label="数据来源" required>
      <el-select 
        v-model="props.formData.scheme.optionContent.fromTable" 
        allow-create 
        filterable 
        default-first-option 
        clearable
        :disabled="props.disabled"
        style="width: 100%"
      >
        <el-option label="默认" value="DEFAULT" />
        <el-option label="外部" value="EXTERNAL" />
      </el-select>
    </el-form-item>
  </template>

  <template v-if="props.formData.scheme.optionContent.from === 'TABLE'">
    <el-form-item :prop="['scheme', 'optionContent', 'tableName']" label="表名" required>
      <el-select 
        v-model="props.formData.scheme.optionContent.tableName"
        fit-input-width
        :disabled="props.disabled"
        @change="v => getTableColumns(v)"
        style="width: 100%;"
      >
        <el-option v-for="table in tables" :key="table.name" :value="table.name" :label='table.name'>
          <div style="display: flex; justify-content: space-between;">
            <div v-text="table.name"></div>
            <div v-text="table.comment"></div>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :prop="['scheme', 'optionContent', 'labelField']" label="标签字段" required>
      <el-select 
        v-model="props.formData.scheme.optionContent.labelField"
        fit-input-width
        :disabled="props.disabled"
        style="width: 100%;"
      >
        <el-option v-for="column in columns" :key="column.name" :value="column.name" :label='column.name'>
          <div style="display: flex; justify-content: space-between;">
            <div v-text="column.name"></div>
            <div v-text="column.comment"></div>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :prop="['scheme', 'optionContent', 'valueField']" label="值字段" required>
      <el-select 
        v-model="props.formData.scheme.optionContent.valueField"
        fit-input-width
        :disabled="props.disabled"
        style="width: 100%;"
      >
        <el-option v-for="column in columns" :key="column.name" :value="column.name" :label='column.name'>
          <div style="display: flex; justify-content: space-between;">
            <div v-text="column.name"></div>
            <div v-text="column.comment"></div>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :prop="['scheme', 'optionContent', 'parentField']" label="父级字段" required>
      <el-select 
        v-model="props.formData.scheme.optionContent.parentField"
        fit-input-width
        :disabled="props.disabled"
        style="width: 100%;"
      >
        <el-option v-for="column in columns" :key="column.name" :value="column.name" :label='column.name'>
          <div style="display: flex; justify-content: space-between;">
            <div v-text="column.name"></div>
            <div v-text="column.comment"></div>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :prop="['scheme', 'optionContent', 'disabledField']" label="禁用字段" required>
      <el-select 
        v-model="props.formData.scheme.optionContent.disabledField"
        fit-input-width 
        :disabled="props.disabled"
        style="width: 100%;"
      >
        <el-option v-for="column in columns" :key="column.name" :value="column.name" :label='column.name'>
          <div style="display: flex; justify-content: space-between;">
            <div v-text="column.name"></div>
            <div v-text="column.comment"></div>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :prop="['scheme', 'optionContent', 'disabledValue']" label="禁用值" required>
      <el-input v-model="props.formData.scheme.optionContent.disabledValue" :disabled="props.disabled" />
    </el-form-item>
    <el-form-item :prop="['scheme', 'optionContent', 'condition']" label="过滤条件" required>
      <el-input v-model="props.formData.scheme.optionContent.condition" :disabled="props.disabled" />
    </el-form-item>
  </template>

</template>
<script lang="ts" setup>
import { useTableScheme } from "@/service/workflow/field";
import { useWorkflowOptionApi } from "@/service/workflow/option";
import { ElFormItem, ElInput, ElRadioGroup, ElRadioButton, ElSelect, ElOption, ElTreeSelect } from "element-plus";
import { onBeforeMount, ref } from "vue";

interface Props {
  disabled?: boolean
  formData: WorkflowFieldAddParam
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const loading = ref(false)
const { 
  workflowOptionTypes, findWorkflowOptionTypes, 
  workflowOptionValues, findWorkflowOptionValues 
} = useWorkflowOptionApi(loading)

const { tables, getTables, columns, getTableColumns } = useTableScheme(loading)

onBeforeMount(() => findWorkflowOptionTypes({ scope: 'GLOBAL' }))
onBeforeMount(getTables)

// 切换单选多选时 需要重载 select / tree-select组件， 否则会异常
const defValKey = ref(0)

function handleComponentChange() {
  defValKey.value++;
  props.formData.scheme.optionContent.defaultValue = []
}

</script>
<style scoped></style>