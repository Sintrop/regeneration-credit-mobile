export function bigNumberToFloat(value: string): number {
  return parseFloat(value.replace("n", ""));
}