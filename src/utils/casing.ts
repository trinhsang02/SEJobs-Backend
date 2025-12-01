// utils/casing.ts
export function toCamelCaseKeys<T extends Record<string, any>>(obj: T): Camelize<T> {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCaseKeys) as any;
  }

  if (obj && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey as keyof Camelize<T>] = toCamelCaseKeys(obj[key]);
      return acc;
    }, {} as Camelize<T>);
  }

  return obj as Camelize<T>;
}

// Helper type to deeply camelCase keys
type Camelize<T> = T extends Array<infer U>
  ? Array<Camelize<U>>
  : T extends Record<string, any>
  ? { [K in keyof T as K extends string ? CamelizeKey<K> : K]: Camelize<T[K]> }
  : T;

type CamelizeKey<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${CamelizeKey<P3>}`
  : S;
