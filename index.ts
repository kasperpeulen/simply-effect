import { Effect } from "effect";
import type { YieldWrap } from "effect/Utils";

type InferE<Eff extends YieldWrap<Effect.Effect<any, any, any>>> = [
  Eff,
] extends [never]
  ? never
  : [Eff] extends [YieldWrap<Effect.Effect<infer _A, infer E, infer _R>>]
    ? E
    : never;
type InferR<Eff extends YieldWrap<Effect.Effect<any, any, any>>> = [
  Eff,
] extends [never]
  ? never
  : [Eff] extends [YieldWrap<Effect.Effect<infer _A, infer _E, infer R>>]
    ? R
    : never;

export function effect<
  Eff extends YieldWrap<Effect.Effect<any, any, any>>,
  AEff,
>(
  f: () => Generator<Eff, AEff, never>,
): Effect.Effect<AEff, InferE<Eff>, InferR<Eff>>;
export function effect<
  Eff extends YieldWrap<Effect.Effect<any, any, any>>,
  AEff,
  Args extends any[],
>(
  f: (...args: Args) => Generator<Eff, AEff, never>,
): (...args: Args) => Effect.Effect<AEff, InferE<Eff>, InferR<Eff>>;
export function effect<
  Self,
  Eff extends YieldWrap<Effect.Effect<any, any, any>>,
  AEff,
>(
  self: Self,
  f: (this: Self) => Generator<Eff, AEff, never>,
): Effect.Effect<AEff, InferE<Eff>, InferR<Eff>>;
export function effect<
  Eff extends YieldWrap<Effect.Effect<any, any, any>>,
  AEff,
  Args extends any[],
  Self,
>(
  self: Self,
  f: (this: Self, ...args: Args) => Generator<Eff, AEff, never>,
): (...args: Args) => Effect.Effect<AEff, InferE<Eff>, InferR<Eff>>;
export function effect() {
  const f =
    arguments.length === 1 ? arguments[0] : arguments[1].bind(arguments[0]);
  if (f.length === 0) return Effect.gen(f);
  return (...args: any) => Effect.gen(() => f(...args));
}
