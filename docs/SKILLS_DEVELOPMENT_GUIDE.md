# Skills 开发规范

> **项目说明**：该项目是一个多人聊天网站。所有的功能和业务由 Cursor 完成！

## 目录

1. [概述](#概述)
2. [项目功能模块](#项目功能模块)
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

本文档定义了**多人聊天网站**项目中 Skills（技能/功能模块）的开发规范。每个 Skill 代表一个独立的功能单元，可以被系统或用户调用以完成特定任务。

### 什么是 Skill？

Skill 是一个封装了特定功能逻辑的模块，具有以下特点：
- **独立性**：每个 Skill 应该是自包含的，有明确的输入和输出
- **可复用性**：设计时应考虑在不同场景下的复用
- **可测试性**：每个 Skill 都应该有对应的测试用例
- **可扩展性**：支持参数配置和功能扩展

---

## 项目功能模块

作为一个多人聊天网站，项目包含以下核心功能模块：

### 用户模块 (User)
| Skill ID | 名称 | 描述 | 优先级 |
|----------|------|------|--------|
| user.register | 用户注册 | 新用户注册账号 | P0 |
| user.login | 用户登录 | 用户登录系统 | P0 |
| user.logout | 用户登出 | 用户退出登录 | P0 |
| user.getProfile | 获取用户信息 | 获取用户个人资料 | P1 |
| user.updateProfile | 更新用户信息 | 修改用户个人资料 | P1 |
| user.updateAvatar | 更新头像 | 上传/修改用户头像 | P2 |
| user.changePassword | 修改密码 | 用户修改登录密码 | P1 |
| user.resetPassword | 重置密码 | 忘记密码后重置 | P1 |
| user.searchUsers | 搜索用户 | 搜索其他用户 | P2 |
| user.blockUser | 拉黑用户 | 屏蔽某个用户 | P2 |
| user.unblockUser | 取消拉黑 | 解除用户屏蔽 | P2 |

### 聊天模块 (Chat)
| Skill ID | 名称 | 描述 | 优先级 |
|----------|------|------|--------|
| chat.sendMessage | 发送消息 | 发送文本/图片/文件消息 | P0 |
| chat.receiveMessage | 接收消息 | 接收实时消息 | P0 |
| chat.getHistory | 获取历史消息 | 获取聊天记录 | P0 |
| chat.deleteMessage | 删除消息 | 删除已发送的消息 | P1 |
| chat.editMessage | 编辑消息 | 修改已发送的消息 | P2 |
| chat.recallMessage | 撤回消息 | 撤回已发送的消息 | P1 |
| chat.forwardMessage | 转发消息 | 转发消息到其他会话 | P2 |
| chat.replyMessage | 回复消息 | 引用回复某条消息 | P2 |
| chat.sendTypingStatus | 发送输入状态 | 显示"正在输入" | P2 |
| chat.markAsRead | 标记已读 | 标记消息为已读 | P1 |
| chat.searchMessages | 搜索消息 | 搜索聊天记录 | P2 |

### 房间/群组模块 (Room)
| Skill ID | 名称 | 描述 | 优先级 |
|----------|------|------|--------|
| room.create | 创建房间 | 创建新的聊天房间/群组 | P0 |
| room.join | 加入房间 | 加入已存在的房间 | P0 |
| room.leave | 离开房间 | 退出房间 | P0 |
| room.invite | 邀请用户 | 邀请用户加入房间 | P1 |
| room.kick | 踢出用户 | 将用户移出房间 | P1 |
| room.getInfo | 获取房间信息 | 获取房间详细信息 | P1 |
| room.updateInfo | 更新房间信息 | 修改房间名称/描述等 | P1 |
| room.getMembers | 获取成员列表 | 获取房间成员列表 | P1 |
| room.setAdmin | 设置管理员 | 设置/取消管理员权限 | P2 |
| room.transferOwner | 转让房主 | 转让房间所有权 | P2 |
| room.dissolve | 解散房间 | 解散聊天房间 | P2 |
| room.mute | 禁言 | 对成员禁言 | P2 |
| room.unmute | 解除禁言 | 解除成员禁言 | P2 |
| room.setAnnouncement | 设置公告 | 设置房间公告 | P2 |
| room.list | 房间列表 | 获取用户的房间列表 | P0 |

### 好友模块 (Friend)
| Skill ID | 名称 | 描述 | 优先级 |
|----------|------|------|--------|
| friend.add | 添加好友 | 发送好友请求 | P1 |
| friend.accept | 接受好友 | 接受好友请求 | P1 |
| friend.reject | 拒绝好友 | 拒绝好友请求 | P1 |
| friend.remove | 删除好友 | 删除好友关系 | P1 |
| friend.list | 好友列表 | 获取好友列表 | P1 |
| friend.getRequests | 好友请求列表 | 获取待处理的好友请求 | P1 |
| friend.setRemark | 设置备注 | 设置好友备注名 | P2 |
| friend.getOnlineStatus | 获取在线状态 | 获取好友在线状态 | P2 |

### 通知模块 (Notification)
| Skill ID | 名称 | 描述 | 优先级 |
|----------|------|------|--------|
| notification.send | 发送通知 | 发送系统通知 | P1 |
| notification.list | 通知列表 | 获取通知列表 | P1 |
| notification.markRead | 标记已读 | 标记通知为已读 | P1 |
| notification.delete | 删除通知 | 删除通知 | P2 |
| notification.getUnreadCount | 未读数量 | 获取未读通知数量 | P1 |

### 文件模块 (File)
| Skill ID | 名称 | 描述 | 优先级 |
|----------|------|------|--------|
| file.upload | 上传文件 | 上传图片/文件/视频 | P1 |
| file.download | 下载文件 | 下载文件 | P1 |
| file.getUrl | 获取文件URL | 获取文件访问链接 | P1 |
| file.delete | 删除文件 | 删除已上传的文件 | P2 |

### 实时通信模块 (Realtime)
| Skill ID | 名称 | 描述 | 优先级 |
|----------|------|------|--------|
| realtime.connect | 建立连接 | 建立 WebSocket 连接 | P0 |
| realtime.disconnect | 断开连接 | 断开 WebSocket 连接 | P0 |
| realtime.reconnect | 重新连接 | 自动重连机制 | P0 |
| realtime.heartbeat | 心跳检测 | 保持连接活跃 | P0 |
| realtime.subscribe | 订阅频道 | 订阅消息频道 | P1 |
| realtime.unsubscribe | 取消订阅 | 取消频道订阅 | P1 |

### 表情/贴纸模块 (Emoji)
| Skill ID | 名称 | 描述 | 优先级 |
|----------|------|------|--------|
| emoji.list | 表情列表 | 获取系统表情列表 | P2 |
| emoji.addCustom | 添加自定义表情 | 添加自定义表情 | P3 |
| emoji.removeCustom | 删除自定义表情 | 删除自定义表情 | P3 |
| emoji.getRecent | 最近使用 | 获取最近使用的表情 | P3 |

### 优先级说明
- **P0**: 核心功能，必须实现
- **P1**: 重要功能，应该实现
- **P2**: 增强功能，可选实现
- **P3**: 锦上添花，低优先级

---

## 目录结构

```
/workspace
├── src/
│   ├── skills/                    # Skills 根目录
│   │   ├── index.ts               # Skills 统一导出入口
│   │   ├── types.ts               # Skills 通用类型定义
│   │   ├── base/                  # 基础 Skill 类
│   │   │   └── BaseSkill.ts
│   │   ├── user/                  # 用户模块 Skills
│   │   │   ├── index.ts
│   │   │   ├── RegisterSkill.ts
│   │   │   ├── LoginSkill.ts
│   │   │   ├── LogoutSkill.ts
│   │   │   ├── GetProfileSkill.ts
│   │   │   ├── UpdateProfileSkill.ts
│   │   │   └── __tests__/
│   │   ├── chat/                  # 聊天模块 Skills
│   │   │   ├── index.ts
│   │   │   ├── SendMessageSkill.ts
│   │   │   ├── ReceiveMessageSkill.ts
│   │   │   ├── GetHistorySkill.ts
│   │   │   ├── DeleteMessageSkill.ts
│   │   │   ├── RecallMessageSkill.ts
│   │   │   ├── MarkAsReadSkill.ts
│   │   │   └── __tests__/
│   │   ├── room/                  # 房间/群组模块 Skills
│   │   │   ├── index.ts
│   │   │   ├── CreateRoomSkill.ts
│   │   │   ├── JoinRoomSkill.ts
│   │   │   ├── LeaveRoomSkill.ts
│   │   │   ├── InviteSkill.ts
│   │   │   ├── KickSkill.ts
│   │   │   ├── GetInfoSkill.ts
│   │   │   ├── GetMembersSkill.ts
│   │   │   ├── ListRoomsSkill.ts
│   │   │   └── __tests__/
│   │   ├── friend/                # 好友模块 Skills
│   │   │   ├── index.ts
│   │   │   ├── AddFriendSkill.ts
│   │   │   ├── AcceptFriendSkill.ts
│   │   │   ├── RejectFriendSkill.ts
│   │   │   ├── RemoveFriendSkill.ts
│   │   │   ├── ListFriendsSkill.ts
│   │   │   └── __tests__/
│   │   ├── notification/          # 通知模块 Skills
│   │   │   ├── index.ts
│   │   │   ├── SendNotificationSkill.ts
│   │   │   ├── ListNotificationsSkill.ts
│   │   │   ├── MarkReadSkill.ts
│   │   │   └── __tests__/
│   │   ├── file/                  # 文件模块 Skills
│   │   │   ├── index.ts
│   │   │   ├── UploadFileSkill.ts
│   │   │   ├── DownloadFileSkill.ts
│   │   │   ├── GetFileUrlSkill.ts
│   │   │   └── __tests__/
│   │   ├── realtime/              # 实时通信模块 Skills
│   │   │   ├── index.ts
│   │   │   ├── ConnectSkill.ts
│   │   │   ├── DisconnectSkill.ts
│   │   │   ├── ReconnectSkill.ts
│   │   │   ├── HeartbeatSkill.ts
│   │   │   ├── SubscribeSkill.ts
│   │   │   └── __tests__/
│   │   └── utils/                 # Skills 工具函数
│   │       ├── index.ts
│   │       ├── validators.ts      # 通用验证函数
│   │       └── formatters.ts      # 数据格式化函数
├── docs/
│   ├── skills/                    # Skills 文档目录
│   │   ├── README.md              # Skills 总览
│   │   ├── user.md                # 用户模块文档
│   │   ├── chat.md                # 聊天模块文档
│   │   ├── room.md                # 房间模块文档
│   │   ├── friend.md              # 好友模块文档
│   │   ├── notification.md        # 通知模块文档
│   │   ├── file.md                # 文件模块文档
│   │   └── realtime.md            # 实时通信模块文档
│   └── SKILLS_DEVELOPMENT_GUIDE.md
└── tests/
    └── skills/                    # Skills 集成测试
        ├── user/
        ├── chat/
        ├── room/
        ├── friend/
        ├── notification/
        ├── file/
        └── realtime/
```

---

## 命名规范

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Skill 文件 | PascalCase + `Skill` 后缀 | `SendMessageSkill.ts` |
| 测试文件 | 与源文件同名 + `.test.ts` | `SendMessageSkill.test.ts` |
| 类型文件 | 小写 + `.types.ts` | `message.types.ts` |
| 工具文件 | 小写 + camelCase | `messageUtils.ts` |

### 类/接口命名

```typescript
// Skill 类名：PascalCase + Skill 后缀
class SendMessageSkill extends BaseSkill {}

// 接口名：I + PascalCase
interface ISkillConfig {}
interface ISkillResult {}

// 类型名：PascalCase
type SkillStatus = 'idle' | 'running' | 'completed' | 'failed';

// 枚举名：PascalCase，成员全大写
enum SkillCategory {
  USER = 'user',
  CHAT = 'chat',
  ROOM = 'room',
  FRIEND = 'friend',
  NOTIFICATION = 'notification',
  FILE = 'file',
  REALTIME = 'realtime',
  EMOJI = 'emoji',
}
```

### 方法/变量命名

```typescript
// 方法名：camelCase，动词开头
async execute(): Promise<ISkillResult> {}
validateInput(input: unknown): boolean {}
formatOutput(data: any): string {}

// 变量名：camelCase
const skillName = 'SendMessage';
const isEnabled = true;
const maxRetries = 3;

// 常量名：UPPER_SNAKE_CASE
const MAX_MESSAGE_LENGTH = 5000;
const DEFAULT_TIMEOUT_MS = 30000;
```

---

## Skill 定义规范

### 基础 Skill 接口

```typescript
// src/skills/types.ts

/**
 * Skill 配置接口
 */
export interface ISkillConfig {
  /** Skill 唯一标识 */
  id: string;
  /** Skill 名称 */
  name: string;
  /** Skill 描述 */
  description: string;
  /** Skill 版本 */
  version: string;
  /** Skill 分类 */
  category: SkillCategory;
  /** 是否启用 */
  enabled: boolean;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 重试次数 */
  retries?: number;
}

/**
 * Skill 输入参数接口
 */
export interface ISkillInput<T = unknown> {
  /** 参数数据 */
  data: T;
  /** 上下文信息 */
  context?: ISkillContext;
}

/**
 * Skill 执行结果接口
 */
export interface ISkillResult<T = unknown> {
  /** 是否成功 */
  success: boolean;
  /** 结果数据 */
  data?: T;
  /** 错误信息 */
  error?: ISkillError;
  /** 执行耗时（毫秒） */
  duration?: number;
  /** 元数据 */
  metadata?: Record<string, unknown>;
}

/**
 * Skill 错误接口
 */
export interface ISkillError {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 详细信息 */
  details?: unknown;
}

/**
 * Skill 上下文接口
 */
export interface ISkillContext {
  /** 用户 ID */
  userId?: string;
  /** 房间 ID */
  roomId?: string;
  /** 会话 ID */
  sessionId?: string;
  /** 请求 ID */
  requestId?: string;
  /** 时间戳 */
  timestamp?: number;
}
```

### 基础 Skill 类

```typescript
// src/skills/base/BaseSkill.ts

import { ISkillConfig, ISkillInput, ISkillResult, ISkillError } from '../types';

/**
 * Skill 基类
 * 所有 Skill 必须继承此类
 */
export abstract class BaseSkill<TInput = unknown, TOutput = unknown> {
  protected config: ISkillConfig;
  
  constructor(config: ISkillConfig) {
    this.config = config;
  }

  /**
   * 获取 Skill 配置
   */
  getConfig(): ISkillConfig {
    return this.config;
  }

  /**
   * 验证输入参数
   * @param input 输入参数
   * @returns 验证结果
   */
  abstract validate(input: ISkillInput<TInput>): boolean | Promise<boolean>;

  /**
   * 执行 Skill 逻辑
   * @param input 输入参数
   * @returns 执行结果
   */
  abstract execute(input: ISkillInput<TInput>): Promise<ISkillResult<TOutput>>;

  /**
   * 执行前钩子
   */
  protected async beforeExecute(input: ISkillInput<TInput>): Promise<void> {
    // 子类可覆盖
  }

  /**
   * 执行后钩子
   */
  protected async afterExecute(result: ISkillResult<TOutput>): Promise<void> {
    // 子类可覆盖
  }

  /**
   * 运行 Skill（包含生命周期钩子）
   */
  async run(input: ISkillInput<TInput>): Promise<ISkillResult<TOutput>> {
    const startTime = Date.now();
    
    try {
      // 验证输入
      const isValid = await this.validate(input);
      if (!isValid) {
        return this.createErrorResult('VALIDATION_ERROR', '输入参数验证失败');
      }

      // 执行前钩子
      await this.beforeExecute(input);

      // 执行主逻辑
      const result = await this.execute(input);

      // 执行后钩子
      await this.afterExecute(result);

      // 添加耗时信息
      result.duration = Date.now() - startTime;
      
      return result;
    } catch (error) {
      return this.createErrorResult(
        'EXECUTION_ERROR',
        error instanceof Error ? error.message : '未知错误',
        error
      );
    }
  }

  /**
   * 创建成功结果
   */
  protected createSuccessResult(data: TOutput, metadata?: Record<string, unknown>): ISkillResult<TOutput> {
    return {
      success: true,
      data,
      metadata,
    };
  }

  /**
   * 创建错误结果
   */
  protected createErrorResult(code: string, message: string, details?: unknown): ISkillResult<TOutput> {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
  }
}
```

### Skill 实现示例

```typescript
// src/skills/chat/SendMessageSkill.ts

import { BaseSkill } from '../base/BaseSkill';
import { ISkillInput, ISkillResult, SkillCategory } from '../types';

/**
 * 发送消息输入参数
 */
interface SendMessageInput {
  /** 消息内容 */
  content: string;
  /** 目标房间 ID */
  roomId: string;
  /** 消息类型 */
  type?: 'text' | 'image' | 'file';
  /** 附件 */
  attachments?: string[];
}

/**
 * 发送消息输出结果
 */
interface SendMessageOutput {
  /** 消息 ID */
  messageId: string;
  /** 发送时间 */
  sentAt: number;
}

/**
 * 发送消息 Skill
 * 
 * @description 处理用户在聊天室中发送消息的功能
 * @category chat
 * @version 1.0.0
 */
export class SendMessageSkill extends BaseSkill<SendMessageInput, SendMessageOutput> {
  constructor() {
    super({
      id: 'chat.sendMessage',
      name: 'SendMessage',
      description: '发送聊天消息',
      version: '1.0.0',
      category: SkillCategory.CHAT,
      enabled: true,
      timeout: 10000,
      retries: 3,
    });
  }

  /**
   * 验证消息输入
   */
  validate(input: ISkillInput<SendMessageInput>): boolean {
    const { data } = input;
    
    if (!data.content || data.content.trim().length === 0) {
      return false;
    }
    
    if (!data.roomId) {
      return false;
    }
    
    if (data.content.length > 5000) {
      return false;
    }
    
    return true;
  }

  /**
   * 执行发送消息
   */
  async execute(input: ISkillInput<SendMessageInput>): Promise<ISkillResult<SendMessageOutput>> {
    const { data, context } = input;
    
    try {
      // TODO: 实际的消息发送逻辑
      const messageId = this.generateMessageId();
      const sentAt = Date.now();
      
      // 这里添加实际的业务逻辑
      // await messageService.send({...});
      
      return this.createSuccessResult({
        messageId,
        sentAt,
      });
    } catch (error) {
      return this.createErrorResult(
        'SEND_FAILED',
        '消息发送失败',
        error
      );
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## 代码风格

### TypeScript 配置建议

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "declaration": true
  }
}
```

### ESLint 规则建议

```javascript
module.exports = {
  rules: {
    // 强制使用分号
    'semi': ['error', 'always'],
    // 使用单引号
    'quotes': ['error', 'single'],
    // 缩进使用 2 空格
    'indent': ['error', 2],
    // 强制返回类型声明
    '@typescript-eslint/explicit-function-return-type': 'error',
    // 禁止使用 any
    '@typescript-eslint/no-explicit-any': 'warn',
  }
};
```

### 代码格式要求

1. **缩进**：使用 2 个空格
2. **行长度**：不超过 100 字符
3. **分号**：始终使用分号
4. **引号**：优先使用单引号
5. **尾逗号**：多行时使用尾逗号
6. **空行**：
   - 类方法之间保留一个空行
   - import 分组之间保留一个空行
   - 逻辑块之间保留一个空行

---

## 文档规范

### 文件头部注释

每个 Skill 文件必须包含头部注释：

```typescript
/**
 * @file SendMessageSkill.ts
 * @description 发送聊天消息的 Skill 实现
 * @author Your Name
 * @created 2024-01-01
 * @modified 2024-01-15
 */
```

### JSDoc 注释要求

```typescript
/**
 * 发送消息 Skill
 * 
 * @description 处理用户在聊天室中发送消息的功能
 * @category chat
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * const skill = new SendMessageSkill();
 * const result = await skill.run({
 *   data: {
 *     content: 'Hello, World!',
 *     roomId: 'room_123',
 *   },
 *   context: {
 *     userId: 'user_456',
 *   },
 * });
 * ```
 */
```

### 参数文档

```typescript
/**
 * 发送消息
 * 
 * @param content - 消息内容，最大长度 5000 字符
 * @param roomId - 目标房间 ID
 * @param options - 可选配置
 * @param options.type - 消息类型，默认为 'text'
 * @param options.attachments - 附件列表
 * @returns 返回消息 ID 和发送时间
 * @throws {ValidationError} 当输入参数无效时抛出
 * @throws {NetworkError} 当网络请求失败时抛出
 */
```

---

## 测试规范

### 测试文件结构

```typescript
// src/skills/chat/__tests__/SendMessageSkill.test.ts

import { SendMessageSkill } from '../SendMessageSkill';

describe('SendMessageSkill', () => {
  let skill: SendMessageSkill;

  beforeEach(() => {
    skill = new SendMessageSkill();
  });

  describe('validate', () => {
    it('应该拒绝空消息', () => {
      const result = skill.validate({
        data: { content: '', roomId: 'room_123' },
      });
      expect(result).toBe(false);
    });

    it('应该拒绝超长消息', () => {
      const result = skill.validate({
        data: { content: 'a'.repeat(5001), roomId: 'room_123' },
      });
      expect(result).toBe(false);
    });

    it('应该接受有效消息', () => {
      const result = skill.validate({
        data: { content: 'Hello', roomId: 'room_123' },
      });
      expect(result).toBe(true);
    });
  });

  describe('execute', () => {
    it('应该成功发送消息', async () => {
      const result = await skill.run({
        data: { content: 'Hello', roomId: 'room_123' },
        context: { userId: 'user_456' },
      });
      
      expect(result.success).toBe(true);
      expect(result.data?.messageId).toBeDefined();
      expect(result.data?.sentAt).toBeDefined();
    });
  });
});
```

### 测试覆盖要求

| 类型 | 最低覆盖率 |
|------|-----------|
| 语句覆盖 | 80% |
| 分支覆盖 | 75% |
| 函数覆盖 | 90% |
| 行覆盖 | 80% |

### 测试命名规范

- 测试描述使用中文，便于理解
- 使用 `应该...` 开头描述预期行为
- 按功能模块分组使用 `describe`

---

## 版本管理

### 版本号规范

遵循语义化版本（Semantic Versioning）：

- **主版本号（MAJOR）**：不兼容的 API 变更
- **次版本号（MINOR）**：向后兼容的功能新增
- **修订号（PATCH）**：向后兼容的问题修复

### 变更日志

每个 Skill 应维护变更日志：

```markdown
## [1.1.0] - 2024-01-15

### Added
- 支持图片消息类型
- 添加消息重试机制

### Changed
- 优化消息验证逻辑

### Fixed
- 修复特殊字符转义问题
```

---

## 最佳实践

### 1. 保持 Skill 职责单一

每个 Skill 只负责一个具体功能，避免功能过于复杂。

```typescript
// ✅ 好的做法：职责单一
class SendMessageSkill { }
class ReceiveMessageSkill { }
class DeleteMessageSkill { }

// ❌ 不好的做法：职责过多
class MessageSkill {
  send() { }
  receive() { }
  delete() { }
  edit() { }
}
```

### 2. 使用依赖注入

```typescript
// ✅ 好的做法：通过构造函数注入依赖
class SendMessageSkill {
  constructor(
    private messageService: IMessageService,
    private logger: ILogger,
  ) { }
}

// ❌ 不好的做法：直接实例化依赖
class SendMessageSkill {
  private messageService = new MessageService();
}
```

### 3. 合理处理错误

```typescript
// ✅ 好的做法：返回结构化错误
return this.createErrorResult('NETWORK_ERROR', '网络连接失败', {
  statusCode: 503,
  retryAfter: 5000,
});

// ❌ 不好的做法：抛出未处理的异常
throw new Error('Something went wrong');
```

### 4. 添加适当的日志

```typescript
async execute(input: ISkillInput<TInput>): Promise<ISkillResult<TOutput>> {
  this.logger.info('开始执行 Skill', { 
    skillId: this.config.id, 
    input: input.data 
  });
  
  // ... 执行逻辑
  
  this.logger.info('Skill 执行完成', { 
    skillId: this.config.id, 
    duration: result.duration 
  });
}
```

### 5. 使用常量代替魔法数字

```typescript
// ✅ 好的做法
const MAX_MESSAGE_LENGTH = 5000;
const DEFAULT_TIMEOUT_MS = 30000;

if (content.length > MAX_MESSAGE_LENGTH) { }

// ❌ 不好的做法
if (content.length > 5000) { }
```

### 6. 编写可维护的代码

- 保持函数简短（不超过 50 行）
- 避免深层嵌套（最多 3 层）
- 使用早返回减少嵌套
- 添加必要的类型注解

---

## 附录

### A. Skill 清单（多人聊天网站）

#### P0 - 核心功能

| Skill ID | 名称 | 分类 | 版本 | 状态 |
|----------|------|------|------|------|
| user.register | 用户注册 | user | 1.0.0 | 待开发 |
| user.login | 用户登录 | user | 1.0.0 | 待开发 |
| user.logout | 用户登出 | user | 1.0.0 | 待开发 |
| chat.sendMessage | 发送消息 | chat | 1.0.0 | 待开发 |
| chat.receiveMessage | 接收消息 | chat | 1.0.0 | 待开发 |
| chat.getHistory | 获取历史消息 | chat | 1.0.0 | 待开发 |
| room.create | 创建房间 | room | 1.0.0 | 待开发 |
| room.join | 加入房间 | room | 1.0.0 | 待开发 |
| room.leave | 离开房间 | room | 1.0.0 | 待开发 |
| room.list | 房间列表 | room | 1.0.0 | 待开发 |
| realtime.connect | 建立连接 | realtime | 1.0.0 | 待开发 |
| realtime.disconnect | 断开连接 | realtime | 1.0.0 | 待开发 |
| realtime.reconnect | 重新连接 | realtime | 1.0.0 | 待开发 |
| realtime.heartbeat | 心跳检测 | realtime | 1.0.0 | 待开发 |

#### P1 - 重要功能

| Skill ID | 名称 | 分类 | 版本 | 状态 |
|----------|------|------|------|------|
| user.getProfile | 获取用户信息 | user | 1.0.0 | 待开发 |
| user.updateProfile | 更新用户信息 | user | 1.0.0 | 待开发 |
| user.changePassword | 修改密码 | user | 1.0.0 | 待开发 |
| user.resetPassword | 重置密码 | user | 1.0.0 | 待开发 |
| chat.deleteMessage | 删除消息 | chat | 1.0.0 | 待开发 |
| chat.recallMessage | 撤回消息 | chat | 1.0.0 | 待开发 |
| chat.markAsRead | 标记已读 | chat | 1.0.0 | 待开发 |
| room.invite | 邀请用户 | room | 1.0.0 | 待开发 |
| room.kick | 踢出用户 | room | 1.0.0 | 待开发 |
| room.getInfo | 获取房间信息 | room | 1.0.0 | 待开发 |
| room.updateInfo | 更新房间信息 | room | 1.0.0 | 待开发 |
| room.getMembers | 获取成员列表 | room | 1.0.0 | 待开发 |
| friend.add | 添加好友 | friend | 1.0.0 | 待开发 |
| friend.accept | 接受好友 | friend | 1.0.0 | 待开发 |
| friend.reject | 拒绝好友 | friend | 1.0.0 | 待开发 |
| friend.remove | 删除好友 | friend | 1.0.0 | 待开发 |
| friend.list | 好友列表 | friend | 1.0.0 | 待开发 |
| friend.getRequests | 好友请求列表 | friend | 1.0.0 | 待开发 |
| notification.send | 发送通知 | notification | 1.0.0 | 待开发 |
| notification.list | 通知列表 | notification | 1.0.0 | 待开发 |
| notification.markRead | 标记已读 | notification | 1.0.0 | 待开发 |
| notification.getUnreadCount | 未读数量 | notification | 1.0.0 | 待开发 |
| file.upload | 上传文件 | file | 1.0.0 | 待开发 |
| file.download | 下载文件 | file | 1.0.0 | 待开发 |
| file.getUrl | 获取文件URL | file | 1.0.0 | 待开发 |
| realtime.subscribe | 订阅频道 | realtime | 1.0.0 | 待开发 |
| realtime.unsubscribe | 取消订阅 | realtime | 1.0.0 | 待开发 |

#### P2 - 增强功能

| Skill ID | 名称 | 分类 | 版本 | 状态 |
|----------|------|------|------|------|
| user.updateAvatar | 更新头像 | user | 1.0.0 | 待开发 |
| user.searchUsers | 搜索用户 | user | 1.0.0 | 待开发 |
| user.blockUser | 拉黑用户 | user | 1.0.0 | 待开发 |
| user.unblockUser | 取消拉黑 | user | 1.0.0 | 待开发 |
| chat.editMessage | 编辑消息 | chat | 1.0.0 | 待开发 |
| chat.forwardMessage | 转发消息 | chat | 1.0.0 | 待开发 |
| chat.replyMessage | 回复消息 | chat | 1.0.0 | 待开发 |
| chat.sendTypingStatus | 发送输入状态 | chat | 1.0.0 | 待开发 |
| chat.searchMessages | 搜索消息 | chat | 1.0.0 | 待开发 |
| room.setAdmin | 设置管理员 | room | 1.0.0 | 待开发 |
| room.transferOwner | 转让房主 | room | 1.0.0 | 待开发 |
| room.dissolve | 解散房间 | room | 1.0.0 | 待开发 |
| room.mute | 禁言 | room | 1.0.0 | 待开发 |
| room.unmute | 解除禁言 | room | 1.0.0 | 待开发 |
| room.setAnnouncement | 设置公告 | room | 1.0.0 | 待开发 |
| friend.setRemark | 设置备注 | friend | 1.0.0 | 待开发 |
| friend.getOnlineStatus | 获取在线状态 | friend | 1.0.0 | 待开发 |
| notification.delete | 删除通知 | notification | 1.0.0 | 待开发 |
| file.delete | 删除文件 | file | 1.0.0 | 待开发 |
| emoji.list | 表情列表 | emoji | 1.0.0 | 待开发 |

### B. 常用工具函数

```typescript
// src/skills/utils/index.ts

/**
 * 生成唯一 ID
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 生成消息 ID
 */
export function generateMessageId(): string {
  return generateId('msg');
}

/**
 * 生成房间 ID
 */
export function generateRoomId(): string {
  return generateId('room');
}

/**
 * 生成用户 ID
 */
export function generateUserId(): string {
  return generateId('user');
}

/**
 * 安全解析 JSON
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证用户名格式（字母、数字、下划线，3-20字符）
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证密码强度（至少8位，包含字母和数字）
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * 检查是否为有效的房间名
 */
export function isValidRoomName(name: string): boolean {
  return name.length >= 2 && name.length <= 50;
}
```

### C. 聊天网站特定的类型定义

```typescript
// src/skills/types/chat.types.ts

/**
 * 消息类型
 */
export type MessageType = 'text' | 'image' | 'file' | 'video' | 'audio' | 'emoji' | 'system';

/**
 * 消息状态
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * 消息接口
 */
export interface IMessage {
  id: string;
  type: MessageType;
  content: string;
  senderId: string;
  roomId: string;
  status: MessageStatus;
  createdAt: number;
  updatedAt?: number;
  replyTo?: string;
  attachments?: IAttachment[];
}

/**
 * 附件接口
 */
export interface IAttachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

/**
 * 房间类型
 */
export type RoomType = 'private' | 'group' | 'public';

/**
 * 房间接口
 */
export interface IRoom {
  id: string;
  name: string;
  type: RoomType;
  description?: string;
  avatar?: string;
  ownerId: string;
  memberCount: number;
  createdAt: number;
  updatedAt?: number;
  lastMessage?: IMessage;
  announcement?: string;
}

/**
 * 房间成员角色
 */
export type MemberRole = 'owner' | 'admin' | 'member';

/**
 * 房间成员接口
 */
export interface IRoomMember {
  id: string;
  roomId: string;
  userId: string;
  role: MemberRole;
  nickname?: string;
  joinedAt: number;
  isMuted: boolean;
  mutedUntil?: number;
}

/**
 * 用户接口
 */
export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  nickname?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeenAt?: number;
  createdAt: number;
}

/**
 * 好友关系状态
 */
export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

/**
 * 好友关系接口
 */
export interface IFriendship {
  id: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
  remark?: string;
  createdAt: number;
  updatedAt?: number;
}

/**
 * 通知类型
 */
export type NotificationType = 
  | 'friend_request'
  | 'friend_accepted'
  | 'room_invite'
  | 'room_kick'
  | 'mention'
  | 'system';

/**
 * 通知接口
 */
export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  userId: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: number;
}
```

### D. WebSocket 事件定义

```typescript
// src/skills/types/realtime.types.ts

