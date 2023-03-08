<template>
  <div style="display: flex; justify-content: flex-start; align-items: center;">
    <el-button circle @click="collapse" style="width: 40px; height: 40px;">
      <SVGIcon style="width: 16px; height: 16px;" name="AsideCollapse" v-if="asideOpened"/>
      <SVGIcon style="width: 16px; height: 16px;" name="AsideOpen" v-if="!asideOpened"/>
    </el-button>
  </div>

  <div style="display: flex; justify-content: flex-end; align-items: center; gap: 10px;">
    <el-dropdown :hide-on-click="false" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-avatar
          shape="circle"
          :size="40"
          fit="cover"
          src="/images/github-icon.png"
          alt="Github"
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
          alt="Gitee"
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
    <div>
      <el-switch v-model="store.dark" :active-icon="DarkIcon" :inactive-icon="LightIcon" inline-prompt />
    </div>
    <el-dropdown :hide-on-click="false" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-avatar
          shape="circle"
          :size="40"
          fit="cover"
          :src="userInfo.avatar"
          alt="avatar"
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
import { inject } from "vue"
import { ElAvatar, ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElSwitch } from "element-plus"
import { useRouter} from "vue-router";
import { uninstallLayoutContentRoute } from "@/router";
import SVGIcon from "@/components/common/SVGIcon.vue";
import { remove } from "@/utils/storage"
import { asideOpenedKey, userInfoKey } from "@/config/app.keys";
import { useIcon } from "@/components/common/util";
import {useSystemStore} from "@/store/sys-config";

const store = useSystemStore()

const DarkIcon = useIcon('Dark')
const LightIcon = useIcon('Light')



const router = useRouter();
const asideOpened = inject(asideOpenedKey)!
const userInfo = inject(userInfoKey)
console.log("userInfo", userInfo)

function collapse() {
  asideOpened.value = !asideOpened.value
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

</style>