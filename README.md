# simply-effect

#### better than all the rest 🎶

Simple wrapper around Effect.gen that allows writing generator functions in a cleaner way.

With plain `effect`:

```tsx
import { Effect } from "effect";

export const getTodoById = (id: string) =>
  Effect.gen(function* () {
    const todo = yield* TodoService.getTodoById("some-id");
    if (todo.description.length < 2) {
      return yield* Effect.fail(new ValidationError("Too small description"));
    }
    return todo;
  });
```

Using `simply-effect`:

```tsx
import { effect } from "simply-effect";

export const getTodoById = effect(function* (id: string) {
  const todo = yield* TodoService.getTodoById("some-id");
  if (todo.description.length < 2) {
    return yield* Effect.fail(new ValidationError("Too small description"));
  }
  return todo;
});
```

If the generator function has no arguments, then `effect` will work exactly the same as `Effect.gen`.

```tsx
const value: Effect.Effect<number> = effect(function* () {
  yield* Console.log(1);
});
```

It can work together with classes as well, but an extra type annotations for `this` is needed:

```tsx
class MyService {
  readonly local = 1;
  compute = effect(this, function* (this: MyService, add: number) {
    yield* Console.log(this.local + add);
  });
}
```
