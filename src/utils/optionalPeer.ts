/**
 * Optional-peer loading for the 4.2 dependency diet (REQ-PLAT-56).
 * `optionalPeer(name)` throws the contract error when the package is absent;
 * `lazyPeer(name)` returns a proxy that defers the require (and the error)
 * to first property access or call, so importing a subpath never crashes a
 * consumer that lacks the optional dependency.
 */
export function optionalPeer<T = unknown>(name: string): T {
  try {
    return require(name) as T;
  } catch (e: unknown) {
    const code = (e as NodeJS.ErrnoException | undefined)?.code;
    if (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND") {
      throw new Error(
        `[aura-glass] ${name} is now an optional peer; install it: npm i ${name}`
      );
    }
    throw e;
  }
}

const NOT_FOUND = (name: string) =>
  new Error(
    `[aura-glass] ${name} is now an optional peer; install it: npm i ${name}`
  );

function tryRequire<T>(name: string): T | undefined {
  try {
    return require(name) as T;
  } catch {
    return undefined;
  }
}

/**
 * Lazily proxies an optional peer. Property access and calls resolve the
 * real module on first use; when the package is missing the contract error
 * throws at that point, not at import time.
 */
export function lazyPeer<T = unknown>(name: string): T {
  const resolve = () => {
    const mod = tryRequire<Record<PropertyKey, unknown>>(name);
    if (mod === undefined) throw NOT_FOUND(name);
    return mod;
  };
  const handler: ProxyHandler<CallableFunction> = {
    get: (_t, prop) => {
      if (prop === "__esModule") return true;
      if (prop === "then") return undefined;
      return (resolve() as Record<PropertyKey, unknown>)[prop];
    },
    apply: (_t, _this, args) =>
      (resolve() as unknown as (...a: unknown[]) => unknown)(...args),
    construct: (_t, args) =>
      new (resolve() as unknown as new (...a: unknown[]) => object)(...args),
    has: (_t, prop) => prop in resolve(),
  };
  return new Proxy(function () {}, handler) as unknown as T;
}

/**
 * One lazily-bound member of an optional peer (e.g. `motion` from
 * framer-motion). Access and calls resolve `require(name)[key]` at use time,
 * so absent peers throw the contract error when the feature is invoked.
 */
export function lazyMember<T = unknown>(name: string, key: PropertyKey): T {
  const resolve = () => optionalPeer<Record<PropertyKey, unknown>>(name)[key];
  const handler: ProxyHandler<CallableFunction> = {
    get: (_t, prop) => {
      if (prop === "__esModule") return true;
      if (prop === "then") return undefined;
      return (resolve() as Record<PropertyKey, unknown>)[prop];
    },
    apply: (_t, _this, args) =>
      (resolve() as unknown as (...a: unknown[]) => unknown)(...args),
    construct: (_t, args) =>
      new (resolve() as unknown as new (...a: unknown[]) => object)(...args),
  };
  return new Proxy(function () {}, handler) as unknown as T;
}
