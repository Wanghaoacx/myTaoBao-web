<template>
  <div class="product-detail">
    <div class="header">
      <div class="container">
        <div class="header-left">
          <span class="logo" @click="$router.push('/')">我的淘宝</span>
        </div>
        <div class="header-right">
          <el-button type="primary" link @click="$router.push('/login')" v-if="!userStore.isLoggedIn">登录</el-button>
          <span v-else class="user-name" @click="$router.push('/user')">
            {{ userStore.userInfo?.nickname || userStore.userInfo?.username }}
          </span>
        </div>
      </div>
    </div>

    <div class="container" v-if="product">
      <div class="product-main">
        <div class="product-image">
          <img :src="product.mainImage || '/placeholder.png'" :alt="product.name" />
        </div>
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-desc">{{ product.description }}</p>
          <div class="price-section">
            <span class="label">价格</span>
            <span class="price">¥{{ product.price }}</span>
          </div>
          <div class="stock-section">
            <span class="label">库存</span>
            <span class="stock">{{ product.stock }} 件</span>
          </div>
          <div class="quantity-section">
            <span class="label">数量</span>
            <el-input-number v-model="quantity" :min="1" :max="product.stock" />
          </div>
          <div class="action-buttons">
            <el-button type="danger" size="large" @click="handleBuyNow">立即购买</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else description="商品不存在" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '../../api/product'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const product = ref(null)
const quantity = ref(1)

onMounted(async () => {
  try {
    const res = await getProductDetail(route.params.id)
    product.value = res.data
  } catch (error) {
    console.error('获取商品详情失败', error)
  }
})

const handleBuyNow = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  // 直接跳转到下单页
  router.push({
    path: '/order/confirm',
    query: {
      productId: product.value.id,
      quantity: quantity.value
    }
  })
}
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 15px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  cursor: pointer;
}

.product-main {
  display: flex;
  gap: 40px;
  padding: 30px 0;
}

.product-image {
  width: 400px;
  height: 400px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
}

.product-name {
  font-size: 24px;
  margin-bottom: 15px;
}

.product-desc {
  color: #666;
  margin-bottom: 30px;
}

.price-section, .stock-section, .quantity-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.label {
  width: 80px;
  color: #666;
}

.price {
  color: #ff5000;
  font-size: 32px;
  font-weight: bold;
}

.stock {
  color: #666;
}

.action-buttons {
  margin-top: 40px;
}
</style>
