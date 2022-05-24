<template>
  <el-dialog @opened="handleOpenedDialog" @closed="emits('update:visible', false)" custom-class="user-ext-dialog" width="280px" v-model="visible" title="关联角色" :append-to-body="true">
    <div style="width: 100%">
      <div style="width: 240px; ">
        <el-table
          ref="roleTableRef"
          :height="roleTableHeight"
          :data="props.roleData"
          style="width: 100%"
          row-key="id"
          stripe
          @selection-change="handleRoleSelectedChange"
          :row-style="{cursor: 'pointer'}"
          @row-click="handleRoleRowClick"
        >
          <el-table-column type="selection" width="40"/>
          <el-table-column prop="id" label="#" width="50" />

          <el-table-column prop="name" label="角色名称" width="150" :show-overflow-tooltip="true" />

        </el-table>
      </div>
      <div style="box-sizing: border-box; margin-top: 10px; border: 1px #e3e3e3 solid; width: 240px; padding: 0 5px 5px;" :style="{height: `${selectedBoxHeight}px`}">
        <el-scrollbar :height="`${selectedBoxHeight - 5 - 2}px`" always>
          <el-tag @close="handleCloseRole(item)" v-for="item in selectedRoles" closable>{{item.name}}</el-tag>
        </el-scrollbar>

      </div>

    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('cancel')">取消</el-button>
        <el-button type="primary" @click="confirmRoleDialog">确定</el-button>
      </span>
    </template>

  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, computed, watch,} from "vue"
import {
  ElDialog, ElTable, ElTableColumn, ElTag, ElButton, ElScrollbar
} from "element-plus"
import {RoleView} from "@/api/sys/role";

interface Props {
  roleData: RoleView[];
  boundRoleIds: number[];
  visible: boolean;
}

interface Emits {
  (e: 'confirm', selected: number[]);
  (e: 'cancel');
  (e: 'update:visible', val: boolean);
}

const props = defineProps<Props>();

const visible = ref<boolean>(props.visible)
watch(() => props.visible, val => visible.value = val)


console.log(props);


const emits = defineEmits<Emits>();

const selectedBoxHeight = 57;
const roleTableHeight = computed(() => {
  const marginY = 30; // vh
  const headerHeight = 55; // px
  const footerHeight = 55; // px
  const bodyMarginY = 60; // px

  const offsetHeight = document.body.offsetHeight;
  const calcHeight = 0.7 * offsetHeight - headerHeight - footerHeight - (selectedBoxHeight - 10) - bodyMarginY;
  const size = props.roleData.length;
  const tableHeight = size * 32 + 32;
  if (calcHeight > tableHeight) {
    return tableHeight;
  } else {
    return `calc(100vh - ${marginY}vh - ${headerHeight}px - ${footerHeight}px - ${selectedBoxHeight + 10}px - ${bodyMarginY}px)`;
  }
});
const roleTableRef = ref<InstanceType<typeof ElTable>>(null);


function handleRoleRowClick(row, column, event) {
  roleTableRef.value.toggleRowSelection(row, undefined);
}
const selectedRoles = ref([]);
function handleRoleSelectedChange(roles) {
  selectedRoles.value = roles;
}

function confirmRoleDialog() {
  emits("confirm", selectedRoles.value.map(it => it.id));
}

function handleCloseRole(row) {
  const idx = selectedRoles.value.indexOf(row);
  if(idx > -1) {
    selectedRoles.value.splice(idx, 1);
    roleTableRef.value.toggleRowSelection(row, false);
  }
}

function handleOpenedDialog() {
  console.log("props.boundRoleIds", props.boundRoleIds);
  if (!props.boundRoleIds || props.boundRoleIds.length === 0) {
    roleTableRef.value.clearSelection();
  } else {
    for (let row of props.roleData) {
      if (props.boundRoleIds.indexOf(row.id) >= 0) {
        roleTableRef.value.toggleRowSelection(row, true);
      } else {
        roleTableRef.value.toggleRowSelection(row, false);
      }
    }
  }

}


</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 5px;
}

.el-tag {
  margin-top: 5px;
}

</style>