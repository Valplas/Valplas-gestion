export function cleanEmptyStrings<T extends Record<string, any>>(data: T): T {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === "string" && value.trim() === "" ? null : value,
      ])
    ) as T;
  }
  