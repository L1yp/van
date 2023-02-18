<template>
  <div class="expression-panel-container">
    <!-- 字段列表 -->
    <div style="border: 1px solid #E3E3E3; width: 150px;">
      <el-scrollbar height="300px" always>
        <el-radio-group v-model="selectedFieldId">
          <div>
            <div
              class="field-wrapper"
              v-for="field in props.fields"
              :key="field.field"
            >
              <el-radio
                :label="field.field"
                size="small"
              >
                {{field.label}}
              </el-radio>
            </div>
          </div>

        </el-radio-group>
      </el-scrollbar>
    </div>
    <!-- 操作符 -->
    <div style="display: flex; flex-direction: column; justify-content: space-between; ">
      <el-select v-model="operator" style="width: 100px" :disabled="!selectedFieldId">
        <el-option
          v-for="item in operators"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <div>
        <div>
          <el-button
            type="primary"
            style="width: 100px"
            @click="handleConfirm"
            :disabled="!selectedFieldId || !operator"
          >
            确定
          </el-button>
        </div>
        <div style="margin-top: 6px">
          <el-button style="width: 100px" @click="emits('cancel')">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 右值 -->
    <div style="flex: 1; height: 300px">
      <template v-if="!!selectedField">
        <!-- 用户 -->
        <div v-show="['user'].includes(selectedField.type)">
          <UserConditionPanel v-model="userConditionModel" />
        </div>
        <!-- 部门 -->
        <div v-show="['dept'].includes(selectedField.type)">
          <DeptConditionPanel v-model="deptConditionModel" />
        </div>

        <!-- 文本 -->
        <div v-show="['text'].includes(selectedField.type)">
          <el-input v-model="strConditionModel.text"></el-input>
        </div>

        <!-- 字典 -->
        <div v-show="['option'].includes(selectedField.type)">
          <OptionConditionPanel v-model="optionConditionModel.option_value_id_list" :options="selectedField.scheme.options || []" />
        </div>

        <!-- 时间 -->
        <div v-show="'date' === selectedField?.type">
          <DateConditionPanel v-model="dateConditionModel" />
        </div>

        <div v-show="'number' === selectedField?.type">
          <el-input-number v-model="numberConditionModel.number" :controls="false"></el-input-number>
        </div>

      </template>

    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElSelect, ElOption, ElRadioGroup, ElRadio, ElButton, ElInput,
  ElMessage, ElInputNumber,
} from 'element-plus'
import { computed, nextTick, ref, toRaw } from "vue";
import UserConditionPanel from './condition/UserConditionPanel.vue';
import DeptConditionPanel from './condition/DeptConditionPanel.vue';
import OptionConditionPanel from './condition/OptionConditionPanel.vue';
import DateConditionPanel from './condition/DateConditionPanel.vue';
import {NumberConditionModel} from "@/components/permission/components/condition";

interface Props {
  fields: ModelingFieldDefView[]
  state: BlockExpressionModel
}

interface Emits {
  (e: 'confirm', field: ModelingFieldDefView, operator: ConditionOperator, val: FieldConditionUnionModel): void
  (e: 'cancel'): void
  (e: 'update:state', state: BlockExpressionModel): void
}


const emits = defineEmits<Emits>()
const props = defineProps<Props>()



const selectedField = computed<ModelingFieldDefView>(() => {
  if (!selectedFieldId.value) {
    return null
  } else {
    return props.fields?.find(it => it.field === selectedFieldId.value) || null
  }
})

type Operator = {
  label: string
  value: ConditionOperator
}

const operators = computed<Operator[]>(() => {
  const field = props.fields?.find(it => it.field === selectedFieldId.value)
  let options: Operator[] = []
  if (['text'].includes(field?.type)) {
    options = [
      { label: '=', value: 'EQ' },
      { label: 'like', value: 'LIKE' },
      { label: 'not like', value: 'NOT_LIKE' },
    ]
  }
  else if (['number'].includes(field?.type)) {
    options = [
      { label: '=', value: 'EQ' },
      { label: '>=', value: 'GTE' },
      { label: '<=', value: 'LTE' },
      { label: '<', value: 'LT' },
      { label: '>', value: 'GT' },
    ]
  }

  else {
    options = [ { label: '=', value: 'EQ' } ]
  }
  if (!options.map(it => it.value).includes(operator.value)) {
    nextTick(() => operator.value = options[0].value)
  }
  return options
})

const operator = ref<ConditionOperator>(props.state.operator)
const fieldId = ref<string>(props.state.field)
const selectedFieldId = computed<string>({
  get: () => fieldId.value,
  set: v => {
    operator.value = 'EQ'
    purgeState()
    fieldId.value = v
  }
})

