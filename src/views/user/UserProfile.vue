<template>

  <user-selector-input
    style="width: 100%"
    v-model="selectedElems"
    multiple
  >
  </user-selector-input>

  <user-selector-input
    style="width: 100%"
    v-model="selectedUserIds"
    value-key="id"
    multiple
  >
  </user-selector-input>

  <dept-selector-input style="width: 100%" v-model="selectedDeptElems" multiple></dept-selector-input>
  <dept-selector-input style="width: 100%" v-model="selectedDeptIds" value-key="id" multiple></dept-selector-input>

  <v-form-pro
    :form-attr="{labelWidth: '120px'}"
    :scheme="formScheme"
    v-model="formModel"
  >

  </v-form-pro>

</template>

<script lang="ts" setup>
import { ref, } from "vue"
import VFormPro from "@/components/form/VFormPro.vue";
import {FormScheme} from "@/components/form/types";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue"
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue"

const loading = ref(false)
const selectedElems = ref<UserView[]>(null)
const selectedDeptElems = ref<DeptView[]>(null)

const selectedUserIds = ref<number[]>([])
const selectedDeptIds = ref<number[]>([])


const formScheme: FormScheme[][] = [
  [
    {
      name: 'end_monthly',
      label: '是否月结调整',
      component: 'dict-tag',
      span: 12,
      writeable: false,
      componentAttrs: {
        scope: 'global',
        ident: 'yesno',
        valType: 'value',
        val: 1
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