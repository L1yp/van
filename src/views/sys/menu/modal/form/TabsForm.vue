<template>
  <el-row>
    <el-col :span="12">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
    </el-col>
    <ElCol :span="12">
      <ElFormItem label="序号" prop="order_no">
        <ElInputNumber v-model="formData.order_no"></ElInputNumber>
      </ElFormItem>
    </ElCol>
  </el-row>
  <el-row>
    <el-col :span="16">
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
    <el-col :span="8">
      <el-form-item label="图标" prop="icon">
        <el-input v-model="props.formData.icon" />
      </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="16">
      <el-form-item label="路由" prop="path">
        <el-input v-model="props.formData.path"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="组件" prop="component">
        <el-input v-model="props.formData.component"></el-input>
      </el-form-item>
    </el-col>

  </el-row>
</template>

<script lang="ts" setup>
import { ElCol, ElFormItem, ElInput, ElRow, ElTreeSelect, ElInputNumber } from "element-plus";
import { computed, toRaw } from "vue";
import { flatternTree, toTree } from "@/utils/common";

interface Props {
  formData: MenuUpdateParam | MenuAddParam
  menuTree: MenuView[]
}

const props = defineProps<Props>()

const parentOptions = computed<MenuView[]>(() => {
  const menus = toRaw(props.menuTree)

  const flatTree: MenuView[] = flatternTree(JSON.parse(JSON.stringify(menus)))
  flatTree.forEach(it => it.children = [])
  const filterTree = flatTree.filter(it => it.type === 'FOLDER')
  return toTree(filterTree, 'id', 'pid')
})

</script>

<style scoped>

</style>