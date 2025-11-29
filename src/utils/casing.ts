import { camelCase, snakeCase } from "lodash";

export function toSnakeCaseKeys<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[snakeCase(key)] = obj[key];
    }
  }
  return result;
}

export function toCamelCaseKeys<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[camelCase(key)] = obj[key];
    }
  }
  return result;
}
