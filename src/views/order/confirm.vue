<template>
  <div class="order-confirm">
    <div class="header">
      <div class="container">
        <span class="logo" @click="$router.push('/')">我的淘宝</span>
      </div>
    </div>

    <div class="container">
      <h2>确认订单</h2>

      <!-- 地址选择 -->
      <div class="section">
        <h3>收货地址</h3>
        <div v-if="addresses.length > 0" class="address-list">
          <div
            v-for="addr in addresses"
            :key="addr.id"
            class="address-card"
            :class="{ active: selectedAddressId === addr.id }"
            @click="selectedAddressId = addr.id"
          >
            <div class="address-info">
              <p>{{ addr.receiverName }} {{ addr.receiverPhone }}</p>
              <p>{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detailAddress }}</p>
            </div>
            <el-tag v-if="addr.isDefault === 1" type="success">默认</el-tag>
          </div>
        </div>
        <el-empty v-else description="暂无收货地址" />
      </div>

      <!-- 商品信息 -->
      <div class="section" v-if="product">
        <h3>商品信息</h3>
        <div class="product-item">
          <img :src="product.mainImage || '/placeholder.png'" :alt="product.name" />
          <div class="product-info">
            <h4>{{ product.name }}</h4>
            <p class="price">¥{{ product.price }} x {{ quantity }}</p>
          </div>
          <div class="subtotal">
            <span>小计:</span>
            <span class="price">¥{{ subtotal }}</span>
          </div>
        </div>
      </div>

      <!-- 订单备注 -->
      <div class="section">
        <h3>订单备注</h3>
        <el-input
          v-model="remark"
          type="textarea"
          placeholder="请输入订单备注"
          :rows="3"
        />
      </div>

      <!-- 提交订单 -->
      <div class="submit-bar">
        <div class="total">
          <span>实付金额:</span>
          <span class="price">¥{{ subtotal }}</span>
        </div>
        <el-button type="danger" size="large" @click="handleSubmit" :loading="submitting">
          提交订单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '../../api/product'
import { getAddressList, getDefaultAddress } from '../../api/user'
import { createOrder } from '../../api/order'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const product = ref(null)
const quantity = ref(1)
const addresses = ref([])
const selectedAddressId = ref(null)
const remark = ref('')
const submitting = ref(false)

const subtotal = computed(() => {
  if (!product.value) return 0
  return (product.value.price * quantity.value).toFixed(2)
})

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  // 获取商品信息
  const productId = route.query.productId
  if (productId) {
    try {
      const res = await getProductDetail(productId)
      product.value = res.data
      quantity.value = parseInt(route.query.quantity) || 1
    } catch (error) {
      console.error('获取商品失败', error)
    }
  }

  // 获取地址列表
  try {
    const res = await getAddressList(userStore.userInfo.id)
    addresses.value = res.data || []

    // 设置默认地址
    if (addresses.value.length > 0) {
      const defaultAddr = addresses.value.find(a => a.isDefault === 1)
      selectedAddressId.value = defaultAddr ? defaultAddr.id : addresses.value[0].id
    }
  } catch (error) {
    console.error('获取地址失败', error)
  }
})

const handleSubmit = async () => {
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  if (!product.value) {
    ElMessage.warning('请选择商品')
    return
  }

  submitting.value = true

  try {
    const res = await createOrder({
      userId: userStore.userInfo.id,
      addressId: selectedAddressId.value,
      remark: remark.value,
      items: [{
        productId: product.value.id,
        quantity: quantity.value
      }]
    })

    if (res.code === 200) {
      ElMessage.success('订单创建成功')
      router.push(`/pay/${res.data.orderNo}`)
    }
  } catch (error) {
    console.error('创建订单失败', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.order-confirm {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  padding: 15px 0;
  margin-bottom: 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ff5000;
  cursor: pointer;
}

h2 {
  margin-bottom: 20px;
}

.section {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

h3 {
  margin-bottom: 15px;
  font-size: 16px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.address-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.address-card.active {
  border-color: #ff5000;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.product-item .product-info {
  flex: 1;
}

.product-item .price {
  color: #666;
  margin-top: 5px;
}

.subtotal {
  text-align: right;
}

.subtotal .price {
  color: #ff5000;
  font-size: 18px;
  font-weight: bold;
}

.submit-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.total .price {
  color: #ff5000;
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
}
</style>
