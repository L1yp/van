<template>
  <div class="dict-info-container">
    <div class="op-line">
      <el-button size="default" plain style="vertical-align: middle;" type="primary" @click="addDictInfo">
        <SVGIcon style="width: 1em; height: 1em" name="Plus"/><span style="margin-left: 4px;">新增</span>
      </el-button>
      <el-button size="default" plain style="vertical-align: middle" type="warning" @click="exportDictInfoTable">
        <SVGIcon style="width: 1em; height: 1em" name="Download"/><span style="margin-left: 4px;">导出</span>
      </el-button>
    </div>

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
        <el-table-column type="selection" width="50"/>
        <el-table-column label="#" prop="id" width="150"/>
        <el-table-column label="标题" prop="name" width="150"/>
        <el-table-column label="责任人" prop="assignee.label" width="150" align="center"/>
        <el-table-column label="创建人" prop="creator.label" width="150" align="center"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button size="small" plain style="vertical-align: middle" text @click.stop="viewProcess(scope.row)">
              <s-v-g-icon style="width: 1em; height: 1em" name="View"/><span style="margin-left: 6px">详情</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>

</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"
import { computed, inject, onMounted, Ref, ref, } from "vue"
import { asideWidthKey, mainHeightKey, themeKey, userInfoKey } from "@/config/app.keys";
import {
  ElTable, ElTableColumn, ElButton,
} from "element-plus"
import * as ProcessApi from "@/api/sys/process"
import SVGIcon from "@/components/common/SVGIcon.vue"


const route = useRoute()
const router = useRouter()
const key = route.params.key

const mainHeight = inject(mainHeightKey);
const theme = inject(themeKey);
const asideWidth = inject(asideWidthKey)
const dictInfoTableRef = ref<InstanceType<typeof ElTable>>()
const dictInfoTableLoading = ref(true)
const dictInfoTableData = ref<ProcessInstanceView[]>([])

const dictInfoTableWidth = computed(() => {
  const padding = 20;
  const tableWidth = 1050;
  return (padding + tableWidth) + "px";
})
const dictTableHeight = computed(() => {
  return `calc(${mainHeight.value} - ${theme.value.mainPadding * 2 + 42 + 20}px)`
})


const userInfo = inject<Ref<UserInfo>>(userInfoKey)

async function loadTableData() {
  let param = key as string
  dictInfoTableLoading.value = true
  dictInfoTableData.value = await ProcessApi.processInstanceByProcessKey(param)
  dictInfoTableLoading.value = false
}

onMounted(async() => {
  await loadTableData()

})

function viewProcess(row: ProcessInstanceView) {
  router.push({
    name: "processInstanceInfo",
    query: {
      id: row.id,
      key: key
    }
  })
}

function addDictInfo(row?: any) {}
function deleteRow(row?: any) {}
function exportDictInfoTable() {}




</script>

<style scoped>


.dict-info-container {
  box-sizing: border-box;
  width: v-bind(dictInfoTableWidth);
  background-color: #FFFFFF;
  padding: 10px;
  transition: .3s;
}

.dict-info-container:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, .12);
}


.op-line {
  box-sizing: border-box;
  height: 32px;
}

.data-table {
  box-sizing: border-box;
  margin-top: 10px;
}

:deep(.el-form-item.is-success .el-input__validateIcon) {
  color: green;
}
</style>