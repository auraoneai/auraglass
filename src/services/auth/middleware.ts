// @ts-nocheck - Optional express-rate-limit dependency
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthService, TokenPayload, Permission } from './auth-service';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      apiKey?: string;
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = this.extractToken(req);

      if (!token) {
        res.status(401).json({ error: 'No authentication token provided' });
        return;
      }

      const payload = this.authService.verifyToken(token);
      req.user = payload;
      next();
    } catch (error: any) {
      res.status(error.statusCode || 401).json({
        error: error.message || 'Authentication failed',
        code: error.code,
      });
    }
  };

  authenticateOptional = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = this.extractToken(req);

      if (token) {
        const payload = this.authService.verifyToken(token);
        req.user = payload;
      }

      next();
    } catch {
      next();
    }
  };

  authenticateApiKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const apiKey = this.extractApiKey(req);

      if (!apiKey) {
        res.status(401).json({ error: 'No API key provided' });
        return;
      }

      if (!this.authService.validateApiKey(apiKey)) {
        res.status(401).json({ error: 'Invalid API key format' });
        return;
      }

      req.apiKey = apiKey;
      next();
    } catch (error: any) {
      res.status(401).json({
        error: error.message || 'API key authentication failed',
      });
    }
  };

  requirePermission = (permission: Permission) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!this.authService.hasPermission(req.user, permission)) {
        res.status(403).json({
          error: 'Insufficient permissions',
          required: permission,
        });
        return;
      }

      next();
    };
  };

  requireAnyPermission = (permissions: Permission[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!this.authService.hasAnyPermission(req.user, permissions)) {
        res.status(403).json({
          error: 'Insufficient permissions',
          required: permissions,
        });
        return;
      }

      next();
    };
  };

  requireRole = (role: 'user' | 'admin' | 'developer') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userRole = req.user.role;
      const roleHierarchy = { user: 0, developer: 1, admin: 2 };

      if (roleHierarchy[userRole] < roleHierarchy[role]) {
        res.status(403).json({
          error: 'Insufficient role privileges',
          required: role,
          current: userRole,
        });
        return;
      }

      next();
    };
  };

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    if (req.cookies?.token) {
      return req.cookies.token;
    }

    if (req.query?.token && typeof req.query.token === 'string') {
      return req.query.token;
    }

    return null;
  }

  private extractApiKey(req: Request): string | null {
    const apiKeyHeader = req.headers['x-api-key'];

    if (apiKeyHeader && typeof apiKeyHeader === 'string') {
      return apiKeyHeader;
    }

    if (req.query?.apiKey && typeof req.query.apiKey === 'string') {
      return req.query.apiKey;
    }

    return null;
  }
}

export const createRateLimiter = (options?: {
  windowMs?: number;
  max?: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options?.windowMs || 15 * 60 * 1000,
    max: options?.max || 100,
    message: options?.message || 'Too many requests, please try again later',
    skipSuccessfulRequests: options?.skipSuccessfulRequests || false,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const aiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'AI service rate limit exceeded. Please try again later.',
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts. Please try again later.',
  skipSuccessfulRequests: true,
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Upload rate limit exceeded. Please try again later.',
});

export const searchRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: 'Search rate limit exceeded. Please slow down.',
});