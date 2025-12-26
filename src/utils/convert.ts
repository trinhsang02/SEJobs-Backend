
const convert = {
  // "1,2,3" => [1, 2, 3]
  split: <T = string>(input: string | undefined | null, delimiter: string = ",", formatFn: (value: string) => T = (v) => v as unknown as T): T[] => {
    if (!input) return [];
    return input
      .split(delimiter)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map(formatFn);
  },
  normalizeArray: (v?: any[]) =>
    Array.isArray(v) && v.length > 0 ? v : null
};

export default convert;