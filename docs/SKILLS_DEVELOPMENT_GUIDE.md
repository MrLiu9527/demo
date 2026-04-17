# Skills 开发规范

## 目录

1. [概述](#概述)
2. [目录结构](#目录结构)
3. [命名规范](#命名规范)
4. [Skill 定义规范](#skill-定义规范)
5. [代码风格](#代码风格)
6. [文档规范](#文档规范)
7. [测试规范](#测试规范)
8. [版本管理](#版本管理)
9. [最佳实践](#最佳实践)

---

## 概述

本文档定义了多人聊天网站项目中 Skills（技能/功能模块）的开发规范。每个 Skill 代表一个独立的功能单元，可以被系统或用户调用以完成特定任务。

### 什么是 Skill？

Skill 是一个封装了特定功能逻辑的模块，具有以下特点：
- **独立性**：每个 Skill 应该是自包含的，有明确的输入和输出
- **可复用性**：设计时应考虑在不同场景下的复用
- **可测试性**：每个 Skill 都应该有对应的测试用例
- **可扩展性**：支持参数配置和功能扩展

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
│   │   ├── chat/                  # 聊天相关 Skills
│   │   │   ├── index.ts
│   │   │   ├── SendMessageSkill.ts
│   │   │   ├── ReceiveMessageSkill.ts
│   │   │   └── __tests__/
│   │   ├── user/                  # 用户相关 Skills
│   │   │   ├── index.ts
│   │   │   ├── AuthSkill.ts
│   │   │   ├── ProfileSkill.ts
│   │   │   └── __tests__/
│   │   ├── room/                  # 房间相关 Skills
│   │   │   ├── index.ts
│   │   │   ├── CreateRoomSkill.ts
│   │   │   ├── JoinRoomSkill.ts
│   │   │   └── __tests__/
│   │   └── utils/                 # Skills 工具函数
│   │       └── index.ts
├── docs/
│   ├── skills/                    # Skills 文档目录
│   │   ├── README.md              # Skills 总览
│   │   └── [skill-name].md        # 各 Skill 详细文档
│   └── SKILLS_DEVELOPMENT_GUIDE.md
└── tests/
    └── skills/                    # Skills 集成测试
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
  CHAT = 'chat',
  USER = 'user',
  ROOM = 'room',
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

### A. Skill 清单模板

| Skill ID | 名称 | 分类 | 版本 | 状态 | 负责人 |
|----------|------|------|------|------|--------|
| chat.sendMessage | 发送消息 | chat | 1.0.0 | 已完成 | - |
| chat.receiveMessage | 接收消息 | chat | 1.0.0 | 开发中 | - |
| user.auth | 用户认证 | user | 1.0.0 | 待开发 | - |

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
```

---

*最后更新：2024*
*版本：1.0.0*
