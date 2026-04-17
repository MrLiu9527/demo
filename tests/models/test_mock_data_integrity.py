"""用内存中的 mock 对象链校验模型关系与序列化完整性（不依赖数据库）"""

import uuid

import pytest

from src.models.agent import (
    AgentConfig,
    AgentScope,
    AgentStatus,
    AgentType,
)
from src.models.conversation import Conversation, Message, MessageRole, MessageType
from src.models.space import MemberRole, Space, SpaceMember, SpaceStatus, SpaceType
from src.models.user import User, UserStatus


def _mock_user_chain() -> tuple[
    User,
    Space,
    SpaceMember,
    AgentConfig,
    Conversation,
    Message,
]:
    """构造一条满足外键含义的完整对象链。"""
    user_id = uuid.uuid4()
    space_id = uuid.uuid4()
    agent_row_id = uuid.uuid4()
    conv_id = uuid.uuid4()
    msg_id = uuid.uuid4()

    user = User(
        id=user_id,
        username="mock_user",
        email="mock@example.com",
        password_hash="not-a-real-hash",
        status=UserStatus.ACTIVE,
    )

    space = Space(
        id=space_id,
        code="mock-space-001",
        name="Mock Space",
        type=SpaceType.PERSONAL,
        status=SpaceStatus.ACTIVE,
        owner_id=user_id,
        is_system=False,
    )

    member = SpaceMember(
        space_id=space_id,
        user_id=user_id,
        role=MemberRole.OWNER,
        is_active=True,
    )

    agent = AgentConfig(
        id=agent_row_id,
        agent_id="mock_agent",
        name="Mock Agent",
        type=AgentType.DIALOG,
        scope=AgentScope.SPACE,
        status=AgentStatus.PUBLISHED,
        space_id=space_id,
        created_by=user_id,
    )

    conversation = Conversation(
        id=conv_id,
        title="Mock chat",
        user_id=user_id,
        agent_config_id=agent_row_id,
        agent_id=agent.agent_id,
        agent_type=agent.type.value,
        space_id=space_id,
        message_count=1,
    )

    message = Message(
        id=msg_id,
        conversation_id=conv_id,
        role=MessageRole.USER,
        type=MessageType.TEXT,
        content="hello",
    )

    # 挂载 ORM 关系（与 DB 中 join 结果一致）
    space.owner = user
    space.members = [member]
    member.user = user
    member.space = space
    user.space_members = [member]
    user.owned_spaces = [space]
    space.agents = [agent]
    agent.space = space
    conversation.messages = [message]
    message.conversation = conversation

    return user, space, member, agent, conversation, message


class TestMockDataIntegrity:
    """校验 mock 链上 ID 一致性与 to_dict 字段完整性。"""

    def test_foreign_key_consistency(self) -> None:
        user, space, member, agent, conv, _msg = _mock_user_chain()

        assert space.owner_id == user.id
        assert member.space_id == space.id and member.user_id == user.id
        assert agent.space_id == space.id and agent.created_by == user.id
        assert conv.user_id == user.id and conv.space_id == space.id
        assert conv.agent_config_id == agent.id
        assert conv.agent_id == agent.agent_id

        assert space.owner is user
        assert member in user.space_members
        assert space in user.owned_spaces
        assert agent in space.agents
        assert conv.messages[0].conversation_id == conv.id

    @pytest.mark.parametrize(
        ("obj", "required_keys"),
        [
            (
                "user",
                {
                    "id",
                    "username",
                    "email",
                    "status",
                    "metadata",
                    "created_at",
                    "updated_at",
                },
            ),
            (
                "space",
                {
                    "id",
                    "code",
                    "name",
                    "type",
                    "status",
                    "owner_id",
                    "metadata",
                    "created_at",
                    "updated_at",
                },
            ),
            (
                "member",
                {
                    "id",
                    "space_id",
                    "user_id",
                    "role",
                    "created_at",
                    "updated_at",
                },
            ),
            (
                "agent",
                {
                    "id",
                    "agent_id",
                    "name",
                    "type",
                    "scope",
                    "status",
                    "space_id",
                    "created_by",
                    "metadata",
                    "created_at",
                    "updated_at",
                },
            ),
            (
                "conversation",
                {
                    "id",
                    "user_id",
                    "agent_config_id",
                    "agent_id",
                    "space_id",
                    "metadata",
                    "created_at",
                    "updated_at",
                },
            ),
            (
                "message",
                {
                    "id",
                    "conversation_id",
                    "role",
                    "type",
                    "content",
                    "metadata",
                    "created_at",
                    "updated_at",
                },
            ),
        ],
    )
    def test_to_dict_keys_and_uuid_strings(
        self,
        obj: str,
        required_keys: set[str],
    ) -> None:
        user, space, member, agent, conv, msg = _mock_user_chain()
        mapping = {
            "user": user,
            "space": space,
            "member": member,
            "agent": agent,
            "conversation": conv,
            "message": msg,
        }
        instance = mapping[obj]
        data = instance.to_dict()
        assert required_keys <= set(data.keys())
        for key in ("id",) if obj == "user" else ():
            assert isinstance(data[key], str) and uuid.UUID(data[key]) == user.id
        if obj == "space":
            assert uuid.UUID(data["id"]) == space.id
            assert uuid.UUID(data["owner_id"]) == space.owner_id
        if obj == "member":
            assert uuid.UUID(data["space_id"]) == member.space_id
            assert uuid.UUID(data["user_id"]) == member.user_id
        if obj == "agent":
            assert uuid.UUID(data["id"]) == agent.id
            assert uuid.UUID(data["space_id"]) == agent.space_id
            assert uuid.UUID(data["created_by"]) == agent.created_by
        if obj == "conversation":
            assert uuid.UUID(data["id"]) == conv.id
            assert uuid.UUID(data["user_id"]) == conv.user_id
            assert uuid.UUID(data["space_id"]) == conv.space_id
            assert uuid.UUID(data["agent_config_id"]) == conv.agent_config_id
        if obj == "message":
            assert uuid.UUID(data["id"]) == msg.id
            assert uuid.UUID(data["conversation_id"]) == msg.conversation_id
