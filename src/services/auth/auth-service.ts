import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["user", "admin", "developer"]),
  permissions: z.array(z.string()),
  createdAt: z.date(),
  lastLogin: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export type User = z.infer<typeof UserSchema>;

export const TokenPayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
  role: z.enum(["user", "admin", "developer"]),
  permissions: z.array(z.string()),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  bcryptRounds: number;
}

const resolveJwtSecret = (providedSecret?: string): string => {
  const secret = providedSecret || process.env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "test") {
    return "auraglass-test-jwt-secret";
  }

  throw new Error("JWT_SECRET is required to initialize AuthService");
};

export class AuthService {
  private config: AuthConfig;

  constructor(config?: Partial<AuthConfig>) {
    this.config = {
      jwtSecret: resolveJwtSecret(config?.jwtSecret),
      jwtExpiresIn: config?.jwtExpiresIn || "1h",
      refreshTokenExpiresIn: config?.refreshTokenExpiresIn || "7d",
      bcryptRounds: config?.bcryptRounds || 10,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.bcryptRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const signOptions: jwt.SignOptions = {
      expiresIn: this.config.jwtExpiresIn as any,
    };
    return jwt.sign(
      payload as object,
      this.config.jwtSecret as jwt.Secret,
      signOptions
    );
  }

  generateRefreshToken(userId: string): string {
    const opts: jwt.SignOptions = {
      expiresIn: this.config.refreshTokenExpiresIn as any,
    };
    return jwt.sign(
      { userId, type: "refresh" } as object,
      this.config.jwtSecret as jwt.Secret,
      opts
    );
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret);
      return TokenPayloadSchema.parse(decoded);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError("Token expired", "TOKEN_EXPIRED", 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError("Invalid token", "INVALID_TOKEN", 401);
      }
      throw error;
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token);
      if (!decoded) return null;
      return TokenPayloadSchema.parse(decoded);
    } catch {
      return null;
    }
  }

  hasPermission(user: User | TokenPayload, permission: string): boolean {
    if (user.role === "admin") return true;

    return user.permissions.includes(permission);
  }

  hasAnyPermission(user: User | TokenPayload, permissions: string[]): boolean {
    if (user.role === "admin") return true;

    return permissions.some((permission) =>
      user.permissions.includes(permission)
    );
  }

  hasAllPermissions(user: User | TokenPayload, permissions: string[]): boolean {
    if (user.role === "admin") return true;

    return permissions.every((permission) =>
      user.permissions.includes(permission)
    );
  }

  generateApiKey(): string {
    return `ak_${randomBytes(24).toString("hex")}`;
  }

  validateApiKey(apiKey: string): boolean {
    return /^ak_[a-z0-9]{20,}$/.test(apiKey);
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class PermissionError extends AuthError {
  constructor(message = "Insufficient permissions", permission?: string) {
    super(message, "INSUFFICIENT_PERMISSIONS", 403);
  }
}

export const Permissions = {
  AI: {
    USE_OPENAI: "ai:use_openai",
    USE_VISION: "ai:use_vision",
    USE_EMBEDDINGS: "ai:use_embeddings",
    UNLIMITED_REQUESTS: "ai:unlimited_requests",
  },
  COLLABORATION: {
    CREATE_ROOM: "collab:create_room",
    JOIN_ROOM: "collab:join_room",
    EDIT_DOCUMENT: "collab:edit_document",
    DELETE_ROOM: "collab:delete_room",
  },
  ADMIN: {
    MANAGE_USERS: "admin:manage_users",
    VIEW_ANALYTICS: "admin:view_analytics",
    SYSTEM_CONFIG: "admin:system_config",
  },
} as const;

export type Permission =
  (typeof Permissions)[keyof typeof Permissions][keyof (typeof Permissions)[keyof typeof Permissions]];
