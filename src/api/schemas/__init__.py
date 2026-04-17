"""API Schemas"""

from src.api.schemas.common import (
    ResponseModel,
    PaginatedResponse,
    ErrorResponse,
)
from src.api.schemas.agent import (
    AgentCreate,
    AgentUpdate,
    AgentResponse,
    AgentListResponse,
)
from src.api.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
    ChatRequest,
    ChatResponse,
)
from src.api.schemas.space import (
    SpaceCreate,
    SpaceUpdate,
    SpaceResponse,
    MemberAdd,
    MemberUpdate,
    MemberResponse,
)

__all__ = [
    # Common
    "ResponseModel",
    "PaginatedResponse",
    "ErrorResponse",
    # Agent
    "AgentCreate",
    "AgentUpdate",
    "AgentResponse",
    "AgentListResponse",
    # Conversation
    "ConversationCreate",
    "ConversationResponse",
    "MessageCreate",
    "MessageResponse",
    "ChatRequest",
    "ChatResponse",
    # Space
    "SpaceCreate",
    "SpaceUpdate",
    "SpaceResponse",
    "MemberAdd",
    "MemberUpdate",
    "MemberResponse",
]
