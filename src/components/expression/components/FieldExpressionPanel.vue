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
      <div v-show="[6, 7].includes(selectedFiled?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 254px">
          <el-scrollbar height="254px" always>
            <el-select v-model="target" placeholder="请选择部门范围" style="width: 100%">
              <el-option label="我的部门的用户列表" value="本人部门"></el-option>
              <el-option label="我的下级部门的用户列表" value="下级部门"></el-option>
            </el-select>

            <div v-show="depts.length === 0">
              <el-button :icon="plusIcon" circle @click="handleAddDept"></el-button>
            </div>
            <div v-show="depts.length > 0">
              <div
                v-for="(dept, idx) in depts"
                :key="dept.id"
                style="display: flex"
              >
                <el-button :icon="plusIcon" circle @click="handleAddDept"></el-button>
                <div style="flex: 1">
                  <dept-selector-input style="width: 50%" v-model="depts[idx].view" :multiple="false" :clearable="false"/>
                  <el-select v-model="dept.scope" placeholder="请选择部门范围"  style="width: 50%">
                    <el-option label="当前部门" value="本人部门"></el-option>
                    <el-option label="下级部门" value="下级部门"></el-option>
                  </el-select>
                </div>
                <el-button :icon="subIcon" circle @click="handleRemoveDept(dept)"></el-button>

              </div>
            </div>
          </el-scrollbar>
        </div>
        <div style="height: 32px; margin-top: 10px">
          <user-selector-input style="width: 100%" v-model="users" multiple :clearable="false" />
        </div>
      </div>
      <!-- 部门 -->
      <div v-show="[9, 10].includes(selectedFiled?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 298px">
          <el-scrollbar height="298px" always>
            <el-select v-model="target" placeholder="请选择部门范围" style="width: 100%">
              <el-option label="我的部门" value="本人部门"></el-option>
              <el-option label="下级部门" value="下级部门"></el-option>
            </el-select>

            <div v-show="depts.length === 0">
              <el-button :icon="plusIcon" circle @click="handleAddDept"></el-button>
            </div>
            <div v-show="depts.length > 0">
              <div
                v-for="(dept, idx) in depts"
                :key="dept.id"
                style="display: flex"
              >
                <el-button :icon="plusIcon" circle @click="handleAddDept"></el-button>
                <div style="flex: 1">
                  <dept-selector-input style="width: 50%" v-model="depts[idx].view" :multiple="false" :clearable="false"/>
                  <el-select v-model="dept.scope" placeholder="请选择部门范围"  style="width: 50%">
                    <el-option label="当前部门" value="本人部门"></el-option>
                    <el-option label="下级部门" value="下级部门"></el-option>
                  </el-select>
                </div>
                <el-button :icon="subIcon" circle @click="handleRemoveDept(dept)"></el-button>

              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <!-- 文本 -->
      <div v-show="[1, 2, 5].includes(selectedFiled?.component_type)">
        <div>
          <el-input v-model="target"></el-input>
        </div>
      </div>
      <!-- 字典 -->
      <div v-show="[3, 4].includes(selectedFiled?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 298px">
          <el-scrollbar height="298px" always>
            <template v-if="srcDictInfo?.type === 1">
              <el-checkbox-group v-model="targetArr">
                <div>
                  <div
                    class="field-wrapper"
                    v-for="option in dictOptions"
                  >
                    <el-checkbox :label="option.id" size="small">{{option.label}}</el-checkbox>
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


      <div v-show="[11].includes(props.fields.find(it => it.id === selectedFieldId)?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 300px">
          <el-scrollbar height="300px" always>
            <el-radio-group v-model="target">
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
import {computed, inject, nextTick, ref, watch} from "vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import {dictInfosKey, dictValuesKey} from "@/config/app.keys";
import { useIcon } from "@/components/common/util";

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

interface SelectorWrapper<T> {
  id: string
  view: T
  scope: string
}

const dictSelected = ref<number>(0)
const users = ref<UserView[]>([])


const depts = ref<SelectorWrapper<DeptView>[]>([])
function handleAddDept() {
  depts.value.push({
    id: Math.random().toString(),
    view: null,
    scope: ''
  })
}

function handleRemoveDept(dept: SelectorWrapper<DeptView>) {
  const idx = depts.value.indexOf(dept)
  if (idx > -1) {
    depts.value.splice(idx, 1)
  }
}


const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const operators = computed<string[]>(() => {
  const field = props.fields.find(it => it.id === selectedFieldId.value)
  let options: string[] = []
  if ([1, 2].includes(field?.component_type)) {
    options = ['=', 'contains', 'startsWith', 'endsWith']
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
    target.value = undefined
    emits('update:fieldId', v)
  }
})

const selectedFiled = computed<ProcessFieldDefinition>(() => {
  if (!selectedFieldId.value) {
    return null
  } else {
    return props.fields.find(it => it.id === selectedFieldId.value)
  }
})

const dictInfos = inject(dictInfosKey)
const srcDictInfo = computed<DictInfo>(() => {
  if ([3, 4].includes(selectedFiled.value?.component_type)) {
    return dictInfos.value.find(it => it.ident === selectedFiled.value.dict_ident && it.scope === selectedFiled.value.dict_scope)
  } else {
    return null
  }
})

interface DictOptionModel {
  id: number
  pid: number
  label: string
  value: number
  scope: number
  children?: DictOptionModel[]
}

const dictValues = inject(dictValuesKey)
const srcDictValues = computed<DictOptionModel[]>(() => {
  if(srcDictInfo.value) {
    const list = dictValues.value.filter(it => it.ident == srcDictInfo.value.ident && it.scope == srcDictInfo.value.scope)
    if(srcDictInfo.value.type === 1) {
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

const target = computed<string>({
  get: () => {
    const field = props.fields.find(it => it.id === props.fieldId)
    // console.log('target getter field', field)
    if ([3, 4].includes(field?.component_type)) {
      return undefined
    } else {
      return props.val
    }
  },
  set: v => {
    // console.log('target setter', v)
    emits('update:val', v)
  }
})

const targetArr = computed<number[]>({
  get: () => {
    const field = props.fields.find(it => it.id === props.fieldId)
    // console.log('targetArr getter field', field)
    if ([3, 4].includes(field?.component_type)) {
      return props.val?.split(',').map(it => parseInt(it))
    } else {
      return []
    }
  },
  set: v => {
    // console.log('target arr setter', v)
    emits('update:val', v.join(','))
  }
})



const messageSource = inject(dictValuesKey);

const dictOptions = computed<DictValue[]>(() => {
  const ident = props.fields.find(it => it.id === selectedFieldId.value)?.dict_ident
  const scope = props.fields.find(it => it.id === selectedFieldId.value)?.dict_scope
  return messageSource.value.filter(it => it.scope === scope && it.ident === ident)
})




function handleConfirm() {
  const field = props.fields.find(it => it.id === selectedFieldId.value)
  if (!field || !operator.value) {
    ElMessage.warning(`请先选择字段 & 操作符`)
    return
  }

  if ([3, 4].includes(field.component_type)) {
    emits('confirm', field, operator.value, targetArr.value.join(','))
  } else {
    emits('confirm', field, operator.value, target.value)
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
