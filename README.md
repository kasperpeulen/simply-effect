# simply-effect

#### better than all the rest 🎶

This is very simple wrapper around `Effect.gen` that makes sure that generator functions can be written in a cleaner way.

With plain `effect`:

```tsx
import { Effect } from "effect";

export const getTodoById = (id: string) =>
  Effect.gen(function* () {
    const todoService = yield* TodoService;
    const todo = yield* todoService.getTodoById("some-id");
    if (todo.description.length < 2) {
      yield* Effect.fail(new ValidationError("Too small description"));
    }
    return todo;
  });
```

Using `simply-effect`:

```tsx
import { effect } from "simply-effect";

export const getTodoById = effect(function* (id: string) {
  const todoService = yield* TodoService;
  const todo = yield* todoService.getTodoById("some-id");
  if (todo.description.length < 2) {
    yield* Effect.fail(new ValidationError("Too small description"));
  }
  return todo;
});
```

If the generator function has no arguments, then `effect` will work exactly the same as `Effect.gen`.

```tsx
const value: Effect.Effect<number> = effect(function* () {
  return yield* Effect.succeed(1);
});
```

It can work together with classes as well, but an extra type annotations for `this` is needed:

```tsx
class MyService {
  readonly local = 1;
  compute = effect(this, function* (this: MyService, add: number) {
    return yield* Effect.succeed(this.local + add);
  });
}
```
