<template>

  <div v-loading="loading" style="background-color: var(--el-bg-color); padding: 10px; height: 100%; box-sizing: border-box;">
    <div style="background-color: var(--toolbar-bg-color); box-sizing: border-box; padding: 6px;">
      <el-button v-if="mode === 'view'" @click="mode = 'edit'">编辑</el-button>
      <el-popconfirm
        v-if="mode === 'view'"
        confirm-button-text="确定"
        cancel-button-text="取消"
        icon-color="#626AEF"
        title="你确定要删除吗?"
        @confirm="handleDeleteEntity"
      >
        <template #reference>
          <el-button type="danger" plain>删除</el-button>
        </template>
      </el-popconfirm>

      <el-button v-if="mode === 'edit'" @click="handleCancel">取消</el-button>
      <el-button v-if="mode === 'edit'" @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <div style="width: 100%; max-width: 800px; height: calc(100% - 32px - 12px)">
      <el-scrollbar always>
        <el-divider content-position="left">基本信息</el-divider>
        <el-form :model="formData" label-width="80px" :label-position="formLabelPosition" ref="formRef" :rules="rules" status-icon>
          <el-form-item label="标识" prop="mkey">
            <div v-text="entity.mkey"></div>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-if="mode === 'edit'" v-model="formData.name" />
            <div v-if="mode === 'view'" v-text="formData.name"></div>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-if="mode === 'edit'" type="textarea" :rows="2" v-model="formData.remark" />
            <div v-if="mode === 'view'" v-text="formData.remark"></div>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status" :disabled="mode === 'view'">
              <el-radio-button :label="0">正常</el-radio-button>
              <el-radio-button :label="1">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

  </div>


</template>
<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElRadioGroup, ElRadioButton, ElButton, ElDivider, FormRules, ElScrollbar,
  ElPopconfirm,
} from "element-plus";
import { inject, ref } from "vue";
import { useEntityApi } from "@/service/modeling/entity";
import { modelingEntityKey } from "../../keys";
import { formLabelPosition } from "@/store/layout";

interface Emits {
  (e: 'close'): void
}

const emits = defineEmits<Emits>()

const entity = inject(modelingEntityKey)!

const loading = ref<boolean>(false)

const { findEntity, modelView, updateEntity, deleteEntity } = useEntityApi(loading)

const formData = ref<ModelingEntityUpdateParam>({
  id: entity.value.id,
  name: entity.value.name,
  remark: entity.value.remark,
  status: entity.value.status,
})

const mode = ref<'edit' | 'view'>('view')

function initFormData() {
  formData.value = {
    id: entity.value.id,
    name: entity.value.name,
    remark: entity.value.remark,
    status: entity.value.status,
  }
}

function handleCancel() {
  mode.value = 'view'
  initFormData()
}

async function handleConfirm() {
  try {
    await formRef.value.validate()
  } catch (e) {
    console.error(e);
    return
  }
  await updateEntity(formData.value)
  await findEntity(entity.value.id)
  formData.value = modelView.value
  mode.value = 'view'
}

function handleDeleteEntity() {
  deleteEntity(entity.value.id)
    .then(result => {
      if (result) {
        emits('close')
      }
    })
}

const rules: FormRules = {
  key: {
    trigger: 'blur',
    required: true,
    pattern: /^[a-zA-Z_]+\w?$/,
    message: '必须以字母或下划线开头'
  },
  name: {
    trigger: 'blur',
    required: true,
    message: '名称长度有误',
  },

}


const formRef = ref<InstanceType<typeof ElForm>>()

</script>