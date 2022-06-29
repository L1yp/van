<template>
  <div style="display: flex; justify-content: flex-start; align-items: center;">
    <el-button circle @click="collapse" style="width: 40px; height: 40px;">
      <SVGIcon style="width: 16px; height: 16px;" name="AsideCollapse" v-if="!asideCollapsed"/>
      <SVGIcon style="width: 16px; height: 16px;" name="AsideOpen" v-if="asideCollapsed"/>
    </el-button>
  </div>

  <div style="display: flex; justify-content: flex-end; align-items: center;">
    <el-dropdown :hide-on-click="false" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-avatar
          shape="circle"
          :size="40"
          fit="cover"
          src="/images/github-icon.png"
        >
        </el-avatar>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="github-van">前端</el-dropdown-item>
          <el-dropdown-item command="github-van-app">后端</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown :hide-on-click="false" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-avatar
          shape="circle"
          :size="40"
          fit="cover"
          src="https://gitee.com/assets/favicon.ico"
        >
        </el-avatar>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="gitee-van">前端</el-dropdown-item>
          <el-dropdown-item command="gitee-van-app">后端</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown :hide-on-click="false" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-avatar
          shape="circle"
          :size="40"
          fit="cover"
          :src="userInfo.avatar"
        >
        </el-avatar>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div style="margin-left: 5px;" v-text="userInfo.nickname"></div>
  </div>
</template>

<script lang="ts" setup>
import {inject, Ref} from "vue"
import {ElAvatar, ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu} from "element-plus"
import {useRouter} from "vue-router";
import {uninstallLayoutContentRoute} from "@/router";
import SVGIcon from "@/components/common/SVGIcon.vue";
import {remove} from "@/utils/storage"
import {asideCollapsedKey, userInfoKey} from "@/config/app.keys";

const router = useRouter();
const asideCollapsed = inject<Ref<boolean>>(asideCollapsedKey)!
const userInfo = inject(userInfoKey)
console.log("userInfo", userInfo)

function collapse() {
  asideCollapsed.value = !asideCollapsed.value;
}

function handleCommand(command: string) {
  if (command === "profile") {
    router.push({path: "/user/profile"});
  }
  else if (command === "logout") {
    uninstallLayoutContentRoute();
    remove("isLogin");
    remove("tags");
    router.replace({
      path: "/app/login"
    });
  }
  else if (command === 'gitee-van') {
    window.open('https://gitee.com/L1yp/van')
  }
  else if (command === 'gitee-van-app') {
    window.open('https://gitee.com/L1yp/van-app')
  }
  else if (command === 'github-van') {
    window.open('https://github.com/L1yp/van')
  }
  else if (command === 'github-van-app') {
    window.open('https://github.com/L1yp/van-app')

  }
}

</script>

<style scoped>
:deep(.el-dropdown + .el-dropdown) {
  margin-left: 10px;
}
</style>