export const bigintTransformer = {
  to(value: number | null | undefined) {
    return value ?? null;
  },
  from(value: string | number | null) {
    if (value === null || value === undefined) return null;
    return typeof value === 'number' ? value : Number(value);
  },
};

