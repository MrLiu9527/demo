# ALL-IN-AI 数字员工平台

该项目是 ALL-IN-AI 数字员工平台。所有的功能和业务由 Cursor 完成！

## 项目简介

这是一个数字员工功能平台，每个数字员工是一个 Agent，根据挂载的工具（Tools）、MCP、Skills 等不同来负责不同的职能。

- **框架**：阿里 AgentScope
- **语言**：Python 3.12
- **数据库**：PostgreSQL
- **API**：FastAPI

## 快速开始

### 1. 安装依赖

```bash
# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/Mac

# 安装依赖
pip install -e ".[dev]"
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 配置数据库和 API Key
```

### 3. 启动 PostgreSQL

```bash
docker run -d \
  --name postgres-allinai \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=all_in_ai \
  -p 5432:5432 \
  postgres:15
```

### 4. 初始化数据库

```bash
python scripts/init_db.py
```

### 5. 启动 API 服务

```bash
# 方式1：使用 uvicorn
uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000

# 方式2：使用脚本
python -m src.api.run

# 方式3：安装后使用命令
all-in-ai
```

API 文档：http://localhost:8000/docs

## API 接口

所有业务 API 都在 `/api/v1/space/{space_id}/` 路径下。

### 认证

目前支持通过 `X-User-Id` Header 传递用户 ID（开发/测试用）：

```bash
curl -H "X-User-Id: <user-uuid>" http://localhost:8000/api/v1/...
```

### Agent API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/space/{spaceId}/agents` | 获取 Agent 列表 |
| GET | `/api/v1/space/{spaceId}/agents/{agentId}` | 获取 Agent 详情 |
| POST | `/api/v1/space/{spaceId}/agents` | 创建 Agent |
| PUT | `/api/v1/space/{spaceId}/agents/{agentId}` | 更新 Agent |
| DELETE | `/api/v1/space/{spaceId}/agents/{agentId}` | 删除 Agent |
| POST | `/api/v1/space/{spaceId}/agents/{agentId}/publish` | 发布 Agent |
| POST | `/api/v1/space/{spaceId}/agents/{agentId}/clone` | 克隆 Agent |

### Conversation API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/space/{spaceId}/conversations` | 获取会话列表 |
| POST | `/api/v1/space/{spaceId}/conversations` | 创建会话 |
| GET | `/api/v1/space/{spaceId}/conversations/{id}` | 获取会话详情 |
| PUT | `/api/v1/space/{spaceId}/conversations/{id}` | 更新会话 |
| DELETE | `/api/v1/space/{spaceId}/conversations/{id}` | 删除会话 |
| GET | `/api/v1/space/{spaceId}/conversations/{id}/messages` | 获取消息列表 |
| POST | `/api/v1/space/{spaceId}/conversations/{id}/end` | 结束会话 |

### Chat API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/space/{spaceId}/chat/{agentId}` | 快速聊天（自动创建会话） |
| POST | `/api/v1/space/{spaceId}/chat/conversations/{id}/messages` | 在会话中发送消息 |

### Space API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/spaces` | 获取空间列表 |
| POST | `/api/v1/spaces` | 创建空间 |
| GET | `/api/v1/spaces/{spaceId}` | 获取空间详情 |
| PUT | `/api/v1/spaces/{spaceId}` | 更新空间 |
| DELETE | `/api/v1/spaces/{spaceId}` | 删除空间 |
| GET | `/api/v1/spaces/{spaceId}/members` | 获取成员列表 |
| POST | `/api/v1/spaces/{spaceId}/members` | 添加成员 |
| PUT | `/api/v1/spaces/{spaceId}/members/{userId}` | 更新成员角色 |
| DELETE | `/api/v1/spaces/{spaceId}/members/{userId}` | 移除成员 |

## 示例：与 Agent 聊天

```bash
# 1. 获取 admin 用户 ID（从数据库或初始化日志）
USER_ID="your-admin-user-id"

# 2. 获取系统空间 ID
SPACE_ID="your-system-space-id"

# 3. 查看可用的 Agent
curl -H "X-User-Id: $USER_ID" \
  "http://localhost:8000/api/v1/space/$SPACE_ID/agents"

# 4. 与通用助手聊天
curl -X POST \
  -H "X-User-Id: $USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，请介绍一下你自己"}' \
  "http://localhost:8000/api/v1/space/$SPACE_ID/chat/general_assistant"
```

## 项目结构

```
/workspace
├── src/
│   ├── api/                    # API 层
│   │   ├── app.py              # FastAPI 应用
│   │   ├── deps/               # 依赖注入
│   │   ├── schemas/            # Pydantic Schema
│   │   └── v1/endpoints/       # API 端点
│   ├── agents/                 # Agent 模块
│   ├── skills/                 # Skills 模块
│   ├── models/                 # 数据模型
│   ├── services/               # 服务层
│   ├── db/                     # 数据库
│   └── core/                   # 核心配置
├── tests/                      # 测试
├── configs/                    # 配置文件
├── migrations/                 # 数据库迁移
└── scripts/                    # 脚本
```

## 数据库表

| 表名 | 说明 |
|------|------|
| users | 用户 |
| spaces | 空间 |
| space_members | 空间成员 |
| agent_configs | Agent 配置 |
| conversations | 会话 |
| messages | 消息 |

## 文档

- [Skills 开发规范](docs/SKILLS_DEVELOPMENT_GUIDE.md)

## License

MIT
