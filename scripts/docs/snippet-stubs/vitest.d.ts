/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   The testing guide's samples run under the user's own Vitest install;
   this declared surface covers exactly the members and matchers the
   samples use. It never ships. */

export interface Assertions {
  toBeNull(): void;
  toHaveBeenCalledTimes(times: number): void;
  not: Assertions;
}

export declare function expect(actual: unknown): Assertions;
export declare function test(name: string, fn: () => void | Promise<void>): void;

export interface MockFunction {
  (...args: never[]): unknown;
}

export declare const vi: {
  fn(): MockFunction;
};
