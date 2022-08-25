<template>
  <div class="expression-panel-container">
    <!-- 字段列表 -->
    <div style="border: 1px solid #E3E3E3; ">
      <el-scrollbar height="300px" always>
        <el-radio-group v-model="selectedFieldId">
          <div>
            <div
              class="field-wrapper"
              v-for="field in props.fields"
              :key="field.id"
            >
              <el-radio
                :label="field.id"
                size="small"
              >
                {{field.description}}
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
          :key="item"
          :value="item"
          :label="item"
        ></el-option>
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
      <!-- 用户 -->
      <div v-show="[6, 7].includes(selectedField?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 254px">
          <el-scrollbar height="254px" always>
            <el-select v-model="exprUserModel.my_dept_scope" placeholder="请选择部门范围" style="width: 100%" clearable>
              <el-option label="我的部门的用户列表" :value="1"></el-option>
              <el-option label="我的下级部门的用户列表" :value="2"></el-option>
            </el-select>

            <div v-show="exprUserModel.user_of_dept.length === 0">
              <el-button :icon="plusIcon" circle @click="handleAddDeptOfUser"></el-button>
            </div>
            <div v-show="exprUserModel.user_of_dept.length > 0">
              <div
                v-for="(item, idx) in exprUserModel.user_of_dept"
                :key="item.id"
                style="display: flex"
              >
                <el-button :icon="plusIcon" circle @click="handleAddDeptOfUser"></el-button>
                <div style="flex: 1">
                  <dept-selector-input style="width: 50%" v-model="item.dept" :multiple="false" :clearable="false"/>
                  <el-select v-model="item.scope" placeholder="请选择部门范围"  style="width: 50%">
                    <el-option label="当前部门" :value="1"></el-option>
                    <el-option label="下级部门" :value="2"></el-option>
                  </el-select>
                </div>
                <el-button :icon="subIcon" circle @click="handleRemoveDeptOfUser(item)"></el-button>

              </div>
            </div>
          </el-scrollbar>
        </div>
        <div style="height: 32px; margin-top: 10px">
          <user-selector-input style="width: 100%" v-model="exprUserModel.users" multiple :clearable="false" />
        </div>
      </div>
      <!-- 部门 -->
      <div v-show="[9, 10].includes(selectedField?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 298px">
          <el-scrollbar height="298px" always>
            <el-select v-model="exprDeptModel.my_dept_scope" placeholder="请选择部门范围" clearable style="width: 100%">
              <el-option label="我的部门" :value="1"></el-option>
              <el-option label="下级部门" :value="2"></el-option>
            </el-select>

            <div v-show="exprDeptModel.user_of_dept.length === 0">
              <el-button :icon="plusIcon" circle @click="handleAddDept"></el-button>
            </div>
            <div v-show="exprDeptModel.user_of_dept.length > 0">
              <div
                v-for="(item, idx) in exprDeptModel.user_of_dept"
                :key="item.id"
                style="display: flex"
              >
                <el-button :icon="plusIcon" circle @click="handleAddDept"></el-button>
                <div style="flex: 1">
                  <dept-selector-input style="width: 50%" v-model="item.dept" :multiple="false" :clearable="false"/>
                  <el-select v-model="item.scope" placeholder="请选择部门范围"  style="width: 50%">
                    <el-option label="当前部门" :value="1"></el-option>
                    <el-option label="下级部门" :value="2"></el-option>
                  </el-select>
                </div>
                <el-button :icon="subIcon" circle @click="handleRemoveDept(item)"></el-button>

              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <!-- 文本 -->
      <div v-show="[1, 2].includes(selectedField?.component_type)">
        <div>
          <el-input v-model="exprStringModel.target"></el-input>
        </div>
      </div>
      <!-- 数字 -->
      <div v-show="[5].includes(selectedField?.component_type)">
        <div>
          <el-input v-model.number="exprNumberModel.target"></el-input>
        </div>
      </div>
      <!-- 字典 -->
      <div v-show="[3, 4].includes(selectedField?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 298px">
          <el-scrollbar height="298px" always>
            <template v-if="true || srcDictInfo?.type === 1">
              <el-checkbox-group v-model="exprDictModel.selected">
                <div>
                  <div
                    class="field-wrapper"
                    v-for="option in srcDictValues"
                  >
                    <el-checkbox :label="JSON.stringify(option)" size="small">{{option.label}}</el-checkbox>
                  </div>
                </div>
              </el-checkbox-group>
            </template>

            <template v-else>
              <el-tree
                :data="srcDictValues"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :props="{label: 'label', children: 'children'}"
              >
              <template #default="{ node, data }">
                <div style="display: flex; ">
                  <div>
                    <el-radio :name="srcDictInfo.ident" :label="data.id" v-model="dictSelected" size="small">&nbsp;</el-radio>
                  </div>
                  <div>{{ data.label }}</div>
                  <div>
                    <el-select v-model="data.scope" placeholder="请选择字典范围" size="small">
                      <el-option :key="1" label="当前节点" :value="1"></el-option>
                      <el-option :key="2" label="下级节点" :value="2"></el-option>
                    </el-select>
                  </div>
                </div>
              </template>
              </el-tree>
            </template>

          </el-scrollbar>
        </div>
      </div>


      <div v-show="[11].includes(selectedField?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 300px">
          <el-scrollbar height="300px" always>
            <el-radio-group v-model="exprDateModel.selected">
              <div>
                <div class="field-wrapper"><el-radio label="今天" size="small"></el-radio></div>
                <div class="field-wrapper"><el-radio label="本周" size="small"></el-radio></div>
                <div class="field-wrapper"><el-radio label="本月" size="small"></el-radio></div>
                <div class="field-wrapper"><el-radio label="本季度" size="small"></el-radio></div>
                <div class="field-wrapper"><el-radio label="本年" size="small"></el-radio></div>
              </div>

            </el-radio-group>
          </el-scrollbar>
        </div>
      </div>
    </div>

  </div>


