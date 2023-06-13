<template>
  <v-dialog
    v-model="visible"
    title="绑定菜单及权限"
    :width="deviceType === 'h5' ? '360px' : '900px'"
    :full-screen="deviceType === 'h5'"
    destory-on-close
    :fixed-body-height="false"
    use-body-scrolling
    :loading="loading"
    @opened="handleOpened"
    @cancel="visible = false"
  >

    <el-tree
      ref="treeRef"
      height="100%"
      node-key="id"
      :data="props.menuOptions"
      show-checkbox
      check-strictly
      expand-on-click-node
      :default-checked-keys="selectIds"
      :props="{ label: 'name', children: 'children' }"
      @check="handleRowCheck"
    />
  </v-dialog>

</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import VDialog from "@/components/dialog/VDialog.vue";
import { computed, ref } from "vue";
import { findTreeItemById, getDeviceType, getTreeItemPath } from "@/utils/common";
import { CheckedInfo } from "element-plus/lib/components/tree-v2/src/types";
import { flatternTree, getSubTree } from "@/utils/common/tree";
import type { TreeKey } from "element-plus/es/components/tree/src/tree.type";

const deviceType = getDeviceType()

interface Props {
  modelValue: boolean
  menuOptions: MenuView[]
  selectIds: string[]
}

interface Emits {
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', rows: MenuView[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const visible = computed<boolean>({
  get: () => props.modelValue,
  set: v => emits('update:modelValue', v)
})

const treeRef = ref<InstanceType<typeof ElTree>>()

const loading = ref<boolean>(false)

function handleOpened() {
  const data = flatternTree(props.menuOptions)
  data.forEach(row => {
    if(!['PAGE', 'BUTTON', 'WORKFLOW', 'ENTITY'].includes(row.type)) {
      // @ts-ignore
      row.disabled = true
    }

  })
}

function handleRowCheck(row: MenuView, checkState: CheckedInfo) {
  console.log(row, checkState)
  if(!['TAB', 'PAGE', 'BUTTON', 'WORKFLOW', 'ENTITY'].includes(row.type)) {
    return
  }

  // checked now
  if (checkState.checkedKeys.includes(row.id)) {
    const result = getTreeItemPath(props.menuOptions, 'id', row.id)
    console.log(result)
    // skip last this
    result.slice(0, result.length - 1).forEach(it => treeRef.value?.setChecked(it.id, true, false))
  } else {
    // 按钮权限不向上递归取消选择
    if (row.type === 'BUTTON') {
      return;
    }

    deepCheckParent(row, treeRef.value?.getCheckedKeys() || [])

  }

}

function deepCheckParent(row: MenuView, checkedKeys: TreeKey[]) {
  const parent = getTreeItemPath(props.menuOptions, 'id', row.id)
  if (parent?.length > 1) {
    const parentRow = parent[parent.length - 2]
    const brother: MenuView[] = []
    getSubTree(brother, [parentRow], true)
    if (brother.every(it => !checkedKeys.includes(it.id))) {
      treeRef.value?.setChecked(parentRow.id, false, false)

      deepCheckParent(parentRow, treeRef.value?.getCheckedKeys() || [])
    }
  } else {

  }
}

</script>