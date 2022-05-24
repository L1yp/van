<template>
  <v-dialog
    v-model="dialogVisible"
    :width="dialogWidth" title="选择部门"
    append-to-body
    center
    :draggable="true"
    :destroy-on-close="true"
    @opened="handleOpenedDialog"
    @cancel="dialogVisible = false"
    @confirm="confirm"
  >
    <el-table
      v-loading="loading"
      ref="tableRef"
      :data="tableData"
      height="50vh"
      style="width: 100%"
      row-key="id"
      stripe
      :row-style="{cursor: 'pointer'}"
      @selection-change="handleSelectionChange"
      :highlight-current-row="true"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
    >
      <el-table-column width="60" type="selection" align="center" header-align="center" v-if="props.multiple"/>
      <el-table-column prop="simple_name" align="left" header-align="left" label="简称" width="300" />
      <el-table-column prop="id" align="center" header-align="center" label="#" width="60" />
      <el-table-column prop="ident" align="center" header-align="center" label="编号" width="100" />
      <el-table-column prop="status" align="center" header-align="center" label="状态" width="80">
        <template #default="scope">
          <dict-tag ident="common_status" :val="scope.row.status"></dict-tag>
        </template>
      </el-table-column>
    </el-table>

  </v-dialog>
</template>
<script lang="ts">
import {computed, nextTick, ref, unref, defineComponent, watch} from "vue";
import {
  ElDialog, ElButton, ElTag, ElTable,
  ElTableColumn, ElAvatar, ElRadio
} from "element-plus";
import * as DeptApi from "@/api/sys/dept"
import DictTag from "@/components/dict/DictTag.vue"
import VDialog from "@/components/dialog/VDialog.vue";
import {DeptSelectorModelEmits, DeptSelectorModelProps} from "@/components/common/selector/dept/util";


export default defineComponent({
  name: "DeptSelectorModel",
  components: {
    VDialog,
    ElDialog, ElButton, ElTag, ElTable,
    ElTableColumn, ElAvatar, DictTag, ElRadio
  },
  props: DeptSelectorModelProps,
  emits: DeptSelectorModelEmits,
  setup(props, {emit: emits, expose}) {

    const baseTableWidth = 550;
    const tableWidth = computed(() => props.multiple ? ((baseTableWidth + 50) + "px") : (baseTableWidth + "px"))
    const dialogWidth = computed(() => `calc(${tableWidth.value} + 40px)`)

    const tableRef = ref<InstanceType<typeof ElTable>>(null);
    const dialogVisible = ref(false);
    const loading = ref(false);

    const tableData = ref([]);
    const selectedRows = ref<DeptView[]>([]);
    function handleSelectionChange(selectedArr) {
      selectedRows.value = selectedArr;
    }


    function handleRowClick(row, column, event) {
      tableRef.value.toggleRowSelection(row, undefined);
    }

    function handleRowDbClick(row, column, event) {
      if (!props.multiple) {
        currentRow.value = row
        emits("update:modelValue", currentRow.value)
        dialogVisible.value = false
      }
    }

    const currentRow = ref<DeptView>()
    function handleCurrentChange(newRow, oldRow) {
      currentRow.value = newRow
    }

    function confirm() {

      if (props.multiple) {
        const selected = (tableRef.value.getSelectionRows() as DeptView[])
        console.log("selected", selected)
        emits("update:modelValue", selected)
      } else {
        emits("update:modelValue", currentRow.value)
      }

      dialogVisible.value = false
    }

    function open() {
      dialogVisible.value = true
    }

    function close() {
      dialogVisible.value = false
    }

    async function handleOpenedDialog() {
      try {

        loading.value = true
        tableData.value = await DeptApi.findDept()
        loading.value = false

        await nextTick(() => initSelectionDepts())
      } catch (e) {
        console.error(e)
      } finally {
      }
    }

    function initSelectionDepts() {
      if (!props.modelValue) {
        return
      }
      console.log("props.modelValue", Array.isArray(props.modelValue), props.modelValue)

      if (props.multiple) {
        let initDeptIds = []
        if (Array.isArray(props.modelValue)) {
          initDeptIds = unref(props.modelValue).map(it => it.id)
        } else {
          console.warn("[UserSelectorModal props] multiple is true, but modelValue is not Array?")
        }
        for (const dept of unref(tableData.value)) {
          if (initDeptIds.includes(dept.id)) {
            tableRef.value.toggleRowSelection(dept, true)
          } else {
            tableRef.value.toggleRowSelection(dept, false)
          }
        }
      } else {
        if (props.modelValue) {
          for (const dept of unref(tableData.value)) {
            if ((props.modelValue as DeptView).id === dept.id) {
              tableRef.value.setCurrentRow(dept)
              break
            }
          }

        }
      }

    }



    expose({
      open, close
    })

    return {
      props,
      dialogWidth, tableRef, dialogVisible, loading, tableData,
      handleSelectionChange, handleRowClick, handleCurrentChange,
      confirm, open, close, handleOpenedDialog,
      handleRowDbClick,
    }
  },

})

</script>


<style scoped>
:deep(.el-radio.dept-selector span.el-radio__label) {
  display: none;
}
</style>