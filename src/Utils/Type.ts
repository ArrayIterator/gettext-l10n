// Helper type for creating `N` length tuples. Assumes `N` is an integer
// greater than `0`. Example:
// Tuple<number, 2 | 4> -> [number, number] | [number, number, number, number]
type Tuple<T, N extends number> = TupleImpl<T, N>;
// prettier-ignore
type TupleImpl<T, N extends number, U extends T[] = []> = N extends U["length"] ? U : TupleImpl<T, N, [T, ...U]>;
type RangeImpl<
    Start extends number,
    End extends number,
    T extends void[] = Tuple<void, Start>
> = End extends T["length"] ? End : T["length"] | RangeImpl<Start, End, [void, ...T]>;
export type AsNegativeInteger<T extends number> = number extends T ? never : `${T}` extends `${string}` | `-${string}.${string}` ? never : T;
export type AsPositiveInteger<T extends number> = number extends T ? never : `${T}` extends `-${string}` | `${string}.${string}` ? never : T;
export type Scalar<T extends string | number | boolean | bigint> = T extends string | number | boolean | bigint ? T : never;
export type PositiveInteger = AsPositiveInteger<number> | 0;
export type NegativeInteger = AsNegativeInteger<number>;
export type ArrayPositiveInteger<T> = Array<T> & { length: PositiveInteger };
