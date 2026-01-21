# 🔐 GoogleManager

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask" alt="Flask">
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS">
</p>

<p align="center">
  <b>一款专业的谷歌账号资产管理系统</b>
  <br>
  <sub>支持批量导入、2FA验证码生成、账号状态管理、修改历史追踪等功能</sub>
</p>

---

## ✨ 功能特性

### 🔑 账号管理
- **批量导入** - 支持多种分隔符格式（`——`、`----`、`--`）快速导入账号
- **单个导入** - 表单式单个账号录入
- **智能搜索** - 按邮箱或备注内容搜索账号
- **状态筛选** - 筛选已售出/未售出账号

### 🛡️ 2FA 验证码
- **一键生成** - 点击即可获取当前 TOTP 验证码
- **实时倒计时** - 显示验证码剩余有效时间
- **进度条显示** - 直观展示验证码过期进度

### 📋 快捷复制
- 单独复制邮箱、密码、恢复邮箱
- **一键复制全部** - 快速复制完整账号信息

### 📊 出售状态管理
- 标记账号为"已售出"/"未售出"
- 切换回未售出需二次确认
- 状态变更历史记录

### 📜 修改历史
- 记录密码、2FA密钥、恢复邮箱、出售状态的每次修改
- 抽屉式面板展示修改历史
- 修改前后对比显示

### 🔒 安全特性
- **管理员密码保护** - 需密码登录才能访问系统
- **7天登录有效期** - 登录后7天内无需重复登录
- **IP 封禁机制** - 连续3次密码错误，封禁该 IP 24小时
- **盐值验证** - 登录请求携带动态盐值防重放攻击

### 🎨 界面设计
- **暗色/亮色模式** - 支持一键切换主题
- **响应式布局** - 适配不同屏幕尺寸
- **现代化 UI** - 采用 TailwindCSS 打造精美界面

---

## 📸 界面预览

<details>
<summary>点击展开预览图</summary>

### 登录页面
![登录页面](./screenshots/login.png)

### 账号列表
![账号列表](./screenshots/account-list.png)

### 批量导入
![批量导入]<img width="2550" height="1292" alt="image" src="https://github.com/user-attachments/assets/1889262e-5510-4a20-8b8f-faaf3e58d030" />
<img width="2550" height="1292" alt="image" src="https://github.com/user-attachments/assets/5132326f-9019-46fd-9d39-1e784b8b69cb" />


### 修改历史
![修改历史]<img width="2550" height="1292" alt="image" src="https://github.com/user-attachments/assets/a0befb6a-269c-4c8c-8320-5a98c4a34c54" />


</details>

---

## 🚀 快速开始

### 环境要求
- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/google-manager.git
cd google-manager
```

2. **安装后端依赖**
```bash
pip install -r requirements.txt
```

3. **安装前端依赖**
```bash
cd frontend
npm install
```

4. **构建前端**
```bash
npm run build
cd ..
```

5. **启动服务**
```bash
python run.py
```

6. **访问系统**
打开浏览器访问 `http://localhost:8002`

---

## 📁 项目结构

```
GOO成品号管理/
├── app/                      # 后端应用
│   ├── models/               # 数据模型
│   │   ├── account.py        # 账号模型
│   │   └── account_history.py # 历史记录模型
│   ├── routes/               # API 路由
│   │   └── api.py
│   ├── services/             # 业务逻辑
│   │   ├── account_service.py
│   │   └── auth_service.py   # 认证服务
│   └── utils/                # 工具函数
│       └── totp.py           # TOTP 生成
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/       # React 组件
│   │   ├── hooks/            # 自定义 Hooks
│   │   └── services/         # API 服务
│   └── ...
├── static/                   # 静态文件（构建输出）
├── instance/                 # 数据库文件
├── run.py                    # 启动脚本
└── requirements.txt          # Python 依赖
```

---

## ⚙️ 配置说明

### 修改管理员密码

编辑 `app/services/auth_service.py`：

```python
ADMIN_PASSWORD = "你的新密码"
```

### 修改服务端口

编辑 `run.py`：

```python
app.run(host='0.0.0.0', port=8002)  # 修改 port 值
```

### 修改登录有效期

编辑 `frontend/src/App.jsx`：

```javascript
const sevenDaysMs = 7 * 24 * 60 * 60 * 1000; // 修改为你需要的天数
```

---

## 🔧 开发指南

### 前端开发模式

```bash
cd frontend
npm run dev
```

### 前端构建

```bash
npm run build
```

### 数据库迁移

项目使用 SQLite，新增表结构时运行对应的迁移脚本：

```bash
python migrate_db.py       # 账号表迁移
python migrate_history.py  # 历史记录表迁移
```

---

## 📝 导入格式

支持以下分隔符格式：

```
邮箱——密码——恢复邮箱——2FA密钥——备注
邮箱----密码----恢复邮箱----2FA密钥----备注
邮箱--密码--恢复邮箱--2FA密钥--备注
```

其中：
- **邮箱** 和 **密码** 为必填
- **恢复邮箱**、**2FA密钥**、**备注** 可选

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 |
| UI 样式 | TailwindCSS |
| 图标库 | Lucide React |
| 构建工具 | Vite |
| 后端框架 | Flask |
| 数据库 | SQLite |
| ORM | SQLAlchemy |

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## ⭐ 如果觉得有用，欢迎 Star！

<p align="center">
  Made with ❤️ for Google Account Management
</p>


