<template>

  <user-selector-input
    style="width: 100%"
    v-model="selectedElem"
    :multiple="false"
    placeholder="单选用户，value是对象，可双击弹框选择"
  >
  </user-selector-input>
  <div>
    {{ JSON.stringify(selectedElem) }}
  </div>


  <user-selector-input
    style="width: 100%"
    v-model="selectedUserId"
    value-key="id"
    :multiple="false"
    placeholder="单选用户，value是id，可双击弹框选择"
  >
  </user-selector-input>
  <div>
    {{ selectedUserId }}
  </div>
  <user-selector-input
    style="width: 100%"
    v-model="selectedElems"
    multiple
    placeholder="多选用户，value是对象数组，可双击弹框选择"
  >
  </user-selector-input>
  <div>
    {{ JSON.stringify(selectedElems) }}
  </div>

  <user-selector-input
    style="width: 100%"
    v-model="selectedUserIds"
    value-key="id"
    multiple
    placeholder="多选用户，value是ID数组，可双击弹框选择"
  >
  </user-selector-input>
  <div>
    {{ JSON.stringify(selectedUserIds) }}
  </div>



  <dept-selector-input
    style="width: 100%"
    v-model="selectedDeptElem"
    :multiple="false"
    placeholder="单选部门，value是对象，可双击弹框选择"
  >
  </dept-selector-input>
  <div>
    {{ JSON.stringify(selectedDeptElem) }}
  </div>

  <dept-selector-input
    style="width: 100%"
    v-model="selectedDeptId"
    value-key="id"
    :multiple="false"
    placeholder="单选部门，value是ID，可双击弹框选择"
  >
  </dept-selector-input>
  <div>
    {{ selectedDeptId }}
  </div>

  <dept-selector-input
    style="width: 100%"
    v-model="selectedDeptElems" multiple
    placeholder="多选部门，value是对象数组，可双击弹框选择"
  >
  </dept-selector-input>
  <div>
    {{ JSON.stringify(selectedDeptElems) }}
  </div>

  <dept-selector-input
    style="width: 100%"
    v-model="selectedDeptIds"
    value-key="id" multiple
    placeholder="多选部门，value是ID数组，可双击弹框选择"
  >
  </dept-selector-input>
  <div>
    {{ JSON.stringify(selectedDeptIds) }}
  </div>

  <v-form-pro
    :form-attr="{labelWidth: '120px'}"
    :scheme="formScheme"
    v-model="formModel"
  >

  </v-form-pro>
  <div>
    {{ JSON.stringify(formModel) }}
  </div>

</template>

<script lang="ts" setup>
import { ref, } from "vue"
import VFormPro from "@/components/form/VFormPro.vue";
import {FormScheme} from "@/components/form/types";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue"
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue"

const loading = ref(false)
const selectedUserId = ref<number>(0)
const selectedElem = ref<UserView>(null)
const selectedUserIds = ref<number[]>([])
const selectedElems = ref<UserView[]>(null)

const selectedDeptId = ref<number>(0)
const selectedDeptElem = ref<UserView>(null)
const selectedDeptIds = ref<number[]>([])
const selectedDeptElems = ref<DeptView[]>(null)

const formScheme: FormScheme[][] = [
  [
    {
      name: 'end_monthly',
      label: '是否月结调整',
      component: 'dict-input',
      span: 12,
      writeable: true,
      componentAttrs: {
        scope: 'global',
        ident: 'yesno',
        valType: 'value',
        modelValue: 1
      }
    },
    {
      name: 'sub_high_leader',
      label: '子公司高层',
      component: 'user-viewer',
      span: 12,
      writeable: false,
      componentAttrs: {
        data: {
          "id": 3,
          "username": "A52736",
          "nickname": "不知火舞",
          "phone": "18077855137",
          "email": "18877185@qq.com",
          "avatar": "https://q4.qlogo.cn/g?b=qq&nk=18877185&s=0",
          "register_ip": null,
          "status": 0,
          "update_by": "admin",
          "label": "不知火舞<A52736>"
        }
      }
    }
  ],
]
const formModel = ref({})


</script>

<style scoped>

</style>