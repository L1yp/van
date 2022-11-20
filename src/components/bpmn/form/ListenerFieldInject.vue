<template>
  <vxe-table
    ref="tableRef"
    height="100%"
    border stripe keep-source
    :data="listener.fields || []"
    class="listener-field-table"
    :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
    :edit-rules="validRules"
    @edit-closed="handleEditClosed"
  >
    <vxe-column field="name" title="字段名" :edit-render="{name: '$input'}" />
    <vxe-column field="type" title="类型" :edit-render="{ name: '$select', options: fieldTypeOptions, props: {  transfer: true } }" />
    <vxe-column field="value" title="值" :edit-render="{ name: '$input' }" />
    <vxe-column width="52" header-align="center" align="center">
      <template #header>
        <el-button :icon="Plus" text type="danger" style="padding: 0 9px" @click="handleAddRow" />
      </template>
      <template #default="scope">
        <el-button :icon="Delete" link type="danger" @click="handleDeleteRow(scope.row)" />
      </template>
    </vxe-column>
  </vxe-table>
</template>
<script lang="ts" setup>
import { Plus, Delete } from '@element-plus/icons-vue'
import { VxeTableInstance, VxeTableDefines, VxeTablePropTypes } from "vxe-table";
import { ref } from "vue";
import { ElMessage, ElButton } from "element-plus";

interface Props {
  listener: TaskListenerObject
}

const props = defineProps<Props>()

const fieldTypeOptions = [
  {
    label: '字符串',
    value: 'string'
  },
  {
    label: '表达式',
    value: 'expression'
  },

]


const validRules: VxeTablePropTypes.EditRules = {
  name: [
    { required: true, type: 'string', message: '字段必须填写' },
    { type: 'string', pattern: /^[a-zA-Z_\\$]+\w?$/, message: '字段名必须是字母或下划线或$开头' },
    {
      validator(params) {
        const name = params.cellValue
        if (props.listener.fields.filter(it => it.name === name)?.length > 1) {
          throw new Error('字段名不允许重复')
        }
      },
    }
  ],
  type: [
    { required: true, type: 'string', message: '类型必须选择' }
  ],
  value: [
    { required: true, type: 'string', message: '值必须填写' }
  ]
}

const tableRef = ref<VxeTableInstance>()
const formRef = ref<InstanceType<typeof ElForm>>()

function handleAddRow() {
  if (!props.listener.fields) {
    props.listener.fields = []
  }

  if (props.listener.fields.some(it => !it.name?.trim())) {
    ElMessage.error(`请先填写完毕再新增`)
    return
  }

  const row: ListenerField = {
    name: '',
    type: 'string',
    value: ''
  }

  props.listener.fields.push(row)

  tableRef.value.reloadData(props.listener.fields).then(() => tableRef.value.setEditRow(row))

}

function handleDeleteRow(row: ListenerField) {
  const idx = props.listener.fields.findIndex(it => it.name === row.name)
  if (idx !== -1) {
    props.listener.fields.splice(idx, 1)
    tableRef.value.reloadData(props.listener.fields)
  }
}

function handleEditClosed(params: VxeTableDefines.EditClosedEventParams) {
  tableRef.value.validate(params.row).then(err => {
    if (err) {
      tableRef.value.setEditRow(params.row)
    } else {
      tableRef.value.reloadRow(params.row)
    }
  })
}


async function validate() {
  await tableRef.value.fullValidate()
}

defineExpose({
  validate
})


</script>