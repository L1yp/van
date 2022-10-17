<template>

  <user-selector-input
    style="width: 100%"
    v-model="selectedElem"
    :multiple="false"
    :user-map="userMap"
    placeholder="单选用户，value是对象，可双击弹框选择"
  />
  <div>
    {{ JSON.stringify(selectedElem) }}
  </div>


  <user-selector-input
    style="width: 100%"
    v-model="selectedUserId"
    :user-map="userMap"
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
    :user-map="userMap"
    placeholder="多选用户，value是对象数组，可双击弹框选择"
  >
  </user-selector-input>
  <div>
    {{ JSON.stringify(selectedElems) }}
  </div>

  <user-selector-input
    style="width: 100%"
    v-model="selectedUserIds"
    multiple
    :user-map="userMap"
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
    multiple
    placeholder="多选部门，value是ID数组，可双击弹框选择"
  >
  </dept-selector-input>
  <div>
    {{ JSON.stringify(selectedDeptIds) }}
  </div>


</template>

<script lang="ts" setup>
import { ref, } from "vue"
import VFormPro from "@/components/form/VFormPro.vue";
import {FormScheme} from "@/components/form/types";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue"
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue"

const loading = ref<boolean>(false)
const selectedUserId = ref<string>(null)
const selectedElem = ref<UserView>(null)
const selectedUserIds = ref<number[]>([])
const selectedElems = ref<UserView[]>(null)

const selectedDeptId = ref<string>(null)
const selectedDeptElem = ref<UserView>(null)
const selectedDeptIds = ref<number[]>([])
const selectedDeptElems = ref<DeptView[]>(null)

const userMap = new Map<string, UserView>()

</script>

<style scoped>

</style>