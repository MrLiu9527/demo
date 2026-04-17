"""Conversation Schema"""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class ConversationCreate(BaseModel):
    """创建会话"""

    agent_id: str = Field(..., description="Agent ID")
    title: str | None = Field(None, max_length=255, description="会话标题")
    metadata: dict[str, Any] | None = Field(default=None, description="元数据")


class ConversationUpdate(BaseModel):
    """更新会话"""

    title: str | None = Field(None, max_length=255, description="会话标题")
    is_pinned: bool | None = Field(None, description="是否置顶")
    metadata: dict[str, Any] | None = Field(None, description="元数据")


class ConversationResponse(BaseModel):
    """会话响应"""

    id: UUID = Field(..., description="会话 ID")
    title: str | None = Field(None, description="会话标题")
    agent_id: str = Field(..., description="Agent ID")
    agent_type: str = Field(..., description="Agent 类型")
    space_id: UUID = Field(..., description="空间 ID")
    is_active: bool = Field(..., description="是否活跃")
    is_pinned: bool = Field(..., description="是否置顶")
    message_count: int = Field(default=0, description="消息数量")
    total_tokens: int = Field(default=0, description="总 Token 数")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    ended_at: datetime | None = Field(None, description="结束时间")

    model_config = {"from_attributes": True}


class MessageCreate(BaseModel):
    """创建消息"""

    content: str = Field(..., min_length=1, description="消息内容")
    metadata: dict[str, Any] | None = Field(default=None, description="元数据")


class MessageResponse(BaseModel):
    """消息响应"""

    id: UUID = Field(..., description="消息 ID")
    conversation_id: UUID = Field(..., description="会话 ID")
    role: str = Field(..., description="消息角色")
    type: str = Field(..., description="消息类型")
    content: str = Field(..., description="消息内容")
    tool_name: str | None = Field(None, description="工具名称")
    tool_call_id: str | None = Field(None, description="工具调用 ID")
    tool_args: dict[str, Any] | None = Field(None, description="工具参数")
    tool_result: dict[str, Any] | None = Field(None, description="工具结果")
    prompt_tokens: int | None = Field(None, description="Prompt Token 数")
    completion_tokens: int | None = Field(None, description="Completion Token 数")
    total_tokens: int | None = Field(None, description="总 Token 数")
    metadata: dict[str, Any] | None = Field(None, description="元数据")
    created_at: datetime = Field(..., description="创建时间")

    model_config = {"from_attributes": True}


class ChatRequest(BaseModel):
    """聊天请求"""

    message: str = Field(..., min_length=1, max_length=10000, description="用户消息")
    stream: bool = Field(default=False, description="是否流式返回")


class ChatResponse(BaseModel):
    """聊天响应"""

    message_id: UUID | None = Field(None, description="消息 ID")
    conversation_id: UUID = Field(..., description="会话 ID")
    content: str = Field(..., description="响应内容")
    role: str = Field(default="assistant", description="角色")
    tool_calls: list[dict[str, Any]] | None = Field(None, description="工具调用")
    prompt_tokens: int | None = Field(None, description="Prompt Token 数")
    completion_tokens: int | None = Field(None, description="Completion Token 数")
    total_tokens: int | None = Field(None, description="总 Token 数")
