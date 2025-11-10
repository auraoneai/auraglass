const sign = jest.fn((payload: any, secret?: string, options: Record<string, any> = {}) => {
  const header = { alg: options.algorithm || 'HS256', typ: 'JWT' };
  const encode = (segment: any) =>
    Buffer.from(JSON.stringify(segment), 'utf8').toString('base64url');

  return `${encode(header)}.${encode({ ...payload, iat: options.iat ?? 0 })}.signature`;
});

const verify = jest.fn((token: string) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      throw new Error('Invalid token');
    }
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return { mocked: true };
  }
});

const decode = jest.fn((token: string) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
});

class JsonWebTokenError extends Error {}
class TokenExpiredError extends JsonWebTokenError {}
class NotBeforeError extends JsonWebTokenError {}

module.exports = {
  sign,
  verify,
  decode,
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
  default: {
    sign,
    verify,
    decode,
    JsonWebTokenError,
    TokenExpiredError,
    NotBeforeError,
  },
};
