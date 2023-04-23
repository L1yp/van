<template>
  <el-form-item label="名称" prop="name" required>
    <el-input v-model="props.formData.name" />
  </el-form-item>
  <el-form-item label="排序" prop="sn" required>
    <el-input-number v-model="props.formData.sn" :min="1" :precision="0" :controls="false" style="width: 100%" />
  </el-form-item>
  <el-form-item label="状态" prop="status" required>
    <el-radio-group v-model="props.formData.status">
      <el-radio-button :label="true">正常</el-radio-button>
      <el-radio-button :label="false">禁用</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="排序规则" prop="collation">
    <template v-if="!props.formData.collation?.length">
      <el-button :icon="Plus" @click="handleClickAdd" circle></el-button>
    </template>
    <template v-else>
      <div style="display: flex; flex-direction: column; gap: 6px; width: 100%">
        <div
          v-for="item in props.formData.collation"
          :key="item.id"
        >
          <el-button :icon="Plus" @click="handleClickAdd" circle :disabled="props.formData.collation?.length >= 5" />
          <el-button :icon="Minus" @click="handleClickRemove(item)" circle style="margin-left: 0"/>
          <el-select v-model="item.field" style="width: calc(100% - 96px);">
            <el-option
              v-for="item in props.formData.columns?.map(it => it.field)"
              :key="item.id"
              :label="item.label"
              :value="item.field"
              :disabled="selectedOrderFields.has(item.field)"
            />
          </el-select>
          <el-button v-if="item.order === 'asc'" :icon="Top" circle @click="item.order = 'desc'" />
          <el-button v-else :icon="Bottom" circle @click="item.order = 'asc'" />
        </div>
      </div>
    </template>
  </el-form-item>
</template>

<script lang="ts" setup>
import { ElButton, ElInput, ElRadioGroup, ElRadioButton, ElFormItem, ElInputNumber, ElSelect, ElOption } from "element-plus";
import { computed, ref } from "vue";
import { Plus,Minus, Top, Bottom } from "@element-plus/icons-vue";


interface Props {
  formData: Partial<ModelingViewAddParam & ModelingViewUpdateParam>
  fields: ModelingFieldDefView[]
}
const props = defineProps<Props>()

const selectedOrderFields = computed(() => new Set(props.formData.collation.filter(it => !!it.field).map(it => it.field)))

function handleClickAdd() {
  props.formData.collation.push({
    id: Math.random(),
    field: '',
    order: 'asc',
  })
}


function handleClickRemove(row: Collation) {
  const idx = props.formData.collation.indexOf(row)
  if (idx !== -1) {
    props.formData.collation.splice(idx, 1)
  }
}

</script>

<style scoped>

</style>