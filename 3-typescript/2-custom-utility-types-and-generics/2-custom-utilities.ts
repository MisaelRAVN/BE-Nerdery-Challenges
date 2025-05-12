/**
 * Exercise #1: Filter object properties by type.
 *
 * Using a utility type `OmitByType`, this example demonstrates how to pick properties
 * from a type `T` whose values are *not* assignable to a specified type `U`.
 *
 * @example
 * type OmitBoolean = OmitByType<{
 *   name: string;
 *   count: number;
 *   isReadonly: boolean;
 *   isEnable: boolean;
 * }, boolean>;
 *
 * Resulting type:
 *
 * {
 * name: string;
 * count: number;
 * }
 */

// Add here your solution
type OmitByType<T, U> = {
  [Property in keyof T as T[Property] extends U
    ? never
    : Property]: T[Property];
};

// Add here your example
type OmitBoolean = OmitByType<
  {
    name: string;
    age: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>;

type OmitNumber = OmitByType<
  {
    name: string;
    age: number;
    isAvailable: boolean;
  },
  number
>;

/**
 * Exercise #2: Implement the utility type `If<C, T, F>`, which evaluates a condition `C`
 * and returns one of two possible types:
 * - `T` if `C` is `true`
 * - `F` if `C` is `false`
 *
 * @description
 * - `C` is expected to be either `true` or `false`.
 * - `T` and `F` can be any type.
 *
 * @example
 * type A = If<true, 'a', 'b'>;  // expected to be 'a'
 * type B = If<false, 'a', 'b'>; // expected to be 'b'
 */

// Add here your solution
type If<C extends boolean, T, F> = C extends true ? T : F;

// Add here your example
type A = If<true, "a", "b">; // expected to be "a"
type B = If<false, "a", "b">; // expected to be "b"
// type C = If<5, 'a', 'b'>; // Type 'number' does not satisfy the constraint 'boolean'.

/**
 * Exercise #3: Recreate the built-in `Readonly<T>` utility type without using it.
 *
 * @description
 * Constructs a type that makes all properties of `T` readonly.
 * This means the properties of the resulting type cannot be reassigned.
 *
 * @example
 * interface Todo {
 *   title: string;
 *   description: string;
 * }
 *
 * const todo: MyReadonly<Todo> = {
 *   title: "Hey",
 *   description: "foobar"
 * };
 *
 * todo.title = "Hello";       // Error: cannot reassign a readonly property
 * todo.description = "barFoo"; // Error: cannot reassign a readonly property
 */

// Add here your solution
type MyReadonly<T> = {
  readonly [Property in keyof T]: T[Property];
};

// Add here your example
interface Todo {
  title: string;
  description: string;
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar",
};

// todo.title = "Hello";        // ERROR: cannot reassign a readonly property
// todo.description = "barFoo"; // ERROR: cannot reassign a readonly property

/**
 * Exercise #4: Recreate the built-in `ReturnType<T>` utility type without using it.
 *
 * @description
 * The `MyReturnType<T>` utility type extracts the return type of a function type `T`.
 *
 * @example
 * const fn = (v: boolean) => {
 *   if (v) {
 *     return 1;
 *   } else {
 *     return 2;
 *   }
 * };
 *
 * type a = MyReturnType<typeof fn>; // expected to be "1 | 2"
 */

// Add here your solution
type FunctionLikeType = (...args: any) => any;
type MyReturnType<T extends FunctionLikeType> = T extends (
  ...args: any
) => infer R
  ? R
  : never;

// Add here your example
const fn1 = (v: boolean) => {
  if (v) {
    return 1;
  } else {
    return 2;
  }
};

const fn2 = (a: number, b: boolean) => {
  if (b) {
    return 10;
  } else if (a > 10) {
    return 5;
  }
  return false;
};

type FnReturn1 = MyReturnType<typeof fn1>; // expected to be "1 | 2"
type FnReturn2 = MyReturnType<typeof fn2>; // expected to be "false | 10 | 5"

/**
 * Exercise #5: Extract the type inside a wrapped type like `Promise`.
 *
 * @description
 * Implement a utility type `MyAwaited<T>` that retrieves the type wrapped in a `Promise` or similar structure.
 *
 * If `T` is `Promise<ExampleType>`, the resulting type should be `ExampleType`.
 *
 * @example
 * type ExampleType = Promise<string>;
 *
 * type Result = MyAwaited<ExampleType>; // expected to be "string"
 */

// Add here your solution
type MyAwaited<T> =
  T extends Promise<infer ResolvedType>
    ? ResolvedType extends Promise<infer DeeperPromise>
      ? MyAwaited<DeeperPromise>
      : ResolvedType
    : T; // If T does not extend a promise, it is intentionally returning T as-is
// to match the behaviour of the actual built-in Awaited utility type

// Add here your example
type DeepExampleType = Promise<Promise<Promise<Promise<string>>>>;

type DeepResultAwaited = MyAwaited<DeepExampleType>; // expected to be "string"
type ResultAwaited = MyAwaited<Promise<number>>; // expected to be "number"

/**
 * Exercise 6: Create a utility type `RequiredByKeys<T, K>` that makes specific keys of `T` required.
 *
 * @description
 * The type takes two arguments:
 * - `T`: The object type.
 * - `K`: A union of keys in `T` that should be made required.
 *
 * If `K` is not provided, the utility should behave like the built-in `Required<T>` type, making all properties required.
 *
 * @example
 * interface User {
 *   name?: string;
 *   age?: number;
 *   address?: string;
 * }
 *
 * type UserRequiredName = RequiredByKeys<User, 'name'>;
 * expected to be: { name: string; age?: number; address?: string }
 */

// Add here your solution
type RequiredByKeys<T, K extends keyof T> = {
  [Property in K]-?: T[Property];
} & Omit<T, K>;

// Add here your example
interface User {
  name?: string;
  age?: number;
  address?: string;
}

type UserRequiredName = RequiredByKeys<User, "name">;

// expected to be: { name: string; age?: number; address?: string }
const objectWithRequiredName: UserRequiredName = {
  name: "Misael", // "name" property is required
  // age: 22, // "age" property remains optional
  // address: "Home", // "address" property remains optional
};
