# 我的淘宝前端项目

## 项目概述

Vue 3 电商平台前端应用，与 myTaoBao 后端微服务配合使用。

## 技术栈

- **框架**: Vue 3 + Vite
- **UI组件**: Element Plus
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **路由**: Vue Router 4

## 项目结构

```
src/
├── api/                    # API 接口封装
│   ├── index.js           # axios 实例
│   ├── user.js            # 用户相关 API
│   ├── product.js         # 商品相关 API
│   └── order.js           # 订单相关 API
├── views/                 # 页面视图
│   ├── home/              # 首页
│   │   └── index.vue
│   ├── product/           # 商品详情页
│   │   └── index.vue
│   ├── order/             # 订单页面
│   │   ├── confirm.vue    # 订单确认页
│   │   └── list.vue       # 订单列表页
│   ├── pay/               # 支付页
│   │   └── index.vue
│   └── user/              # 用户中心
│       ├── index.vue       # 用户中心布局
│       ├── login.vue       # 登录/注册页
│       ├── orders.vue      # 我的订单
│       └── addresses.vue   # 收货地址
├── router/                # 路由配置
│   └── index.js
├── stores/                # Pinia 状态管理
│   └── user.js            # 用户状态
├── assets/               # 静态资源
├── components/           # 公共组件
├── App.vue
└── main.js
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| / | Home | 首页 - 商品列表 |
| /product/:id | Product | 商品详情 |
| /order/confirm | OrderConfirm | 订单确认页 |
| /order/list | OrderList | 订单列表 |
| /pay/:orderNo | Pay | 支付页 |
| /user | UserCenter | 用户中心 |
| /user/orders | UserOrders | 我的订单 |
| /user/addresses | UserAddresses | 收货地址 |
| /login | Login | 登录/注册 |

## 启动方式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 开发服务器

- 本地地址: http://localhost:3000
- 代理后端: http://localhost:8206 (trade-service)

## API 代理配置

Vite 配置文件中的代理将 `/api` 前缀的请求转发到 `http://localhost:8206` (trade-service)。

实际 API 调用示例:
- `GET /api/trade/index/products` -> `http://localhost:8206/trade/index/products`
- `POST /api/trade/order/create` -> `http://localhost:8206/trade/order/create`

## 状态管理

### user store
- `userInfo`: 用户信息
- `token`: 登录令牌
- `isLoggedIn`: 登录状态
- `setUserInfo(info, token)`: 设置用户信息
- `logout()`: 退出登录

## 功能说明

### 核心交易流程（按讨论决策）
1. 用户浏览商品 -> 首页/商品详情
2. 选择商品 -> 立即购买
3. 确认订单 -> 选择收货地址
4. 提交订单 -> 跳转支付页
5. 模拟支付 -> 订单完成

### 用户功能
- 登录/注册
- 查看订单列表
- 管理收货地址

### 注意事项
- 购物车功能暂未实现（按讨论决策）
- 用户认证为简化版本，无 Spring Security
- 支付为模拟实现
