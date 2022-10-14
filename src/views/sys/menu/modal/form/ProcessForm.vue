<template>
  <el-row>
    <el-col :span="12">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
    </el-col>
    <ElCol :span="12">
      <ElFormItem label="序号" prop="order_no">
        <ElInputNumber v-model="formData.order_no" style="width: 100%"></ElInputNumber>
      </ElFormItem>
    </ElCol>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-form-item label="父菜单" prop="pid">
        <el-tree-select
          v-model="props.formData.pid"
          style="width: 100%"
          node-key="id"
          :props="{ children: 'children', label: 'name', value: 'id' }"
          :data="parentOptions"
        />
      </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <el-form-item label="流程标识" prop="component">
        <el-input v-model="props.formData.component"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="图标" prop="icon">
        <el-input v-model="props.formData.icon" />
      </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <el-form-item label="状态" prop="state">
        <DictInput v-model="props.formData.state" :ident="STATUS" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ElCol, ElFormItem, ElInput, ElRow, ElTreeSelect, ElRadioGroup, ElRadioButton, ElInputNumber } from "element-plus";
import { computed, toRaw } from "vue";
import { flatternTree, toTree } from "@/utils/common";
import DictInput from "@/components/dict/DictInput.vue";
import { STATUS } from "@/components/dict/dict";

interface Props {
  formData: MenuUpdateParam | MenuAddParam
  menuTree: MenuView[]
}

const props = defineProps<Props>()

const parentOptions = computed<MenuView[]>(() => {
  const menus = toRaw(props.menuTree)

  const flatTree: MenuView[] = flatternTree(JSON.parse(JSON.stringify(menus)))
  flatTree.forEach(it => it.children = [])
  const filterTree = flatTree.filter(it => ['TAB'].includes(it.type))
  return toTree(filterTree, 'id', 'pid')
})

</script>

<style scoped>

</style>