<template>
  <VDialog
    v-model="visible"
    :title="props.mode === 'create' ? '创建用户' : '更新用户'"
    :width="deviceType === 'h5' ? '360px' : '720px'"
    @open="handleOpened"
    @cancel="visible = false"
    @confirm="handleConfirm"
  >
    <el-form :model="formData" label-width="100px" :label-position="deviceType === 'pc' ? 'right' : 'top'" scroll-to-error>
      <el-row>
        <el-col :span="12" :xl="12" :xs="24">
          <el-form-item label="用户名" prop="username">
            <el-input :disabled="props.mode === 'update'" v-model="formData.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xl="12" :xs="24" v-show="props.mode === 'create'">
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :xl="12" :xs="24">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="formData.nickname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xl="12" :xs="24">
          <el-form-item label="手机" prop="phone">
            <el-input v-model="formData.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" :xl="12" :xs="24">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xl="12" :xs="24">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio-button :label="0">正常</el-radio-button>
              <el-radio-button :label="1">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门" prop="dept_id">
            <dept-selector-input v-model="formData.dept_id" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="兼职部门" prop="pt_dept_ids">
            <dept-selector-input v-model="formData.pt_dept_ids" multiple style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色" prop="role_ids">
            <el-select 
              v-model="formData.role_ids" 
              multiple 
              filterable
              clearable
              collapse-tags
              collapse-tags-tooltip
              fit-input-width
              style="width: 100%"
            >
              <el-option v-for="item in roleData" :key="item.id" :value="item.id" :label="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="头像" prop="avatar">
            <el-input v-model="formData.avatar"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </VDialog>
</template>

<script lang="ts" setup>
import VDialog from "@/components/dialog/VDialog.vue";
import { computed, onBeforeMount, ref } from "vue";
import { ElForm, ElFormItem, ElRow, ElCol, ElInput, ElRadioGroup, ElRadioButton, ElSelect, ElOption } from "element-plus";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import { useRole } from "@/service/system/role";
import { getDeviceType } from "@/utils/common";


interface Props {
  modelValue: boolean
  mode: 'create' | 'update'
  data?: UserView
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  mode: 'create',
})

interface Emits {
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', param: UserAddParam | UserUpdateParam): void
}
const emits = defineEmits<Emits>()

const deviceType = getDeviceType()


const visible = computed<boolean>({
  get: () =>  props.modelValue,
  set: v => emits('update:modelValue', v)
})


const formData = ref<UserAddParam & UserUpdateParam>({
  id: '',
  username: '',
  password: '',
  nickname: '',
  phone: '',
  email: '',
  avatar: '',
  dept_id: '',
  pt_dept_ids: [],
  role_ids: [],
  status: 0,
})

function handleConfirm() {
  emits('confirm', formData.value)
}

function handleOpened() {
  if (props.data) {
    Object.assign(formData.value, props.data)
  } else {
    formData.value = {
      id: '',
      username: '',
      password: '',
      nickname: '',
      phone: '',
      email: '',
      avatar: '',
      dept_id: '',
      pt_dept_ids: [],
      role_ids: [],
      status: 0,
    }
  }
}

const loading = ref<boolean>(false)
const { roleData, loadRole } = useRole(loading)
onBeforeMount(loadRole)
</script>

<style scoped>

</style>