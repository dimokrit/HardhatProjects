export type BigintToStringObjectType<T> = {
  [K in keyof T]: T[K] extends bigint
    ? string
    : T[K] extends Record<string, unknown>
    ? BigintToStringObjectType<T[K]>
    : T[K];
};

export function bigintToStringObject<T>(obj: T): BigintToStringObjectType<T> {
  const result: BigintToStringObjectType<T> = {} as BigintToStringObjectType<T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'bigint') {
        result[key as keyof T] =
          value.toString() as BigintToStringObjectType<T>[keyof T];
      } else if (typeof value === 'object' && value !== null) {
        result[key as keyof T] = bigintToStringObject(
          value,
        ) as BigintToStringObjectType<T>[keyof T];
      } else {
        result[key as keyof T] = value as BigintToStringObjectType<T>[keyof T];
      }
    }
  }

  return result;
}
