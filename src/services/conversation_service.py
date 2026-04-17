"""会话服务"""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.conversation import Conversation


class ConversationService:
    """会话服务类"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        user_id: uuid.UUID,
        space_id: uuid.UUID,
        agent_id: str,
        agent_type: str,
        agent_config_id: uuid.UUID | None = None,
        title: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> Conversation:
        """创建新会话

        Args:
            user_id: 用户ID
            space_id: 空间ID
            agent_id: Agent ID
            agent_type: Agent 类型
            agent_config_id: Agent 配置ID
            title: 会话标题
            metadata: 元数据

        Returns:
            创建的会话对象
        """
        conversation = Conversation(
            user_id=user_id,
            space_id=space_id,
            agent_id=agent_id,
            agent_type=agent_type,
            agent_config_id=agent_config_id,
            title=title,
            metadata_=metadata or {},
        )
        self.session.add(conversation)
        await self.session.flush()
        await self.session.refresh(conversation)
        return conversation

    async def get_by_id(self, conversation_id: uuid.UUID) -> Conversation | None:
        """根据ID获取会话

        Args:
            conversation_id: 会话ID

        Returns:
            会话对象或 None
        """
        result = await self.session.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user(
        self,
        user_id: uuid.UUID,
        space_id: uuid.UUID | None = None,
        agent_id: str | None = None,
        is_active: bool | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Conversation]:
        """获取用户的会话列表

        Args:
            user_id: 用户ID
            space_id: 空间ID（可选）
            agent_id: Agent ID（可选）
            is_active: 是否只获取活跃会话
            limit: 返回数量限制
            offset: 偏移量

        Returns:
            会话列表
        """
        query = select(Conversation).where(Conversation.user_id == user_id)

        if space_id:
            query = query.where(Conversation.space_id == space_id)

        if agent_id:
            query = query.where(Conversation.agent_id == agent_id)

        if is_active is not None:
            query = query.where(Conversation.is_active == is_active)

        query = query.order_by(
            Conversation.is_pinned.desc(),
            Conversation.updated_at.desc(),
        )
        query = query.limit(limit).offset(offset)

        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_space(
        self,
        space_id: uuid.UUID,
        is_active: bool | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Conversation]:
        """获取空间的会话列表

        Args:
            space_id: 空间ID
            is_active: 是否只获取活跃会话
            limit: 返回数量限制
            offset: 偏移量

        Returns:
            会话列表
        """
        query = select(Conversation).where(Conversation.space_id == space_id)

        if is_active is not None:
            query = query.where(Conversation.is_active == is_active)

        query = query.order_by(Conversation.updated_at.desc())
        query = query.limit(limit).offset(offset)

        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def update_title(
        self, conversation_id: uuid.UUID, title: str
    ) -> Conversation | None:
        """更新会话标题

        Args:
            conversation_id: 会话ID
            title: 新标题

        Returns:
            更新后的会话对象
        """
        await self.session.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(title=title)
        )
        return await self.get_by_id(conversation_id)

    async def toggle_pin(self, conversation_id: uuid.UUID) -> Conversation | None:
        """切换会话置顶状态

        Args:
            conversation_id: 会话ID

        Returns:
            更新后的会话对象
        """
        conversation = await self.get_by_id(conversation_id)
        if conversation:
            await self.session.execute(
                update(Conversation)
                .where(Conversation.id == conversation_id)
                .values(is_pinned=not conversation.is_pinned)
            )
            return await self.get_by_id(conversation_id)
        return None

    async def end_conversation(self, conversation_id: uuid.UUID) -> Conversation | None:
        """结束会话

        Args:
            conversation_id: 会话ID

        Returns:
            更新后的会话对象
        """
        now = datetime.now()
        await self.session.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(is_active=False, ended_at=now)
        )
        return await self.get_by_id(conversation_id)

    async def update_metadata(
        self, conversation_id: uuid.UUID, metadata: dict[str, Any]
    ) -> Conversation | None:
        """更新会话元数据

        Args:
            conversation_id: 会话ID
            metadata: 新元数据（会合并到现有元数据）

        Returns:
            更新后的会话对象
        """
        conversation = await self.get_by_id(conversation_id)
        if conversation:
            current_metadata = conversation.metadata_ or {}
            current_metadata.update(metadata)
            await self.session.execute(
                update(Conversation)
                .where(Conversation.id == conversation_id)
                .values(metadata=current_metadata)
            )
            return await self.get_by_id(conversation_id)
        return None

    async def increment_stats(
        self,
        conversation_id: uuid.UUID,
        message_count: int = 0,
        tokens: int = 0,
    ) -> None:
        """增加会话统计

        Args:
            conversation_id: 会话ID
            message_count: 增加的消息数
            tokens: 增加的 Token 数
        """
        await self.session.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(
                message_count=Conversation.message_count + message_count,
                total_tokens=Conversation.total_tokens + tokens,
            )
        )

    async def save_context_snapshot(
        self,
        conversation_id: uuid.UUID,
        snapshot: dict[str, Any],
    ) -> Conversation | None:
        """保存上下文快照

        Args:
            conversation_id: 会话ID
            snapshot: 上下文快照

        Returns:
            更新后的会话对象
        """
        await self.session.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(context_snapshot=snapshot)
        )
        return await self.get_by_id(conversation_id)

    async def delete(self, conversation_id: uuid.UUID) -> bool:
        """删除会话

        Args:
            conversation_id: 会话ID

        Returns:
            是否删除成功
        """
        conversation = await self.get_by_id(conversation_id)
        if conversation:
            await self.session.delete(conversation)
            return True
        return False