</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElSelect, ElOption, ElRadioGroup, ElRadio, ElButton, ElInput,
  ElCheckboxGroup, ElCheckbox, ElMessage, ElTree
} from 'element-plus'
import { computed, inject, nextTick, onBeforeUpdate, ref, watch } from "vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import {dictInfosKey, dictValuesKey} from "@/config/app.keys";
import { useIcon } from "@/components/common/util";
import { 
  ExpressionDeptModel, ExpressionDictModel, ExpressionNumberModel, ExpressionStringModel, 
  ExpressionUserModel, ExpressionDateModel, DictOptionModel,
} from '../editor/components/ExpressionBlock';

interface Props {
  fields: ProcessFieldDefinition[]
  fieldId?: number
  operator?: string
  val?: string
}

interface Emits {
  (e: 'confirm', field: ProcessFieldDefinition, operator: string, val: any): void
  (e: 'cancel'): void
  (e: 'update:fieldId', fieldId: number): void
  (e: 'update:operator', operator: string): void
  (e: 'update:val', val: string): void
}

const plusIcon = useIcon('Plus')
const subIcon = useIcon('Subtract')


const dictSelected = ref<number>(0)

function handleAddDeptOfUser() {
  exprUserModel.value.user_of_dept.push({
    id: Math.random(),
    dept: null,
    scope: 1,
  })
}

function handleRemoveDeptOfUser(dept) {
  const idx = exprUserModel.value.user_of_dept.indexOf(dept)
  if (idx > -1) {
    exprUserModel.value.user_of_dept.splice(idx, 1)
  }
}


function handleAddDept() {
  exprDeptModel.value.user_of_dept.push({
    id: Math.random(),
    dept: null,
    scope: 1,
  })
}

function handleRemoveDept(dept) {
  const idx = exprDeptModel.value.user_of_dept.indexOf(dept)
  if (idx > -1) {
    exprUserModel.value.user_of_dept.splice(idx, 1)
  }
}


const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const selectedField = computed<ProcessFieldDefinition>(() => {
  if (!selectedFieldId.value) {
    return null
  } else {
    return props.fields.find(it => it.id === selectedFieldId.value)
  }
})

const operators = computed<string[]>(() => {
  const field = props.fields.find(it => it.id === selectedFieldId.value)
  let options: string[] = []
  if ([1, 2].includes(field?.component_type)) {
    options = ['=', 'LIKE', 'NOT LIKE']
  } else if ([5].includes(field?.component_type)) {
    options = ['=', '>', '<', '>=', '<=']
  } else if ([3, 4, 6, 7, 9, 10].includes(field?.component_type)) {
    options = ['=']
  } else if ([11].includes(field?.component_type)) {
    options = ['=']
  } else {
    options = ['=']
  }
  if (!options.includes(operator.value)) {
    nextTick(() => operator.value = options[0])
  }
  return options
})


const operator = computed<string>({
  get: () => {
    console.log('getter operator', props.operator)
    return props.operator
  },
  set: (v) => emits('update:operator', v)
})
const selectedFieldId = computed<number>({
  get: () => props.fieldId,
  set: v => {
    operator.value = undefined
    emits('update:fieldId', v)
  }
})



