import { utils } from "web3";

import { amountToWei } from "./tokenAmount";

export interface AbiParam {
  name: string;
  type: string;
  components?: AbiParam[];
}

export type ParsedArgument = { ok: true; value: unknown } | { ok: false; error: ArgumentError };

export type ArgumentError = "required" | "integer" | "negative" | "address" | "bool" | "hex" | "bytes32" | "json" | "array" | "amount";

const INTEGER = /^-?\d+$/;
const HEX = /^0x([0-9a-fA-F]{2})*$/;

/**
 * Converts what the user typed into the value web3 encodes for this ABI type.
 * Integers stay as decimal strings so values above 2^53 keep every digit.
 * With asTokenAmount, a uint is read as RC with decimals and converted to wei (18 decimals).
 */
export function parseArgument(param: AbiParam, raw: string, asTokenAmount = false): ParsedArgument {
  const text = raw.trim();
  const type = param.type;

  if (type.endsWith("]")) {
    if (!text) return { ok: false, error: "required" };
    let items: unknown;
    try {
      items = JSON.parse(text);
    } catch {
      return { ok: false, error: "json" };
    }
    if (!Array.isArray(items)) return { ok: false, error: "array" };
    const itemType = { ...param, type: type.slice(0, type.lastIndexOf("[")) };
    const values: unknown[] = [];
    for (const item of items) {
      const parsed = parseArgument(itemType, typeof item === "string" ? item : JSON.stringify(item));
      if (!parsed.ok) return parsed;
      values.push(parsed.value);
    }
    return { ok: true, value: values };
  }

  if (type === "tuple") {
    if (!text) return { ok: false, error: "required" };
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch {
      return { ok: false, error: "json" };
    }
  }

  if (type === "string") return { ok: true, value: raw };

  if (!text) return { ok: false, error: "required" };

  if (type.startsWith("uint") || type.startsWith("int")) {
    if (asTokenAmount && type.startsWith("uint")) {
      const wei = amountToWei(text);
      return wei === null ? { ok: false, error: "amount" } : { ok: true, value: wei };
    }
    if (!INTEGER.test(text)) return { ok: false, error: "integer" };
    if (type.startsWith("uint") && text.startsWith("-")) return { ok: false, error: "negative" };
    return { ok: true, value: BigInt(text).toString() };
  }

  if (type === "address") {
    return utils.isAddress(text) ? { ok: true, value: utils.toChecksumAddress(text) } : { ok: false, error: "address" };
  }

  if (type === "bool") {
    const lower = text.toLowerCase();
    if (lower === "true" || lower === "1") return { ok: true, value: true };
    if (lower === "false" || lower === "0") return { ok: true, value: false };
    return { ok: false, error: "bool" };
  }

  if (type.startsWith("bytes")) {
    if (!HEX.test(text)) return { ok: false, error: "hex" };
    const size = Number(type.slice(5));
    if (size && text.length !== 2 + size * 2) return { ok: false, error: "bytes32" };
    return { ok: true, value: text };
  }

  return { ok: true, value: text };
}

export interface ResultNode {
  label: string;
  type: string;
  value?: string;
  children?: ResultNode[];
}

function formatValue(param: AbiParam, value: unknown, label: string): ResultNode {
  if (param.type.endsWith("]")) {
    const itemParam = { ...param, type: param.type.slice(0, param.type.lastIndexOf("[")) };
    const items = Array.isArray(value) ? value : [];
    return {
      label,
      type: param.type,
      value: items.length === 0 ? "[]" : undefined,
      children: items.map((item, index) => formatValue(itemParam, item, `[${index}]`)),
    };
  }
  if (param.type === "tuple") {
    const record = (value ?? {}) as Record<string, unknown>;
    return {
      label,
      type: param.type,
      children: (param.components ?? []).map((component, index) =>
        formatValue(component, record[component.name] ?? record[index], component.name || `[${index}]`)
      ),
    };
  }
  return { label, type: param.type, value: stringifyScalar(value) };
}

function stringifyScalar(value: unknown): string {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null || value === undefined) return "";
  return String(value);
}

/**
 * Shapes a web3 call result into labelled nodes: a single output arrives as the value itself,
 * several outputs arrive as an object indexed by position and name.
 */
export function formatCallResult(outputs: AbiParam[], result: unknown): ResultNode[] {
  if (outputs.length === 1) {
    return [formatValue(outputs[0], result, outputs[0].name || "")];
  }
  const record = (result ?? {}) as Record<string, unknown>;
  return outputs.map((output, index) =>
    formatValue(output, record[index] ?? record[output.name], output.name || `[${index}]`)
  );
}

/** Pulls the revert reason out of a web3 error, falling back to its message. */
export function contractErrorMessage(error: unknown): string {
  const err = error as { message?: string; reason?: string; cause?: { message?: string; reason?: string }; innerError?: { message?: string } };
  const reason = err?.reason ?? err?.cause?.reason ?? err?.innerError?.message ?? err?.cause?.message ?? err?.message ?? "";
  return reason.replace(/^.*execution reverted:?\s*/i, "") || reason;
}
