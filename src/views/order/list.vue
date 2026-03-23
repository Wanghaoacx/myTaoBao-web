<template>
  <div class="order-list">
    <div class="header">
      <div class="container">
        <span class="logo" @click="$router.push('/')">我的淘宝</span>
        <div class="user-info" v-if="userStore.isLoggedIn">
          <el-dropdown @command="handleCommand">
            <span>{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                <el-dropdown-item command="addresses">收货地址</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="container">
      <h2>我的订单</h2>

      <div class="order-items">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-no">订单号: {{ order.orderNo }}</span>
            <el-tag :type="getStatusType(order.status)">
              {{ getStatusText(order.status) }}
            </el-tag>
          </div>
          <div class="order-body">
            <p>收货人: {{ order.receiverName }}</p>
            <p>收货地址: {{ order.receiverAddress }}</p>
            <p class="order-amount">实付: <span class="price">¥{{ order.payAmount }}</span></p>
          </div>
          <div class="order-footer">
            <el-button v-if="order.status === 0" type="danger" size="small" @click="handlePay(order)">
              去支付
            </el-button>
            <el-button v-if="order.status === 0" size="small" @click="handleCancel(order)">
              取消订单
            </el-button>
          </div>
        </div>
      </div>

      <el-empty v-if="orders.length === 0" description="暂无订单" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderList, cancelOrder } from '../../api/order'
import { useUserStore } from '../../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const orders = ref([])

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  try {
    const res = await getOrderList(userStore.userInfo.id)
    orders.value = res.data || []
  } catch (error) {
    console.error('获取订单列表失败', error)
  }
})

const getStatusText = (status) => {
  const map = {
    0: '待支付',
    1: '已支付',
    2: '已发货',
    3: '已完成',
    4: '已取消'
  }
  return map[status] || '未知'
}

const getStatusType = (status) => {
  const map = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'success',
    4: 'info'
  }
  return map[status] || 'info'
}

const handlePay = (order) => {
  router.push(`/pay/${order.orderNo}`)
}

const handleCancel = async (order) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗?', '提示')
    await cancelOrder(order.id)
    ElMessage.success('订单已取消')
    // 刷新列表
    const res = await getOrderList(userStore.userInfo.id)
    orders.value = res.data || []
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败', error)
    }
  }
}

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/')
  } else if (command === 'addresses') {
    router.push('/user/addresses')
  }
}
</script>

<style scoped>
.order-list {
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

h2 {
  margin-bottom: 20px;
}

.order-card {
  background: #fff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.order-no {
  color: #666;
}

.order-body {
  padding: 15px 0;
}

.order-body p {
  margin-bottom: 8px;
  color: #666;
}

.order-amount {
  font-size: 16px;
}

.price {
  color: #ff5000;
  font-weight: bold;
}

.order-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
