# 文迹 WenJi

**把山河卷进手机，走一路，点一路。**

文迹是一款**基于地理位置的文化遗产探索 App**：打开地图，走向一座座文化地标，靠近即点亮；扫一扫文物，浏览器里 AR 立体呈现；逛完写篇游记、集几枚徽章，把每一次路过变成你的文化足迹。

> 本仓库是**无 AI 的探索版**：暂不接入大模型与知识库问答，聚焦地图、AR、游记、徽章这些真正"走起来"的体验。核心功能完整可用，轻装上阵。

## 你会在里面遇到什么

| 体验 | 是什么 |
| --- | --- |
| 文化地图 | 按 GPS 定位展示周边地标，走进范围自动点亮，攒成你的文化足迹 |
| WebAR 展示 | 浏览器直接扫描文物，3D 模型立体呈现，不用装 App |
| 游记 | 把所见所感写成一篇篇游记，随手记录文化探索心得 |
| 徽章与等级 | 逛得越多，经验、徽章、等级越长，像集邮一样有收集欲 |
| 用户系统 | 手机号 + 验证码登录，个人中心管理一切 |

> 原项目里的 **AI 智能导游 / RAG 非遗问答** 等能力，本仓库已按降级方式关闭（代码保留、接口未启用），后续接入有效通义千问 Key 即可恢复。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | Vue 3 + Vite、Pinia、Element Plus、Tailwind CSS |
| 地图 | 高德地图 API + Leaflet |
| AR | MindAR.js + Three.js |
| 后端 | Spring Boot 3、MyBatis-Plus、JWT |
| 存储 | MySQL 8（业务）+ Redis 7（缓存 / 向量 / 锁 / 记忆） |

## 跑起来

前置：JDK 17+、MySQL 8+、Redis 7.x（需向量搜索）、Node 20+。

### 1. 数据库

建库 `wenji`（utf8mb4），依次执行 `db/` 下的建表与数据脚本，初始化 11 张表。

### 2. 后端

```bash
cd backend
mvn spring-boot:run
# 默认 8080；被占用时可指定：
# mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8082
```

接口文档：http://localhost:8080/doc.html

### 3. 前端

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

### 生产部署（无 AI）

- 后端：`mvn package -DskipTests`，`java -jar target/backend-0.0.1-SNAPSHOT.jar --server.port=8082`
- 前端：`npm run build` 后用 `node server.cjs`（默认 8090）托管 `dist/`，并把 `/api` 反向代理到后端

## 项目结构（速览）

```
WenJi/
├── backend/            # Spring Boot 服务端（Controller / Service / Repository / Config / Interceptor）
├── frontend/           # Vue 3 前端（views / api / components / stores / router）
├── db/                 # 建表与数据初始化脚本
├── docker-compose.yml  # 可选容器编排
└── README.md
```

## 说明

- AI 相关代码（LangChain4j / RAG）保留在仓库但默认关闭：`application.yml` 中 `app.ai.enabled=false`；需要恢复时，填入 `QWEN_API_KEY` 并改为 `true`，重新打包即可，前端无需改动。
- 许可证：MIT
