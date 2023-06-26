<template>
  <el-upload ref="uploadRef" class="v-upload" :auto-upload="false" list-type="picture" v-model:file-list="fileList" :disabled="props.disabled" v-bind="$attrs">
    <el-icon v-if="!props.disabled" ><Plus/></el-icon>
    <template #file="{ file }">
      <template v-if="isImageFile(file)">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
      </template>
      <template v-else-if="['ppt', 'pptx'].includes(getFileSuffix(file))">
        <img class="el-upload-list__item-thumbnail" src="/file-icons/ppt.ico" alt="">
      </template>
      <template v-else-if="['xls', 'xlsx'].includes(getFileSuffix(file))">
        <img class="el-upload-list__item-thumbnail" src="/file-icons/xls.ico" alt="">
      </template>
      <template v-else-if="['doc', 'docx'].includes(getFileSuffix(file))">
        <img class="el-upload-list__item-thumbnail" src="/file-icons/doc.ico" alt="">
      </template>
      <template v-else-if="['txt'].includes(getFileSuffix(file))">
        <img class="el-upload-list__item-thumbnail" src="/file-icons/txt.ico" alt="">
      </template>
      <template v-else-if="['pdf'].includes(getFileSuffix(file))">
        <img class="el-upload-list__item-thumbnail" src="/file-icons/chrome.svg" alt="">
      </template>
      <template v-else>
        <img class="el-upload-list__item-thumbnail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACl0lEQVR4Xu2WyY7aQBRF+5PyhUkzz7PB2MzjD7FJLzpigwICyRJSmOG1r6FsUxjDQ9klJV1hFvicelS9qre3/8NjDAYDQvr9PvV6Pep2u9TpdKnd6VC73aZWq0XNZpMajSbVGw2q1euk12qk6zXSNJ0azaah6Po3+b1PD8CPx+NNDu4c5BzodDrRcDik8XgMKUNRlNckMHMA9/s97ZCdyI62Itvz52YrsrUkILBcLunz8xdpuv6aBMruJWDD8ewjYBgGLRYL+vnxQWpVM3JcCfznELDgXgKA2+Bbgfl8TrPZjCaTCY1GI1JV1ZAZvgMLzha4V34XWBZIp9NXyReLJDN8B1a7JWDDfcq/cQTwPDVn/nsqMjWrsaB8ocAUMLeaEHDALrhH+YXA2p31xlxHB8rlmQLY59hqD+HS7K8FNrZANpfnCaDJnAVQAQd8vfJdcK/ZmwKri0Amm+MJoMOhuXiD8V3A/WcvBNLZLE8A7dWqgAS+Lvs9uDN7IZDKZHgC6O2owA3Yhjtl94KL2dsCaaYADhbsaRviFmHAhUAylWYK6BBwV+AC9YVvb+BngT0lkimeAI5UuwIS1BPsMXMRdNN4MskTqGraWcAF9Qb7w1ertSUQSzAF1GqV9qbALUyOP/zPRSAaT/AEKqr6QOAMfgS3BWJxnkC5IgtsnPiBJbgQiERjTIFyxdo+AvYQeokb7BYIR6M8AaVctgRkwN14gN0CoQhToKQozwl4AOVAIBiO8ASKJT+B9VNgt0AgFOYJFIolq4MJGAcoxxIIhngCuMPhh/LLXgne884WMO9w9o34L+RHIMgTwB0O1yjcZHCZwHmOIxWnGg4W9Ha0V3Q4NBnsc2w1rHYsOPznKDtmDvj39wBP4J8aX6o3YmLWel+kAAAAAElFTkSuQmCC" alt="">
      </template>
      <div class="el-upload-list__item-info">
        <a class="el-upload-list__item-name">
          <el-icon class="el-icon--document"><Document/></el-icon>
          <span class="el-upload-list__item-file-name" v-text="file.name"></span>
        </a>
      </div>
      <label class="el-upload-list__item-status-label">
        <el-icon class="el-icon--upload-success el-icon--check"><Check/></el-icon>
      </label>
      <el-icon class="el-icon--close" @click.stop="handleRemove(file)"><Close/></el-icon>
      <i class="el-icon--close-tip">按 delete 键可删除</i>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ElUpload, ElIcon } from "element-plus";
import { computed, ref } from "vue";
import { Plus, ZoomIn, Download, Delete, Document, Check, Close } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile, UploadFile } from 'element-plus'

interface Emits {
  (e: 'update:value', v: UploadUserFile[]): void
}

interface Props {
  value: UploadUserFile[]
  disabled?: boolean
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()


const uploadRef = ref<InstanceType<typeof ElUpload>>()

function handlePictureCardPreview(file: UploadFile) {}
function handleDownload(file: UploadFile) {}
function handleRemove(file: UploadFile) {
  uploadRef.value?.handleRemove(file)
}

function getFileSuffix(file: UploadFile): string {
  const idx = file.name.lastIndexOf('.')
  if (idx === -1) {
    return ''
  }

  return file.name.substring(idx + 1)

}

function isImageFile(file: UploadFile) {
  const ext = getFileSuffix(file)
  if (!ext) {
    return false
  }
  const imageTypes = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp']
  return imageTypes.includes(ext)


}

const fileList = computed({
  get() {
    return props.value
  },
  set(v: UploadUserFile[]){
    emits('update:value', v)
  }
})

</script>

<style>
.v-upload.el-upload-list.is-disabled .el-upload-list__item-status-label, .el-upload-list.is-disabled .el-upload-list__item:hover {
  display: flex;
}
</style>