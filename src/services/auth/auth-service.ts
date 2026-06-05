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
  private demoUsers = new Map<string, User & { passwordHash: string }>();
  private refreshTokens = new Map<string, string>();
  private revokedAccessTokens = new Set<string>();

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
      if (this.revokedAccessTokens.has(token)) {
        throw new AuthError("Token revoked", "TOKEN_REVOKED", 401);
      }

      const decoded = jwt.verify(token, this.config.jwtSecret);
      return TokenPayloadSchema.parse(decoded);
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
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

  async login(
    email: string,
    password: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: User;
  }> {
    this.assertDemoAuthEnabled();

    const normalizedEmail = email.trim().toLowerCase();
    let user = this.demoUsers.get(normalizedEmail);

    if (!user) {
      user = await this.createDemoUser(normalizedEmail, password);
      this.demoUsers.set(normalizedEmail, user);
    } else {
      const validPassword = await this.verifyPassword(
        password,
        user.passwordHash
      );
      if (!validPassword) {
        throw new AuthError(
          "Invalid email or password",
          "INVALID_CREDENTIALS",
          401
        );
      }
    }

    user.lastLogin = new Date();
    return this.issueSession(user);
  }

  async register(
    email: string,
    password: string,
    name?: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: User;
  }> {
    this.assertDemoAuthEnabled();

    const normalizedEmail = email.trim().toLowerCase();
    if (this.demoUsers.has(normalizedEmail)) {
      throw new AuthError("User already exists", "USER_EXISTS", 409);
    }

    const user = await this.createDemoUser(normalizedEmail, password, name);
    this.demoUsers.set(normalizedEmail, user);
    return this.issueSession(user);
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(refreshToken, this.config.jwtSecret) as {
        userId?: string;
        type?: string;
      };

      if (decoded.type !== "refresh" || !decoded.userId) {
        throw new AuthError(
          "Invalid refresh token",
          "INVALID_REFRESH_TOKEN",
          401
        );
      }

      if (this.refreshTokens.get(decoded.userId) !== refreshToken) {
        throw new AuthError(
          "Refresh token revoked",
          "REFRESH_TOKEN_REVOKED",
          401
        );
      }

      const user = Array.from(this.demoUsers.values()).find(
        (candidate) => candidate.id === decoded.userId
      );

      if (!user) {
        throw new AuthError("User not found", "USER_NOT_FOUND", 401);
      }

      return { token: this.generateAccessToken(user) };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        "Invalid refresh token",
        "INVALID_REFRESH_TOKEN",
        401
      );
    }
  }

  async revokeToken(token: string): Promise<void> {
    this.revokedAccessTokens.add(token);
  }

  private assertDemoAuthEnabled(): void {
    if (process.env.ENABLE_DEMO_AUTH !== "true") {
      throw new AuthError(
        "Hosted login/register are disabled. Set ENABLE_DEMO_AUTH=true only for local demos, or provide JWTs from your production identity provider.",
        "DEMO_AUTH_DISABLED",
        501
      );
    }
  }

  private async createDemoUser(
    email: string,
    password: string,
    name?: string
  ): Promise<User & { passwordHash: string }> {
    const now = new Date();
    return {
      id: `demo_${randomBytes(12).toString("hex")}`,
      email,
      name: name || email.split("@")[0] || "Demo User",
      role: "developer",
      permissions: [
        Permissions.AI.USE_OPENAI,
        Permissions.AI.USE_VISION,
        Permissions.AI.USE_EMBEDDINGS,
        Permissions.COLLABORATION.JOIN_ROOM,
      ],
      createdAt: now,
      lastLogin: now,
      passwordHash: await this.hashPassword(password),
    };
  }

  private issueSession(user: User): {
    token: string;
    refreshToken: string;
    user: User;
  } {
    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);
    this.refreshTokens.set(user.id, refreshToken);

    const { passwordHash: _passwordHash, ...publicUser } = user as User & {
      passwordHash?: string;
    };

    return {
      token,
      refreshToken,
      user: publicUser,
    };
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
