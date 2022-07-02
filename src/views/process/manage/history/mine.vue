<template>
  <div class="dict-info-container">
    <div class="data-table">
      <el-table
        ref="dictInfoTableRef"
        v-loading="dictInfoTableLoading"
        :data="dictInfoTableData"
        :height="dictTableHeight" stripe
        :row-style="{cursor: 'pointer'}"
        highlight-current-row
        current-row-key="id"
        row-key="id"
      >
        <el-table-column type="index" label="#" width="60"/>
        <el-table-column label="流程类型" prop="process_type" width="150">
          <template #default="scope">
            <el-button link v-text="scope.row.process_type" @click="viewProcessList(scope.row)" style="text-decoration: underline"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="name" width="300">
          <template #default="scope">
            <el-button link v-text="scope.row.name" @click="viewProcess(scope.row)" style="text-decoration: underline"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="发起者" prop="creator.label" width="200">
          <template #default="scope">
            <user-viewer :data="scope.row.creator"></user-viewer>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="200" align="center"/>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button size="small" plain style="vertical-align: middle" text @click.stop="viewProcess(scope.row)">
              <SVGIcon style="width: 1em; height: 1em" name="View"/><span style="margin-left: 6px">详情</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>


</template>

<script lang="ts" setup>
import {computed, inject, onMounted, reactive, Ref, ref, unref,} from "vue"
import {asideWidthKey, mainHeightKey, themeKey, userInfoKey} from "@/config/app.keys";
import {
  ElTable, ElTableColumn, ElButton, ElPopconfirm, ElTooltip, ElDialog, ElForm, ElFormItem,
  ElRadioGroup, ElRadio, ElMessage, ElInputNumber, ElInput, ElRow, ElCol, ElSelect, ElOption,
  ElCascader,
} from "element-plus"
import * as ProcessApi from "@/api/sys/process"
import SVGIcon from "@/components/common/SVGIcon.vue"
import {useRouter} from "vue-router";
import UserViewer from "@/components/common/viewer/user/UserViewer.vue";

const router = useRouter()
const mainHeight = inject(mainHeightKey);
const theme = inject(themeKey);
const asideWidth = inject(asideWidthKey)
const dictInfoTableRef = ref<InstanceType<typeof ElTable>>()
const dictInfoTableLoading = ref(true)
const dictInfoTableData = ref<ProcessTODOTaskView[]>([])

const dictTableHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 20}px)`
})


const userInfo = inject<Ref<UserInfo>>(userInfoKey)

function viewProcessList(row: ProcessTODOTaskView) {
  router.push({
    path: "/process/manage/model/instance",
    query: {
      key: row.process_key
    }
  })
}

function viewProcess(row: ProcessTODOTaskView) {
  router.push({
    path: '/process/manage/detail/info',
    query: {
      id: row.process_id,
      key: row.process_key
    }
  })
}

async function loadTableData() {
  dictInfoTableLoading.value = true
  dictInfoTableData.value = await ProcessApi.listMyHistoryTask()
  dictInfoTableLoading.value = false
}

onMounted(async() => {
  await loadTableData()

})

function addDictInfo(row?: any) {}
function deleteRow(row?: any) {}
function exportDictInfoTable() {}

</script>

<style scoped>

.dict-info-container {
  box-sizing: border-box;
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
}

.dict-info-container:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, .12);
}

.data-table {
  box-sizing: border-box;
}

:deep(.el-form-item.is-success .el-input__validateIcon) {
  color: green;
}

</style>
