# ALL-IN-AI 数字员工平台

该项目是 ALL-IN-AI 数字员工平台。所有的功能和业务由 Cursor 完成！

## 项目简介

这是一个数字员工功能平台，每个数字员工是一个 Agent，根据挂载的工具（Tools）、MCP、Skills 等不同来负责不同的职能。

- **框架**：阿里 AgentScope
- **语言**：Python 3.12
- **数据库**：PostgreSQL

## 核心特性

### 多租户架构

- **平台级 Agent**：系统提供的通用数字员工，所有用户可用
- **空间级 Agent**：用户自定义的数字员工，仅空间成员可用
- **空间（Space）**：用户的工作区，可以是个人空间或团队空间

### 可配置的 Agent

所有 Agent 配置存储在数据库中，支持：
- 动态配置系统提示词
- 选择不同的 LLM 模型
- 挂载 Skills 和 Tools
- 自定义行为参数

### 会话持久化

- 会话和消息自动保存到 PostgreSQL
- 支持多轮对话历史
- Token 使用统计
- 会话上下文快照

## 项目结构

```
/workspace
├── src/
│   ├── agents/                 # Agent 模块
│   │   ├── base.py             # Agent 基类
│   │   ├── factory.py          # Agent 工厂
│   │   ├── manager.py          # Agent 管理器
│   │   ├── registry.py         # Agent 注册中心
│   │   └── implementations/    # Agent 实现
│   │       ├── configurable_agent.py
│   │       ├── dialog_agent.py
│   │       └── tool_agent.py
│   │
│   ├── skills/                 # Skills 技能模块
│   │   ├── base/               # Skill 基础设施
│   │   │   ├── decorator.py    # @skill 装饰器
│   │   │   ├── registry.py     # Skill 注册中心
│   │   │   └── response.py     # Skill 响应定义
│   │   ├── common/             # 通用 Skills
│   │   └── domain/             # 领域特定 Skills
│   │
│   ├── models/                 # 数据模型
│   │   ├── user.py             # 用户模型
│   │   ├── space.py            # 空间模型
│   │   ├── agent.py            # Agent 配置模型
│   │   └── conversation.py     # 会话和消息模型
│   │
│   ├── services/               # 服务层
│   │   ├── user_service.py
│   │   ├── space_service.py
│   │   ├── agent_service.py
│   │   ├── conversation_service.py
│   │   └── message_service.py
│   │
│   ├── db/                     # 数据库
│   ├── core/                   # 核心配置
│   ├── tools/                  # Tools 工具
│   ├── mcp/                    # MCP 协议
│   └── utils/                  # 工具函数
│
├── tests/                      # 测试
├── configs/                    # 配置文件
├── migrations/                 # 数据库迁移
├── scripts/                    # 脚本
└── docs/                       # 文档
```

## 数据库表结构

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| spaces | 空间表（工作区） |
| space_members | 空间成员关系表 |
| agent_configs | Agent 配置表 |
| conversations | 会话表 |
| messages | 消息表 |

## 快速开始

### 1. 安装依赖

```bash
# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate  # Windows

# 安装依赖
pip install -e ".[dev]"
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置数据库和 API Key
```

### 3. 启动 PostgreSQL

```bash
# 使用 Docker
docker run -d \
  --name postgres-allinai \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=all_in_ai \
  -p 5432:5432 \
  postgres:15

# 或使用现有的 PostgreSQL 实例
```

### 4. 初始化数据库

```bash
# 创建表并初始化平台级 Agent
python scripts/init_db.py

# 可选：重建数据库
python scripts/init_db.py --drop
```

### 5. 运行示例

```bash
python -m src.main
```

## 核心概念

### Agent（数字员工）

Agent 是一个具有特定职能的智能代理。系统预置了两个平台级 Agent：

1. **通用助手** (`general_assistant`)
   - 类型：对话型
   - 用途：回答问题、提供建议

2. **工具助手** (`tool_assistant`)
   - 类型：工具调用型
   - 用途：使用工具完成复杂任务

### 使用 Agent

```python
from src.agents import agent_manager

# 初始化管理器
await agent_manager.initialize()

# 获取平台级 Agent
agent = await agent_manager.get_platform_agent("general_assistant")

# 创建会话
context = await agent_manager.create_conversation(
    agent_id="general_assistant",
    space_id=space_id,
    user_id=user_id,
)

# 对话
response = await agent_manager.chat(
    agent_id="general_assistant",
    space_id=space_id,
    conversation_id=context.conversation_id,
    message="你好！",
)
```

### 创建自定义 Agent

```python
from src.db.session import async_session_scope
from src.services.agent_service import AgentConfigService
from src.models.agent import AgentType, AgentScope, AgentStatus

async with async_session_scope() as session:
    service = AgentConfigService(session)
    
    # 创建空间级 Agent
    config = await service.create(
        agent_id="my_assistant",
        name="我的助手",
        description="自定义的 AI 助手",
        space_id=my_space_id,
        type=AgentType.DIALOG,
        scope=AgentScope.SPACE,
        status=AgentStatus.PUBLISHED,
        system_prompt="你是一个专业的助手...",
        model_provider="dashscope",
        model_name="qwen-turbo",
        skills=["common.text.extract_keywords"],
    )
```

### Skill（技能）

Skill 是 Agent 的能力模块：

```python
from src.skills import skill, SkillResponse

@skill(
    skill_id="my.custom.skill",
    name="自定义技能",
    description="这是一个自定义技能",
)
def my_skill(param1: str) -> SkillResponse:
    result = process(param1)
    return SkillResponse.success(content=result)
```

## 测试

```bash
# 运行所有测试
pytest

# 运行特定测试
pytest tests/skills/

# 生成覆盖率报告
pytest --cov=src --cov-report=html
```

## 文档

- [Skills 开发规范](docs/SKILLS_DEVELOPMENT_GUIDE.md)

## License

MIT
