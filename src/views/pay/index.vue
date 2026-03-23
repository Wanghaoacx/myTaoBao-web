<template>
  <div class="pay-page">
    <div class="header">
      <div class="container">
        <span class="logo" @click="$router.push('/')">我的淘宝</span>
      </div>
    </div>

    <div class="container">
      <div class="pay-content" v-if="order">
        <h2>订单支付</h2>

        <div class="order-info">
          <p>订单编号: {{ order.orderNo }}</p>
          <p>收货人: {{ order.receiverName }}</p>
          <p>收货地址: {{ order.receiverAddress }}</p>
        </div>

        <div class="amount-section">
          <span>支付金额:</span>
          <span class="amount">¥{{ order.payAmount }}</span>
        </div>

        <div class="pay-method">
          <h3>选择支付方式</h3>
          <el-radio-group v-model="payType">
            <el-radio :label="1">
              <span class="pay-icon">支付宝</span>
            </el-radio>
            <el-radio :label="2">
              <span class="pay-icon">微信支付</span>
            </el-radio>
            <el-radio :label="3">
              <span class="pay-icon">银联支付</span>
            </el-radio>
          </el-radio-group>
        </div>

        <div class="pay-actions">
          <el-button type="danger" size="large" @click="handlePay" :loading="paying">
            立即支付
          </el-button>
        </div>
      </div>

      <el-empty v-else description="订单不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { simulatePay } from '../../api/order'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const order = ref(null)
const payType = ref(1)
const paying = ref(false)

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  // 模拟获取订单信息
  order.value = {
    orderNo: route.params.orderNo,
    payAmount: '0.01',
    receiverName: '张三',
    receiverAddress: '北京市朝阳区xxx'
  }
})

const handlePay = async () => {
  paying.value = true

  try {
    // 模拟支付
    await simulatePay(order.value.orderNo)

    ElMessage.success('支付成功')
    router.push('/order/list')
  } catch (error) {
    console.error('支付失败', error)
  } finally {
    paying.value = false
  }
}
</script>

<style scoped>
.pay-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  padding: 15px 0;
  margin-bottom: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ff5000;
  cursor: pointer;
}

.pay-content {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
}

h2 {
  margin-bottom: 20px;
}

.order-info {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.order-info p {
  margin-bottom: 10px;
  color: #666;
}

.amount-section {
  text-align: center;
  margin: 30px 0;
  font-size: 18px;
}

.amount-section .amount {
  color: #ff5000;
  font-size: 36px;
  font-weight: bold;
  margin-left: 15px;
}

.pay-method {
  margin: 30px 0;
}

.pay-method h3 {
  margin-bottom: 15px;
}

.pay-icon {
  font-size: 16px;
}

.pay-actions {
  text-align: center;
  margin-top: 30px;
}
</style>
