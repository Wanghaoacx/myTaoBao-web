<template>
  <div class="user-center">
    <div class="header">
      <div class="container">
        <span class="logo" @click="$router.push('/')">我的淘宝</span>
      </div>
    </div>

    <div class="container">
      <div class="user-layout">
        <div class="sidebar">
          <el-menu :default-active="activeMenu" @select="handleMenuSelect">
            <el-menu-item index="orders">
              <el-icon><List /></el-icon>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="addresses">
              <el-icon><Location /></el-icon>
              <span>收货地址</span>
            </el-menu-item>
          </el-menu>
        </div>

        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { List, Location } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('orders')

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
  }
})

watch(() => route.path, (path) => {
  if (path.includes('addresses')) {
    activeMenu.value = 'addresses'
  } else {
    activeMenu.value = 'orders'
  }
}, { immediate: true })

const handleMenuSelect = (index) => {
  router.push(`/user/${index}`)
}
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  padding: 15px 0;
  margin-bottom: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ff5000;
  cursor: pointer;
}

.user-layout {
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 200px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}
</style>
