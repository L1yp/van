<template>
  <el-dialog
    v-model="dialogVisible"
    :width="dialogWidth" title="选择用户"
    append-to-body
    center
    :draggable="true"
    :destroy-on-close="true"
    custom-class="user-ext-dialog"
    @opened="handleOpenedDialog"
  >

    <el-table
      v-loading="loading"
      ref="tableRef"
      :data="userData"
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
      <el-table-column width="40" type="selection" align="center" header-align="center" v-if="props.multiple"/>
      <el-table-column width="40" align="center" header-align="center" v-if="!props.multiple">
        <template #default="scope">
          <el-radio class="user-selector" name="user-selector" :label="scope.row.id" v-model="selectedRowId"></el-radio>
        </template>
      </el-table-column>
      <el-table-column width="50" label="#" prop="id" align="center" header-align="center"/>
      <el-table-column width="80" label="头像" prop="avatar">
        <template #default="scope">
          <el-avatar
            style="vertical-align: middle"
            shape="circle"
            :size="24"
            fit="cover"
            :src="scope.row.avatar"
          >
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column width="120" label="用户名(工号)" prop="username" align="left" header-align="left"/>
      <el-table-column width="80" label="昵称" prop="nickname"/>
      <el-table-column width="80" label="状态" prop="status" align="center" header-align="center">
        <template #default="scope">
          <dict-tag ident="common_status" :val="scope.row.status"></dict-tag>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {computed, nextTick, ref, unref, defineComponent, watch} from "vue";
import {
  ElDialog, ElButton, ElTag, ElTable,
  ElTableColumn, ElAvatar, ElRadio
} from "element-plus";
import * as UserApi from "@/api/sys/user"
import DictTag from "@/components/dict/DictTag.vue"
import {UserSelectorModelEmits, UserSelectorModelProps} from "@/components/common/selector/user/util";


export default defineComponent({
  name: "UserSelectorModel",
  components: {
    ElDialog, ElButton, ElTag, ElTable,
    ElTableColumn, ElAvatar, DictTag, ElRadio
  },
  props: UserSelectorModelProps,
  emits: UserSelectorModelEmits,
  setup(props, {emit: emits, expose}) {

    const baseTableWidth = 410;
    const tableWidth = computed(() => (baseTableWidth + 40) + "px")
    const dialogWidth = computed(() => `calc(${tableWidth.value} + 40px)`)

    const tableRef = ref<InstanceType<typeof ElTable>>(null);
    const dialogVisible = ref(false);
    const loading = ref(false);

    const userData = ref([]);
    const selectedRows = ref([]);
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

    const selectedRowId = ref<number>(-1)
    const currentRow = ref<UserView>()
    watch(currentRow, () => {
      if (currentRow.value) {
        selectedRowId.value = currentRow.value.id
      } else {
        selectedRowId.value = -1
      }
    })
    function handleCurrentChange(newRow, oldRow) {
      currentRow.value = newRow
    }

    function confirm() {

      if (props.multiple) {
        const selected = (tableRef.value.getSelectionRows() as UserView[])
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
        const params: UserQueryParam = {
          pageIdx: 1,
          pageSize: 50
        }
        loading.value = true
        userData.value = await UserApi.pageUserList(params)
        loading.value = false

        await nextTick(() => initSelectionUsers())
      } catch (e) {
        console.error(e)
      } finally {
      }
    }

    function initSelectionUsers() {
      if (!props.modelValue) {
        return
      }
      console.log("props.modelValue", Array.isArray(props.modelValue), props.modelValue)

      if (props.multiple) {
        let initUserIds = []
        if (Array.isArray(props.modelValue)) {
          initUserIds = unref(props.modelValue).map(it => it.username)
        } else {
          console.warn("[UserSelectorModal props] multiple is true, but modelValue is not Array?")
        }
        for (const user of unref(userData.value)) {
          if (initUserIds.includes(user.username)) {
            tableRef.value.toggleRowSelection(user, true)
          } else {
            tableRef.value.toggleRowSelection(user, false)
          }
        }
      } else {
        if (props.modelValue) {
          for (const user of unref(userData.value)) {
            if ((props.modelValue as UserView).username === user.username) {
              tableRef.value.setCurrentRow(user)
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
      dialogWidth, tableRef, dialogVisible, loading, userData,
      handleSelectionChange, handleRowClick, handleCurrentChange,
      confirm, open, close, handleOpenedDialog, handleRowDbClick,
      selectedRowId,
    }
  },

})

</script>


<style scoped>
:deep(.el-radio.user-selector span.el-radio__label) {
  display: none;
}
</style>