const exprStringModel = ref<ExpressionStringModel>({
  target: ''
})
const exprNumberModel = ref<ExpressionNumberModel>({
  target: undefined
})
const exprDictModel = ref<ExpressionDictModel>({
  selected: []
})
const exprUserModel = ref<ExpressionUserModel>({
  my_dept_scope: 1,
  users: [],
  user_of_dept: []
})
const exprDeptModel = ref<ExpressionDeptModel>({
  my_dept_scope: 1,
  user_of_dept: []
})
const exprDateModel = ref<ExpressionDateModel>({
  selected: undefined
})

/**
 * 设置数据状态
 */
function setState() {
  const type = selectedField.value?.component_type
  const data = JSON.parse(props.val)
  if ([1, 2].includes(type)) {
    exprStringModel.value = data
  } else if ([3, 4].includes(type)) {
    exprDictModel.value = data
  } else if ([5].includes(type)) {
    exprNumberModel.value = data
  } else if ([6, 7].includes(type)) {
    exprUserModel.value = data
  } else if ([9, 10].includes(type)) {
    exprDeptModel.value = data
  } else if ([11].includes(type)) {
    exprDateModel.value = data
  }
}

/**
 * 清除数据状态
 */
function purgeState() {
  exprStringModel.value = { target: '' }
  exprNumberModel.value = { target: undefined }
  exprDictModel.value = { selected: [] }
  exprUserModel.value = {
    my_dept_scope: 1,
    users: [],
    user_of_dept: []
  }
  exprDeptModel.value = {
    my_dept_scope: 1,
    user_of_dept: []
  }
  exprDateModel.value = { selected: undefined }
}

defineExpose({
  purgeState, setState
})

const dictInfos = inject(dictInfosKey)
const srcDictInfo = computed<DictInfo>(() => {
  if ([3, 4].includes(selectedField.value?.component_type)) {
    return dictInfos.value.find(it => it.ident === selectedField.value.dict_ident && it.scope === selectedField.value.dict_scope)
  } else {
    return null
  }
})



const dictValues = inject(dictValuesKey)
const srcDictValues = computed<DictOptionModel[]>(() => {
  if(srcDictInfo.value) {
    const list = dictValues.value.filter(it => it.ident == srcDictInfo.value.ident && it.scope == srcDictInfo.value.scope)
    if(true || srcDictInfo.value.type === 1) {
      return list.map(it => {
        return {
          id: it.id,
          pid: it.pid,
          label: it.label,
          scope: 1,
          value: it.id
        }
      })
    } else {
      const treeList: DictOptionModel[] = list.map(it => {
        return {
          id: it.id,
          pid: it.pid,
          label: it.label,
          scope: 1,
          value: it.id,
          children: []
        }
      })
      const map = new Map<number, DictOptionModel>(treeList.map(it => [it.id, it]))
      treeList.forEach(it => {
        if(map.has(it.pid)) {
          const parentItem = map.get(it.pid)
          if(!parentItem.children) {
            parentItem.children = []
          }
          parentItem.children.push(it)
        }
      })

      const root = treeList.filter(it => !it.pid)
      console.log('root', root, JSON.stringify(root));
      
      return root
    }
  } else {
    return []
  }
})


function handleConfirm() {
  const field = props.fields.find(it => it.id === selectedFieldId.value)
  if (!field || !operator.value) {
    ElMessage.warning(`请先选择字段 & 操作符`)
    return
  }

  if ([1, 2].includes(field.component_type)) {
    if(!exprStringModel.value.target) {
      ElMessage.error(`请输入字符串`)
      return
    }
    emits('confirm', field, operator.value, JSON.stringify(exprStringModel.value))
  } else if ([3, 4].includes(field.component_type)) {
    if(!exprDictModel.value.selected || exprDictModel.value.selected.length === 0) {
      ElMessage.error(`至少选择一项`)
      return
    }
    emits('confirm', field, operator.value, JSON.stringify(exprDictModel.value))
  } else if ([5].includes(field.component_type)) {
    if(!exprNumberModel.value.target) {
      ElMessage.error(`请输入一个值`)
      return
    }
    emits('confirm', field, operator.value, JSON.stringify(exprNumberModel.value))
  } else if ([6, 7].includes(field.component_type)) {
    emits('confirm', field, operator.value, JSON.stringify(exprUserModel.value))
  } else if ([9, 10].includes(field.component_type)) {
    emits('confirm', field, operator.value, JSON.stringify(exprDeptModel.value))
  } else if ([11].includes(field.component_type)) {
    emits('confirm', field, operator.value, JSON.stringify(exprDateModel.value))
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
  width: 120px;
  padding: 6px;
}

div.field-wrapper + div.field-wrapper {

}

:deep(.el-tree-node__content) {
  height: 40px;
}

</style>