const userConditionModel = ref<UserFieldConditionModel>({
  type: 'user',
  user_id_list: [],
  dept_id: '',
  cascader: false,
})

const deptConditionModel = ref<DeptFieldConditionModel>({
  type: 'dept',
  dept_id: '',
  cascader: false,
})

const strConditionModel = ref<TextFieldConditionModel>({
  type: 'text',
  text: ''
})

const optionConditionModel = ref<OptionFieldConditionModel>({
  type: 'option',
  option_value_id_list: [],
})

const dateConditionModel = ref<DateFieldConditionModel>({
  type: 'date',
  data_type: 'FIXED',
  range: ''
})

const numberConditionModel = ref<NumberFieldConditionModel>({
  type: 'number',
  number: 0
})

/**
 * 设置数据状态
 */
function setState() {
  fieldId.value = props.state.field
  const type = selectedField.value?.type as string
  operator.value = props.state.operator

  const data = props.state.value
  console.log('update panel setState type val', type, data);

  if (['text'].includes(type)) {
    strConditionModel.value = data as TextFieldConditionModel
  } else if (['option'].includes(type)) {
    optionConditionModel.value = data as OptionFieldConditionModel
  }else if (['user'].includes(type)) {
    userConditionModel.value = data as UserFieldConditionModel
  } else if (['dept'].includes(type)) {
    deptConditionModel.value = data as DeptFieldConditionModel
  } else if (['date'].includes(type)) {
    dateConditionModel.value = data as DateFieldConditionModel
  } else if (['number'].includes(type)) {
    dateConditionModel.value = data as DateFieldConditionModel
  }
}

/**
 * 清除数据状态
 */
function purgeState() {
  fieldId.value = ''

  strConditionModel.value = { type: 'text', text: '' }
  optionConditionModel.value = { type: 'option', option_value_id_list: [] }
  userConditionModel.value = {
    type: 'user',
    user_id_list: [],
    dept_id: '',
    cascader: false,
  }
  deptConditionModel.value = {
    type: 'dept',
    dept_id: '',
    cascader: false,
  }
  dateConditionModel.value = { type: 'date', data_type: 'DAY' }
}

defineExpose({
  purgeState, setState
})




function handleConfirm() {
  const field = props.fields.find(it => it.field === selectedFieldId.value)
  if (!field || !operator.value) {
    ElMessage.warning(`请先选择字段 & 操作符`)
    return
  }

  console.log('confirm', 11)
  if (['text'].includes(field.type)) {
    if(!strConditionModel.value.text) {
      ElMessage.error(`请输入字符串`)
      return
    }
    const state: BlockExpressionModel = {
      field: toRaw(field).field,
      operator: toRaw(operator.value),
      value: strConditionModel.value
    }
    emits('update:state', state)
    emits('confirm', field, operator.value, strConditionModel.value)
  } else if (['option'].includes(field.type)) {
    if(!optionConditionModel.value.option_value_id_list?.length) {
      ElMessage.error(`至少选择一项`)
      return
    }
    const state: BlockExpressionModel = {
      field: toRaw(field).field,
      operator: toRaw(operator.value),
      value: optionConditionModel.value
    }
    emits('update:state', state)
    emits('confirm', field, operator.value, optionConditionModel.value)
  } else if (['user'].includes(field.type)) {
    if (!userConditionModel.value.user_id_list?.length && !userConditionModel.value.dept_id) {
      ElMessage.error(`请选择一个用户或部门`)
      return
    }
    const state: BlockExpressionModel = {
      field: toRaw(field).field,
      operator: toRaw(operator.value),
      value: userConditionModel.value
    }
    emits('update:state', state)
    emits('confirm', field, operator.value, userConditionModel.value)
  } else if (['dept'].includes(field.type)) {
    if (!deptConditionModel.value.dept_id) {
      ElMessage.error(`请选择部门`)
      return
    }
    const state: BlockExpressionModel = {
      field: field.field,
      operator: toRaw(operator.value),
      value: deptConditionModel.value
    }
    emits('update:state', state)
    emits('confirm', field, operator.value, deptConditionModel.value)
  } else if (['date'].includes(field.type)) {
    if (!dateConditionModel.value.type) {
      ElMessage.error(`请选择一个日期范围`)
      return
    }
    const state: BlockExpressionModel = {
      field: toRaw(field).field,
      operator: toRaw(operator.value),
      value: dateConditionModel.value
    }
    emits('update:state', state)
    emits('confirm', field, operator.value, dateConditionModel.value)
  }
}

</script>

<style scoped>
.expression-panel-container {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.field-wrapper {
  width: 100%;
  padding: 6px;
}

:deep(.el-tree-node__content) {
  height: 40px;
}

</style>
