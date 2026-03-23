<template>
  <div class="user-orders">
    <h2>我的订单</h2>

    <div class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <span>订单号: {{ order.orderNo }}</span>
          <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
        </div>
        <div class="order-info">
          <p>收货人: {{ order.receiverName }}</p>
          <p>实付: <span class="price">¥{{ order.payAmount }}</span></p>
        </div>
        <div class="order-actions">
          <el-button v-if="order.status === 0" type="danger" size="small" @click="goPay(order)">
            去支付
          </el-button>
          <el-button v-if="order.status === 0" size="small" @click="handleCancelOrder(order)">
            取消
          </el-button>
        </div>
      </div>
    </div>

    <el-empty v-if="orders.length === 0" description="暂无订单" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderList, cancelOrder as cancelOrderApi } from '../../api/order'
import { useUserStore } from '../../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const orders = ref([])

onMounted(async () => {
  try {
    const res = await getOrderList(userStore.userInfo.id)
    orders.value = res.data || []
  } catch (error) {
    console.error('获取订单失败', error)
  }
})

const getStatusText = (status) => {
  const map = { 0: '待支付', 1: '已支付', 2: '已发货', 3: '已完成', 4: '已取消' }
  return map[status] || '未知'
}

const getStatusType = (status) => {
  const map = { 0: 'warning', 1: 'success', 2: 'info', 3: 'success', 4: 'info' }
  return map[status] || 'info'
}

const goPay = (order) => {
  router.push(`/pay/${order.orderNo}`)
}

const handleCancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确定取消订单吗?')
    await cancelOrderApi(order.id)
    ElMessage.success('已取消')
    const res = await getOrderList(userStore.userInfo.id)
    orders.value = res.data || []
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.user-orders h2 {
  margin-bottom: 20px;
}

.order-card {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.order-info {
  padding: 10px 0;
}

.order-info p {
  margin-bottom: 5px;
}

.price {
  color: #ff5000;
  font-weight: bold;
}

.order-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
