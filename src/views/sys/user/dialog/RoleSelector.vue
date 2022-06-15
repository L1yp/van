<template>

  <v-dialog
    @opened="handleOpenedDialog"
    @closed="emits('update:visible', false)"
    width="280px"
    v-model="visible"
    title="关联角色"
    append-to-body
    draggable
    :show-full-screen="false"
    @confirm="confirmRoleDialog"
    @cancel="emits('cancel')"
  >
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
      <div style="box-sizing: border-box; border: 1px #e3e3e3 solid; width: 240px; margin-top: 10px; ">
        <el-scrollbar :height="selectedBoxHeight" always view-class="selected-tags">
          <el-tag @close="handleCloseRole(item)" v-for="item in selectedRoles" closable>{{item.name}}</el-tag>
        </el-scrollbar>

      </div>

    </div>

  </v-dialog>
</template>

<script lang="ts" setup>
import {ref, computed, watch,} from "vue"
import {
  ElDialog, ElTable, ElTableColumn, ElTag, ElButton, ElScrollbar
} from "element-plus"
import VDialog from "@/components/dialog/VDialog.vue";

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
:deep(.selected-tags) {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px;
}
</style>
