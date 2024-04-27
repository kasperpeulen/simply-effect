import { expect, test } from "vitest";
import { Console, Context, Effect } from "effect";
import { effect } from "./index.js";

function* getTodo(id: string) {
  const todoService = yield* TodoService;
  const todo = yield* todoService.getTodoById(id);
  if (todo.description.length < 2) {
    return yield* Effect.fail(new ValidationError("Too small description"));
  }
  return todo;
}

const wrappedInEffect = effect(function* (first: string, second: number) {
  yield* Console.log(first);
  yield* Console.log(second);
  return first + second.toString();
});

test("effect", async () => {
  const program = effect(function* () {
    const id = yield* wrappedInEffect("id-", 1);
    return yield* getTodo(id);
  });
  const todo = await program.pipe(
    Effect.provideService(TodoService, {
      getTodoById: effect(function* (id: string) {
        return { description: "Learn effect", id };
      }),
    }),
    Effect.scoped,
    Effect.runPromise,
  );
  expect(todo).toEqual({
    description: "Learn effect",
    id: "id-1",
  });
});

test("can pass this to generator", async () => {
  class MyService {
    readonly local = 1;
    compute = effect(this, function* (this: MyService, add: number) {
      return yield* Effect.succeed(this.local + add);
    });
  }
  const instance = new MyService();

  expect(Effect.runSync(instance.compute(2))).toBe(3);
});

export class NotFoundError extends Error {
  readonly name = "NotFoundError";
}

export class ValidationError extends Error {
  readonly name = "ValidationError";
}

class TodoService extends Context.Tag("TodoService")<
  TodoService,
  {
    getTodoById(
      id: string,
    ): Effect.Effect<{ description: string }, NotFoundError>;
  }
>() {}
