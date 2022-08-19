<template>
  <div class="expression-panel-container">
    <!-- 字段列表 -->
    <div>
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
    <div style="display: flex; flex-direction: column; justify-content: space-between">
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
            @click="emits('confirm')"
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
      <div v-show="[6, 7].includes(props.fields.find(it => it.id === selectedFieldId)?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 160px">
          <el-scrollbar height="160px" always>
            <el-radio-group v-model="userFieldEqToDptVal">
              <div>
                <div class="field-wrapper"><el-radio :label="1" size="small">本人</el-radio></div>
                <div class="field-wrapper"><el-radio :label="2" size="small">本人部门</el-radio></div>
                <div class="field-wrapper"><el-radio :label="3" size="small">下级部门</el-radio></div>
                <div class="field-wrapper"><el-radio :label="4" size="small">所有部门</el-radio></div>
              </div>

            </el-radio-group>
          </el-scrollbar>
        </div>
        <div  style="border: 1px solid #E3E3E3; height: 126px; margin-top: 10px">
          <user-selector-input style="width: 100%" v-model="userFieldEqToUserVal" multiple :clearable="false" />
        </div>
      </div>
      <!-- 部门 -->
      <div v-show="[9, 10].includes(props.fields.find(it => it.id === selectedFieldId)?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 298px">
          <el-scrollbar height="298px" always>
            <el-radio-group v-model="dptFieldEqToVal">
              <div>
                <div class="field-wrapper"><el-radio :label="1" size="small">上级部门</el-radio></div>
                <div class="field-wrapper"><el-radio :label="2" size="small">本人部门</el-radio></div>
                <div class="field-wrapper"><el-radio :label="3" size="small">下级部门</el-radio></div>
                <div class="field-wrapper"><el-radio :label="4" size="small">所有部门</el-radio></div>
              </div>

            </el-radio-group>
          </el-scrollbar>
        </div>
      </div>

      <!-- 文本 -->
      <div v-show="[1, 2, 5].includes(props.fields.find(it => it.id === selectedFieldId)?.component_type)">
        <div>
          <el-input v-model="textFieldEqToVal"></el-input>
        </div>
      </div>
      <div v-show="[3, 4].includes(props.fields.find(it => it.id === selectedFieldId)?.component_type)">
        <div style="border: 1px solid #E3E3E3; height: 298px">
          <el-scrollbar height="298px" always>
            <el-checkbox-group v-model="dictFieldEqToVal">
              <div>
                <div
                  class="field-wrapper"
                  v-for="option in dictOptions"
                >
                  <el-checkbox :label="option.id" size="small">{{option.label}}</el-checkbox>
                </div>
              </div>

            </el-checkbox-group>
          </el-scrollbar>
        </div>
      </div>
    </div>

  </div>


</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElSelect, ElOption, ElRadioGroup, ElRadio, ElButton, ElInput,
  ElCheckboxGroup, ElCheckbox
} from 'element-plus'
import {computed, inject, nextTick, ref, watch} from "vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import {dictValuesKey} from "@/config/app.keys";

interface Props {
  fields: ProcessFieldDefinition[]
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const emits = defineEmits<Emits>()

const props = defineProps<Props>()
const selectedFieldId = ref<number>()

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
    options = ['IN']
  } else {
    options = ['=']
  }
  nextTick(() => operator.value = options[0])
  return options
})

watch(selectedFieldId, () => operator.value = undefined)

const operator = ref<string>()

const userFieldEqToDptVal = ref<number>()
const userFieldEqToUserVal = ref<number[]>()

const dptFieldEqToVal = ref<number>()

const textFieldEqToVal = ref<string>('')

const dictFieldEqToVal = ref<number[]>([])

const messageSource = inject(dictValuesKey);

const dictOptions = computed<DictValue[]>(() => {
  const ident = props.fields.find(it => it.id === selectedFieldId.value)?.dict_ident
  const scope = props.fields.find(it => it.id === selectedFieldId.value)?.dict_scope
  return messageSource.value.filter(it => it.scope === scope && it.ident === ident)
})

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

</style>