/**
 * WebSocket 事件类型
 */
export enum WSEventType {
  // 连接事件
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  HEARTBEAT = 'heartbeat',
  
  // 消息事件
  MESSAGE_NEW = 'message:new',
  MESSAGE_UPDATE = 'message:update',
  MESSAGE_DELETE = 'message:delete',
  MESSAGE_RECALL = 'message:recall',
  MESSAGE_READ = 'message:read',
  
  // 房间事件
  ROOM_JOIN = 'room:join',
  ROOM_LEAVE = 'room:leave',
  ROOM_UPDATE = 'room:update',
  ROOM_MEMBER_JOIN = 'room:member:join',
  ROOM_MEMBER_LEAVE = 'room:member:leave',
  ROOM_MEMBER_KICK = 'room:member:kick',
  
  // 用户事件
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
  USER_TYPING = 'user:typing',
  USER_STOP_TYPING = 'user:stop_typing',
  
  // 好友事件
  FRIEND_REQUEST = 'friend:request',
  FRIEND_ACCEPT = 'friend:accept',
  FRIEND_REJECT = 'friend:reject',
  FRIEND_REMOVE = 'friend:remove',
  
  // 通知事件
  NOTIFICATION_NEW = 'notification:new',
}

/**
 * WebSocket 消息格式
 */
export interface IWSMessage<T = unknown> {
  event: WSEventType;
  data: T;
  timestamp: number;
  requestId?: string;
}
```

---

*最后更新：2024*
*版本：1.1.0*
*项目：多人聊天网站*
