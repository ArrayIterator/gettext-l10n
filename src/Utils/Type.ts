export type Scalar<T extends string | number | boolean | bigint> = T extends string | number | boolean | bigint ? T : never;
