<template>
  <div class="home">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="container">
        <div class="header-left">
          <span class="logo">我的淘宝</span>
        </div>
        <div class="header-right">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-icon><User /></el-icon>
                {{ userStore.userInfo?.nickname || userStore.userInfo?.username }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item command="addresses">收货地址</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" link @click="$router.push('/login')">登录</el-button>
          </template>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="container">
        <el-input
          v-model="keyword"
          placeholder="搜索商品"
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="main-content">
      <div class="container">
        <div class="product-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="$router.push(`/product/${product.id}`)"
          >
            <img :src="product.mainImage || '/placeholder.png'" :alt="product.name" class="product-image" />
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-price">
                <span class="price">¥{{ product.price }}</span>
                <span class="sales">销量: {{ product.salesCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="products.length === 0" description="暂无商品" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, User } from '@element-plus/icons-vue'
import { getIndexProducts } from '../../api/product'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const products = ref([])
const keyword = ref('')

onMounted(async () => {
  try {
    const res = await getIndexProducts()
    products.value = res.data?.products || []
  } catch (error) {
    console.error('获取商品列表失败', error)
  }
})

const handleSearch = () => {
  // 搜索功能待实现
  ElMessage.info('搜索功能开发中')
}

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
  } else if (command === 'orders') {
    router.push('/order/list')
  } else if (command === 'addresses') {
    router.push('/user/addresses')
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 15px 0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ff5000;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.search-bar {
  background: #fff;
  padding: 20px 0;
}

.search-bar .el-input {
  max-width: 600px;
}

.main-content {
  padding: 30px 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #ff5000;
  font-size: 20px;
  font-weight: bold;
}

.sales {
  font-size: 12px;
  color: #999;
}
</style>
