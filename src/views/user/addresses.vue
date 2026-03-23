<template>
  <div class="user-addresses">
    <div class="header">
      <h2>收货地址</h2>
      <el-button type="primary" @click="showDialog()">新增地址</el-button>
    </div>

    <div class="address-list">
      <div v-for="addr in addresses" :key="addr.id" class="address-card">
        <div class="address-info">
          <p class="name">{{ addr.receiverName }} {{ addr.receiverPhone }}</p>
          <p>{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detailAddress }}</p>
          <el-tag v-if="addr.isDefault === 1" type="success" size="small">默认</el-tag>
        </div>
        <div class="address-actions">
          <el-button link type="primary" @click="showDialog(addr)">编辑</el-button>
          <el-button link type="danger" @click="deleteAddress(addr.id)">删除</el-button>
        </div>
      </div>
    </div>

    <el-empty v-if="addresses.length === 0" description="暂无收货地址" />

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑地址' : '新增地址'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="收货人">
          <el-input v-model="form.receiverName" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.receiverPhone" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="form.province" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="区县">
          <el-input v-model="form.district" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.detailAddress" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="form.isDefault" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getAddressList } from '../../api/user'
import { useUserStore } from '../../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()

const addresses = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: 0
})

onMounted(async () => {
  try {
    const res = await getAddressList(userStore.userInfo.id)
    addresses.value = res.data || []
  } catch (error) {
    console.error('获取地址失败', error)
  }
})

const showDialog = (addr = null) => {
  if (addr) {
    isEdit.value = true
    Object.assign(form, addr)
  } else {
    isEdit.value = false
    Object.assign(form, {
      id: null,
      receiverName: '',
      receiverPhone: '',
      province: '',
      city: '',
      district: '',
      detailAddress: '',
      isDefault: 0
    })
  }
  dialogVisible.value = true
}

const submitForm = () => {
  // 简化实现，实际应调用API
  ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
  dialogVisible.value = false
  // 刷新列表
  getAddressList(userStore.userInfo.id).then(res => {
    addresses.value = res.data || []
  })
}

const deleteAddress = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除该地址吗?')
    ElMessage.success('删除成功')
    const res = await getAddressList(userStore.userInfo.id)
    addresses.value = res.data || []
  } catch (e) {
    // 用户取消
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.address-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.address-info p {
  margin-bottom: 5px;
}

.name {
  font-weight: bold;
}
</style>
