# Skills 开发规范

> **项目名称**：ALL-IN-AI  
> **项目描述**：数字员工功能平台，每个数字员工是一个 Agent，根据挂载的工具（Tools）、MCP、Skills 等不同来负责不同的职能  
> **使用框架**：阿里 AgentScope  
> **开发语言**：Python 3.12

## 目录

1. [概述](#概述)
2. [AgentScope 框架简介](#agentscope-框架简介)
3. [目录结构](#目录结构)
4. [命名规范](#命名规范)
5. [Skill 定义规范](#skill-定义规范)
6. [代码风格](#代码风格)
7. [文档规范](#文档规范)
8. [测试规范](#测试规范)
9. [版本管理](#版本管理)
10. [最佳实践](#最佳实践)

---

## 概述

本文档定义了 ALL-IN-AI 数字员工平台中 Skills（技能模块）的开发规范。

### 核心概念

在 ALL-IN-AI 平台中：

- **Agent（数字员工）**：具有特定职能的智能代理，可以执行任务、与用户交互
- **Skills（技能）**：Agent 具备的能力模块，封装了特定的功能逻辑
- **Tools（工具）**：可被 Agent 调用的外部工具或 API
- **MCP（Model Context Protocol）**：模型上下文协议，用于扩展 Agent 能力

### 什么是 Skill？

Skill 是一个封装了特定功能逻辑的 Python 模块，具有以下特点：

- **独立性**：每个 Skill 应该是自包含的，有明确的输入和输出
- **可复用性**：设计时应考虑在不同 Agent 之间的复用
- **可组合性**：多个 Skills 可以组合使用，形成更复杂的能力
- **可测试性**：每个 Skill 都应该有对应的测试用例
- **兼容性**：与 AgentScope 框架无缝集成

---

## AgentScope 框架简介

[AgentScope](https://github.com/modelscope/agentscope) 是阿里开源的多智能体框架，支持：

- 多种 Agent 类型（对话、任务、工具使用等）
- 灵活的消息传递机制
- 服务函数（Service Functions）机制用于扩展能力
- 支持多种 LLM 后端

### AgentScope 中的 Service（服务函数）

在 AgentScope 中，Skills 通常以 **Service Function** 的形式实现：

```python
from agentscope.service import ServiceResponse, ServiceExecStatus

def my_skill(param1: str, param2: int) -> ServiceResponse:
    """
    技能描述
    
    Args:
        param1: 参数1描述
        param2: 参数2描述
        
    Returns:
        ServiceResponse: 执行结果
    """
    try:
        # 执行逻辑
        result = do_something(param1, param2)
        return ServiceResponse(
            status=ServiceExecStatus.SUCCESS,
            content=result
        )
    except Exception as e:
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content=str(e)
        )
```

---

## 目录结构

```
/workspace
├── src/
│   ├── agents/                    # Agent 定义
│   │   ├── __init__.py
│   │   ├── base_agent.py          # 基础 Agent 类
│   │   └── digital_employees/     # 数字员工 Agent
│   │       ├── __init__.py
│   │       ├── customer_service.py    # 客服数字员工
│   │       ├── data_analyst.py        # 数据分析数字员工
│   │       └── content_creator.py     # 内容创作数字员工
│   │
│   ├── skills/                    # Skills 根目录
│   │   ├── __init__.py            # Skills 统一导出入口
│   │   ├── base.py                # 基础 Skill 类/装饰器
│   │   ├── registry.py            # Skill 注册中心
│   │   │
│   │   ├── common/                # 通用 Skills
│   │   │   ├── __init__.py
│   │   │   ├── text_processing.py     # 文本处理
│   │   │   ├── data_conversion.py     # 数据转换
│   │   │   └── file_operations.py     # 文件操作
│   │   │
│   │   ├── communication/         # 通信相关 Skills
│   │   │   ├── __init__.py
│   │   │   ├── email.py               # 邮件发送
│   │   │   ├── sms.py                 # 短信发送
│   │   │   └── notification.py        # 通知推送
│   │   │
│   │   ├── data/                  # 数据处理 Skills
│   │   │   ├── __init__.py
│   │   │   ├── database.py            # 数据库操作
│   │   │   ├── analytics.py           # 数据分析
│   │   │   └── visualization.py       # 数据可视化
│   │   │
│   │   ├── integration/           # 外部集成 Skills
│   │   │   ├── __init__.py
│   │   │   ├── api_client.py          # API 调用
│   │   │   ├── webhook.py             # Webhook 处理
│   │   │   └── third_party/           # 第三方服务集成
│   │   │       ├── __init__.py
│   │   │       ├── dingtalk.py        # 钉钉
│   │   │       ├── wechat.py          # 微信
│   │   │       └── feishu.py          # 飞书
│   │   │
│   │   └── domain/                # 领域特定 Skills
│   │       ├── __init__.py
│   │       ├── customer_service/      # 客服领域
│   │       ├── finance/               # 财务领域
│   │       ├── hr/                    # 人力资源领域
│   │       └── marketing/             # 营销领域
│   │
│   ├── tools/                     # Tools 定义
│   │   ├── __init__.py
│   │   ├── base.py                # 基础 Tool 类
│   │   └── ...
│   │
│   ├── mcp/                       # MCP 相关
│   │   ├── __init__.py
│   │   ├── protocols.py           # 协议定义
│   │   └── handlers.py            # 处理器
│   │
│   └── utils/                     # 工具函数
│       ├── __init__.py
│       ├── validators.py          # 验证器
│       ├── formatters.py          # 格式化器
│       └── helpers.py             # 辅助函数
│
├── tests/                         # 测试目录
│   ├── __init__.py
│   ├── conftest.py                # pytest 配置
│   ├── skills/                    # Skills 测试
│   │   ├── __init__.py
│   │   ├── test_common.py
│   │   ├── test_communication.py
│   │   └── ...
│   └── agents/                    # Agents 测试
│
├── docs/                          # 文档目录
│   ├── skills/                    # Skills 文档
│   │   ├── README.md              # Skills 总览
│   │   └── api/                   # API 文档
│   └── SKILLS_DEVELOPMENT_GUIDE.md
│
├── configs/                       # 配置文件
│   ├── agents/                    # Agent 配置
│   └── skills/                    # Skill 配置
│
├── requirements.txt               # 项目依赖
├── pyproject.toml                 # 项目配置
└── README.md
```

---

## 命名规范

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Skill 模块文件 | snake_case | `text_processing.py` |
| 测试文件 | `test_` + 模块名 | `test_text_processing.py` |
| 配置文件 | snake_case + `.yaml`/`.json` | `skill_config.yaml` |

### 函数/类命名

```python
# Skill 函数名：snake_case，动词开头
def send_email(to: str, subject: str, body: str) -> ServiceResponse:
    pass

def analyze_data(data: pd.DataFrame) -> ServiceResponse:
    pass

def extract_keywords(text: str, top_k: int = 10) -> ServiceResponse:
    pass

# Skill 类名：PascalCase + Skill 后缀
class EmailSkill:
    pass

class DataAnalysisSkill:
    pass

# 常量名：UPPER_SNAKE_CASE
MAX_RETRY_COUNT = 3
DEFAULT_TIMEOUT = 30
SUPPORTED_FILE_TYPES = ['pdf', 'docx', 'xlsx']

# 私有函数/变量：单下划线前缀
def _validate_input(data: dict) -> bool:
    pass

_cache = {}
```

### Skill ID 命名

Skill ID 使用点分层级命名：

```python
# 格式：{category}.{subcategory}.{action}
"common.text.extract_keywords"
"communication.email.send"
"data.database.query"
"integration.dingtalk.send_message"
"domain.customer_service.handle_complaint"
```

---

## Skill 定义规范

### 基础 Skill 装饰器

```python
# src/skills/base.py

from functools import wraps
from typing import Callable, Any, Optional
from agentscope.service import ServiceResponse, ServiceExecStatus
import logging

logger = logging.getLogger(__name__)


def skill(
    skill_id: str,
    name: str,
    description: str,
    version: str = "1.0.0",
    category: str = "common",
    enabled: bool = True,
    timeout: Optional[int] = None,
    retries: int = 0,
):
    """
    Skill 装饰器，用于标记和配置 Skill 函数
    
    Args:
        skill_id: Skill 唯一标识
        name: Skill 名称
        description: Skill 描述
        version: 版本号
        category: 分类
        enabled: 是否启用
        timeout: 超时时间（秒）
        retries: 重试次数
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> ServiceResponse:
            if not enabled:
                return ServiceResponse(
                    status=ServiceExecStatus.ERROR,
                    content=f"Skill '{skill_id}' is disabled"
                )
            
            for attempt in range(retries + 1):
                try:
                    logger.info(f"Executing skill: {skill_id}, attempt: {attempt + 1}")
                    result = func(*args, **kwargs)
                    logger.info(f"Skill {skill_id} executed successfully")
                    return result
                except Exception as e:
                    logger.error(f"Skill {skill_id} failed: {str(e)}")
                    if attempt == retries:
                        return ServiceResponse(
                            status=ServiceExecStatus.ERROR,
                            content=f"Skill execution failed: {str(e)}"
                        )
            
        # 附加元数据
        wrapper._skill_metadata = {
            "id": skill_id,
            "name": name,
            "description": description,
            "version": version,
            "category": category,
            "enabled": enabled,
            "timeout": timeout,
            "retries": retries,
        }
        
        return wrapper
    return decorator
```

### Skill 注册中心

```python
# src/skills/registry.py

from typing import Dict, Callable, Optional, List
from dataclasses import dataclass


@dataclass
class SkillInfo:
    """Skill 信息"""
    id: str
    name: str
    description: str
    version: str
    category: str
    enabled: bool
    func: Callable


class SkillRegistry:
    """Skill 注册中心"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._skills: Dict[str, SkillInfo] = {}
        return cls._instance
    
    def register(self, func: Callable) -> None:
        """注册 Skill"""
        metadata = getattr(func, '_skill_metadata', None)
        if metadata is None:
            raise ValueError(f"Function {func.__name__} is not a valid skill")
        
        skill_info = SkillInfo(
            id=metadata["id"],
            name=metadata["name"],
            description=metadata["description"],
            version=metadata["version"],
            category=metadata["category"],
            enabled=metadata["enabled"],
            func=func,
        )
        self._skills[metadata["id"]] = skill_info
    
    def get(self, skill_id: str) -> Optional[SkillInfo]:
        """获取 Skill"""
        return self._skills.get(skill_id)
    
    def list_all(self) -> List[SkillInfo]:
        """列出所有 Skills"""
        return list(self._skills.values())
    
    def list_by_category(self, category: str) -> List[SkillInfo]:
        """按分类列出 Skills"""
        return [s for s in self._skills.values() if s.category == category]
    
    def execute(self, skill_id: str, *args, **kwargs):
        """执行 Skill"""
        skill = self.get(skill_id)
        if skill is None:
            raise ValueError(f"Skill '{skill_id}' not found")
        return skill.func(*args, **kwargs)


# 全局注册中心实例
skill_registry = SkillRegistry()
```

### Skill 实现示例

```python
# src/skills/communication/email.py

"""
邮件相关 Skills
"""

from typing import List, Optional
from agentscope.service import ServiceResponse, ServiceExecStatus
from ..base import skill
from ..registry import skill_registry


@skill(
    skill_id="communication.email.send",
    name="发送邮件",
    description="发送电子邮件到指定收件人",
    version="1.0.0",
    category="communication",
    retries=2,
)
def send_email(
    to: str | List[str],
    subject: str,
    body: str,
    cc: Optional[List[str]] = None,
    attachments: Optional[List[str]] = None,
    html: bool = False,
) -> ServiceResponse:
    """
    发送电子邮件
    
    Args:
        to: 收件人邮箱地址，可以是单个地址或地址列表
        subject: 邮件主题
        body: 邮件正文
        cc: 抄送地址列表
        attachments: 附件文件路径列表
        html: 是否为 HTML 格式
        
    Returns:
        ServiceResponse: 包含发送结果
        
    Example:
        >>> result = send_email(
        ...     to="user@example.com",
        ...     subject="测试邮件",
        ...     body="这是一封测试邮件"
        ... )
        >>> print(result.status)
        ServiceExecStatus.SUCCESS
    """
    try:
        # 参数验证
        if not to:
            return ServiceResponse(
                status=ServiceExecStatus.ERROR,
                content="收件人地址不能为空"
            )
        
        if not subject:
            return ServiceResponse(
                status=ServiceExecStatus.ERROR,
                content="邮件主题不能为空"
            )
        
        # 实际发送逻辑
        # TODO: 集成实际的邮件发送服务
        
        return ServiceResponse(
            status=ServiceExecStatus.SUCCESS,
            content={
                "message": "邮件发送成功",
                "to": to,
                "subject": subject,
            }
        )
        
    except Exception as e:
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content=f"邮件发送失败: {str(e)}"
        )


@skill(
    skill_id="communication.email.read",
    name="读取邮件",
    description="从邮箱读取邮件",
    version="1.0.0",
    category="communication",
)
def read_emails(
    folder: str = "INBOX",
    limit: int = 10,
    unread_only: bool = True,
) -> ServiceResponse:
    """
    读取邮件
    
    Args:
        folder: 邮件文件夹
        limit: 读取数量限制
        unread_only: 是否只读取未读邮件
        
    Returns:
        ServiceResponse: 包含邮件列表
    """
    try:
        # TODO: 实现邮件读取逻辑
        emails = []
        
        return ServiceResponse(
            status=ServiceExecStatus.SUCCESS,
            content={
                "emails": emails,
                "count": len(emails),
            }
        )
        
    except Exception as e:
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content=f"读取邮件失败: {str(e)}"
        )


# 注册 Skills
skill_registry.register(send_email)
skill_registry.register(read_emails)
```

### 数据处理 Skill 示例

```python
# src/skills/data/analytics.py

"""
数据分析相关 Skills
"""

from typing import List, Dict, Any, Optional
import pandas as pd
from agentscope.service import ServiceResponse, ServiceExecStatus
from ..base import skill
from ..registry import skill_registry


@skill(
    skill_id="data.analytics.summarize",
    name="数据摘要",
    description="生成数据集的统计摘要",
    version="1.0.0",
    category="data",
)
def summarize_data(
    data: List[Dict[str, Any]] | pd.DataFrame,
    columns: Optional[List[str]] = None,
) -> ServiceResponse:
    """
    生成数据摘要统计
    
    Args:
        data: 输入数据，可以是字典列表或 DataFrame
        columns: 要分析的列，None 表示全部列
        
    Returns:
        ServiceResponse: 包含统计摘要
    """
    try:
        # 转换为 DataFrame
        if isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            df = data
        
        if columns:
            df = df[columns]
        
        # 生成摘要
        summary = {
            "shape": df.shape,
            "columns": list(df.columns),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "describe": df.describe().to_dict(),
            "null_counts": df.isnull().sum().to_dict(),
        }
        
        return ServiceResponse(
            status=ServiceExecStatus.SUCCESS,
            content=summary
        )
        
    except Exception as e:
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content=f"数据摘要生成失败: {str(e)}"
        )


@skill(
    skill_id="data.analytics.aggregate",
    name="数据聚合",
    description="对数据进行分组聚合计算",
    version="1.0.0",
    category="data",
)
def aggregate_data(
    data: List[Dict[str, Any]] | pd.DataFrame,
    group_by: str | List[str],
    aggregations: Dict[str, str | List[str]],
) -> ServiceResponse:
    """
    数据聚合
    
    Args:
        data: 输入数据
        group_by: 分组字段
        aggregations: 聚合配置，如 {"sales": ["sum", "mean"], "count": "count"}
        
    Returns:
        ServiceResponse: 包含聚合结果
    """
    try:
        if isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            df = data
        
        result = df.groupby(group_by).agg(aggregations)
        
        return ServiceResponse(
            status=ServiceExecStatus.SUCCESS,
            content={
                "result": result.to_dict(),
                "groups": result.index.tolist(),
            }
        )
        
    except Exception as e:
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content=f"数据聚合失败: {str(e)}"
        )


# 注册 Skills
skill_registry.register(summarize_data)
skill_registry.register(aggregate_data)
```

### 与 AgentScope Agent 集成

```python
# src/agents/digital_employees/data_analyst.py

"""
数据分析数字员工
"""

from agentscope.agents import ReActAgent
from agentscope.service import ServiceToolkit

from src.skills.data.analytics import summarize_data, aggregate_data
from src.skills.data.database import query_database
from src.skills.data.visualization import create_chart


class DataAnalystAgent(ReActAgent):
    """
    数据分析数字员工
    
    职责：
    - 数据查询和提取
    - 数据统计分析
    - 报表生成
    - 数据可视化
    """
    
    def __init__(
        self,
        name: str = "数据分析师",
        model_config_name: str = "default",
        **kwargs,
    ):
        # 创建服务工具集
        service_toolkit = ServiceToolkit()
        
        # 注册 Skills
        service_toolkit.add(summarize_data)
        service_toolkit.add(aggregate_data)
        service_toolkit.add(query_database)
        service_toolkit.add(create_chart)
        
        # 系统提示
        sys_prompt = """你是一个专业的数据分析师数字员工。

你的职责包括：
1. 根据用户需求查询和提取数据
2. 对数据进行统计分析
3. 生成分析报告
4. 创建数据可视化图表

请使用提供的工具来完成用户的数据分析任务。在分析前，先理解用户的需求，然后选择合适的工具进行处理。
"""
        
        super().__init__(
            name=name,
            model_config_name=model_config_name,
            service_toolkit=service_toolkit,
            sys_prompt=sys_prompt,
            **kwargs,
        )
```

---

## 代码风格

### Python 代码规范

遵循 [PEP 8](https://pep8.org/) 规范，并使用以下工具：

- **格式化**：`black`（行宽 88）
- **导入排序**：`isort`
- **类型检查**：`mypy`
- **代码检查**：`ruff` 或 `flake8`

### pyproject.toml 配置

```toml
[project]
name = "all-in-ai"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "agentscope>=0.0.5",
    "pandas>=2.0.0",
    "pydantic>=2.0.0",
]

[tool.black]
line-length = 88
target-version = ['py312']

[tool.isort]
profile = "black"
line_length = 88

[tool.mypy]
python_version = "3.12"
strict = true
ignore_missing_imports = true

[tool.ruff]
line-length = 88
target-version = "py312"
select = ["E", "F", "W", "I", "N", "D", "UP", "B", "C4"]
```

### 类型注解要求

所有公开函数必须有完整的类型注解：

```python
from typing import List, Dict, Optional, Any

def process_data(
    data: List[Dict[str, Any]],
    options: Optional[Dict[str, str]] = None,
) -> ServiceResponse:
    """处理数据"""
    ...
```

---

## 文档规范

### 模块文档

每个 Skill 模块文件必须包含模块文档字符串：

```python
"""
邮件相关 Skills

该模块提供邮件发送、读取等功能的 Skills 实现。

Skills:
    - send_email: 发送电子邮件
    - read_emails: 读取邮件
    - delete_email: 删除邮件

Example:
    >>> from src.skills.communication.email import send_email
    >>> result = send_email(
    ...     to="user@example.com",
    ...     subject="测试",
    ...     body="内容"
    ... )

Author: Your Name
Created: 2024-01-01
"""
```

### 函数文档

使用 Google 风格的 docstring：

```python
def send_email(
    to: str | List[str],
    subject: str,
    body: str,
) -> ServiceResponse:
    """
    发送电子邮件
    
    发送邮件到指定的收件人。支持单个或多个收件人，
    支持纯文本和 HTML 格式的邮件内容。
    
    Args:
        to: 收件人邮箱地址，可以是单个地址或地址列表
        subject: 邮件主题，不超过 200 个字符
        body: 邮件正文内容
        
    Returns:
        ServiceResponse: 执行结果
            - status: 执行状态（SUCCESS/ERROR）
            - content: 成功时返回发送详情，失败时返回错误信息
            
    Raises:
        ValueError: 当收件人地址格式无效时
        
    Example:
        >>> result = send_email(
        ...     to="user@example.com",
        ...     subject="测试邮件",
        ...     body="这是一封测试邮件"
        ... )
        >>> if result.status == ServiceExecStatus.SUCCESS:
        ...     print("发送成功")
        
    Note:
        - 邮件发送可能需要几秒钟时间
        - 请确保邮件服务已正确配置
    """
```

---

## 测试规范

### 测试文件结构

```python
# tests/skills/test_communication.py

"""邮件 Skills 测试"""

import pytest
from unittest.mock import patch, MagicMock
from agentscope.service import ServiceExecStatus

from src.skills.communication.email import send_email, read_emails


class TestSendEmail:
    """send_email Skill 测试"""
    
    def test_send_email_success(self):
        """测试成功发送邮件"""
        result = send_email(
            to="test@example.com",
            subject="测试主题",
            body="测试内容",
        )
        
        assert result.status == ServiceExecStatus.SUCCESS
        assert "message" in result.content
    
    def test_send_email_empty_recipient(self):
        """测试空收件人"""
        result = send_email(
            to="",
            subject="测试主题",
            body="测试内容",
        )
        
        assert result.status == ServiceExecStatus.ERROR
        assert "收件人" in result.content
    
    def test_send_email_empty_subject(self):
        """测试空主题"""
        result = send_email(
            to="test@example.com",
            subject="",
            body="测试内容",
        )
        
        assert result.status == ServiceExecStatus.ERROR
    
    def test_send_email_multiple_recipients(self):
        """测试多个收件人"""
        result = send_email(
            to=["user1@example.com", "user2@example.com"],
            subject="测试主题",
            body="测试内容",
        )
        
        assert result.status == ServiceExecStatus.SUCCESS
    
    @patch('src.skills.communication.email.smtp_client')
    def test_send_email_with_mock(self, mock_smtp):
        """使用 Mock 测试邮件发送"""
        mock_smtp.send.return_value = True
        
        result = send_email(
            to="test@example.com",
            subject="测试主题",
            body="测试内容",
        )
        
        assert result.status == ServiceExecStatus.SUCCESS
        mock_smtp.send.assert_called_once()


class TestReadEmails:
    """read_emails Skill 测试"""
    
    def test_read_emails_default_params(self):
        """测试默认参数读取邮件"""
        result = read_emails()
        
        assert result.status == ServiceExecStatus.SUCCESS
        assert "emails" in result.content
        assert "count" in result.content
    
    def test_read_emails_with_limit(self):
        """测试限制数量读取"""
        result = read_emails(limit=5)
        
        assert result.status == ServiceExecStatus.SUCCESS


# Fixtures
@pytest.fixture
def sample_email_data():
    """示例邮件数据"""
    return {
        "to": "test@example.com",
        "subject": "测试邮件",
        "body": "这是测试内容",
    }
```

### 测试覆盖要求

| 类型 | 最低覆盖率 |
|------|-----------|
| 语句覆盖 | 80% |
| 分支覆盖 | 75% |
| 函数覆盖 | 90% |

### 运行测试

```bash
# 运行所有测试
pytest

# 运行特定模块测试
pytest tests/skills/test_communication.py

# 生成覆盖率报告
pytest --cov=src/skills --cov-report=html

# 运行类型检查
mypy src/
```

---

## 版本管理

### 版本号规范

遵循语义化版本（Semantic Versioning）：

- **主版本号（MAJOR）**：不兼容的 API 变更
- **次版本号（MINOR）**：向后兼容的功能新增
- **修订号（PATCH）**：向后兼容的问题修复

### 变更日志

```markdown
## [1.1.0] - 2024-01-15

### Added
- 新增 `send_email` Skill，支持发送带附件的邮件
- 新增 `read_emails` Skill

### Changed
- 优化 `summarize_data` 性能

### Fixed
- 修复 `aggregate_data` 空数据处理问题
```

---

## 最佳实践

### 1. 保持 Skill 职责单一

```python
# ✅ 好的做法：每个函数只做一件事
def send_email(...) -> ServiceResponse: ...
def read_emails(...) -> ServiceResponse: ...
def delete_email(...) -> ServiceResponse: ...

# ❌ 不好的做法：一个函数做太多事
def handle_email(action: str, ...) -> ServiceResponse:
    if action == "send": ...
    elif action == "read": ...
    elif action == "delete": ...
```

### 2. 合理处理错误

```python
# ✅ 好的做法：返回结构化错误
def my_skill(data: str) -> ServiceResponse:
    if not data:
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content="参数 data 不能为空"
        )
    
    try:
        result = process(data)
        return ServiceResponse(
            status=ServiceExecStatus.SUCCESS,
            content=result
        )
    except ValueError as e:
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content=f"数据格式错误: {str(e)}"
        )
    except Exception as e:
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content=f"处理失败: {str(e)}"
        )
```

### 3. 使用类型注解

```python
# ✅ 好的做法：完整的类型注解
from typing import List, Dict, Optional, Any

def process_data(
    items: List[Dict[str, Any]],
    config: Optional[Dict[str, str]] = None,
) -> ServiceResponse:
    ...
```

### 4. 添加适当的日志

```python
import logging

logger = logging.getLogger(__name__)

def my_skill(data: str) -> ServiceResponse:
    logger.info(f"开始处理数据，长度: {len(data)}")
    
    try:
        result = process(data)
        logger.info("数据处理成功")
        return ServiceResponse(...)
    except Exception as e:
        logger.error(f"数据处理失败: {str(e)}", exc_info=True)
        return ServiceResponse(...)
```

### 5. 使用常量

```python
# ✅ 好的做法
MAX_EMAIL_RECIPIENTS = 100
DEFAULT_TIMEOUT_SECONDS = 30
SUPPORTED_FILE_EXTENSIONS = ['.pdf', '.docx', '.xlsx']

if len(recipients) > MAX_EMAIL_RECIPIENTS:
    ...

# ❌ 不好的做法
if len(recipients) > 100:
    ...
```

### 6. 编写可复用的代码

```python
# ✅ 好的做法：提取公共逻辑
def _validate_email(email: str) -> bool:
    """验证邮箱格式"""
    import re
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))

def send_email(to: str, ...) -> ServiceResponse:
    if not _validate_email(to):
        return ServiceResponse(
            status=ServiceExecStatus.ERROR,
            content="邮箱格式无效"
        )
    ...
```

---

## 附录

### A. Skill 分类清单

| 分类 | 说明 | 示例 Skills |
|------|------|------------|
| common | 通用技能 | 文本处理、数据转换、文件操作 |
| communication | 通信相关 | 邮件、短信、通知推送 |
| data | 数据处理 | 数据库操作、数据分析、可视化 |
| integration | 外部集成 | API 调用、Webhook、第三方服务 |
| domain | 领域特定 | 客服、财务、HR、营销 |

### B. AgentScope 常用导入

```python
# Agent 相关
from agentscope.agents import (
    AgentBase,
    DialogAgent,
    ReActAgent,
    UserAgent,
)

# Service 相关
from agentscope.service import (
    ServiceResponse,
    ServiceExecStatus,
    ServiceToolkit,
)

# Message 相关
from agentscope.message import Msg

# 模型配置
from agentscope.models import ModelResponse
import agentscope
```

### C. 常用工具函数

```python
# src/utils/helpers.py

import re
from typing import Any
from datetime import datetime


def validate_email(email: str) -> bool:
    """验证邮箱格式"""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """验证手机号格式（中国大陆）"""
    pattern = r'^1[3-9]\d{9}$'
    return bool(re.match(pattern, phone))


def format_datetime(dt: datetime, fmt: str = "%Y-%m-%d %H:%M:%S") -> str:
    """格式化日期时间"""
    return dt.strftime(fmt)


def safe_get(data: dict, key: str, default: Any = None) -> Any:
    """安全获取字典值"""
    try:
        keys = key.split('.')
        result = data
        for k in keys:
            result = result[k]
        return result
    except (KeyError, TypeError):
        return default


def truncate_text(text: str, max_length: int = 100) -> str:
    """截断文本"""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."
```

---

*最后更新：2024*  
*版本：1.0.0*  
*项目：ALL-IN-AI 数字员工平台*
