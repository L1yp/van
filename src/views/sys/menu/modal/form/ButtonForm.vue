<template>
  <el-row :gutter="10" style="margin-left: 0; margin-right: 0;">
    <el-col :span="12" :xs="24">
      <el-form-item label="名称" prop="name" required>
        <el-input v-model="formData.name" />
      </el-form-item>
    </el-col>
    <ElCol :span="12" :xs="24">
      <ElFormItem label="序号" prop="order_no" required>
        <ElInputNumber v-model="formData.order_no" style="width: 100%"></ElInputNumber>
      </ElFormItem>
    </ElCol>
    <el-col :span="12" :xs="24">
      <el-form-item label="父菜单" prop="pid" required>
        <el-tree-select
          v-model="props.formData.pid"
          style="width: 100%"
          clearable
          node-key="id"
          :props="{ children: 'children', label: 'name', value: 'id' }"
          :data="parentOptions"
        />
      </el-form-item>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-form-item label="权限标识" prop="component" required>
        <el-input v-model="props.formData.component"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-form-item label="状态" prop="state" required>
        <DictInput v-model="props.formData.state" :ident="STATUS" />
      </el-form-item>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ElCol, ElFormItem, ElInput, ElRow, ElTreeSelect, ElInputNumber, ElRadioGroup, ElRadioButton } from "element-plus";
import { computed, toRaw } from "vue";
import { flattenTree, toTree } from "@/utils/common";
import DictInput from "@/components/dict/DictInput.vue";
import { STATUS } from "@/components/dict/dict";


interface Props {
  formData: MenuUpdateParam | MenuAddParam
  menuTree: MenuView[]
}

const props = defineProps<Props>()

const parentOptions = computed<MenuView[]>(() => {
  const menus = toRaw(props.menuTree)

  const flatTree: MenuView[] = flattenTree(JSON.parse(JSON.stringify(menus)))
  flatTree.forEach(it => it.children = [])
  const filterTree = flatTree.filter(it => ['PAGE', 'TAB', 'FOLDER'].includes(it.type))
  return toTree(filterTree, 'id', 'pid')
})

</script>

<style scoped>

</style>