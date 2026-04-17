"""API 服务启动脚本"""

import uvicorn

from src.core.config import settings


def main():
    """启动 API 服务"""
    uvicorn.run(
        "src.api.app:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info" if settings.debug else "warning",
    )


if __name__ == "__main__":
    main()
