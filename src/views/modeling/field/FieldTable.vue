<template>
  <div style="width: 100%; height: 100%;">
    <vxe-table
      height="100%"
      :loading="loading"
      :data="props.data"
      border stripe
      :menu-config="menuConfig"
      @menu-click="handleMenuClick"
    >
      <vxe-column type="seq" label="#" width="50" />
      <vxe-column field="field" title="字段" width="150" resizable align="center" header-align="center" />
      <vxe-column field="label" title="名称" width="200" resizable align="center" header-align="center" />
      <vxe-column field="type" title="类型" width="100" resizable align="center" header-align="center" />
      <vxe-column field="remark" title="说明"/>

    </vxe-table>


  </div>
</template>

<script lang="ts" setup>
import { VxeTablePropTypes, VxeTableDefines } from "vxe-table";

interface Props {
  loading: boolean
  data: ModelingFieldDefView[]
}

interface Emits {
  (e: 'edit', row: ModelingFieldDefView): void
  (e: 'delete', row: ModelingFieldDefView): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const menuConfig: VxeTablePropTypes.MenuConfig = {
  body: {
    options: [
      [
        { code: 'edit', name: '编辑', prefixIcon: 'vxe-icon-edit' },
        { code: 'delete', name: '删除', prefixIcon: 'vxe-icon-delete' },
      ]
    ]
  },
}

function handleMenuClick(params: VxeTableDefines.MenuClickEventParams) {
  if (params.menu.code === 'edit') {
    emits('edit', params.row)
  }
  else if (params.menu.code === 'delete') {
    emits('delete', params.row)
  }
}


</script>

<style scoped>

</style>