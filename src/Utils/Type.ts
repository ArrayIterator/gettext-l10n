export type AsPositiveInteger<T extends number> = number extends T ? never : `${T}` extends `-${string}` | `${string}.${string}` ? never : T;
export type Scalar<T extends string | number | boolean | bigint> = T extends string | number | boolean | bigint ? T : never;
export type PositiveInteger = AsPositiveInteger<number>;
