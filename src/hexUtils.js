import { Buffer } from "buffer";

/**
 * Parses input data, attempting to handle hexadecimal, base64, and binary formats.
 *
 * @param {string|Buffer|ArrayBuffer|Uint8Array} input - The input data to parse.
 * @returns {Buffer|null} - The parsed data as a Buffer, or null if parsing fails.
 *
 * @example
 * parseInput("0x1a2b3c"); // Returns Buffer<1a 2b 3c>
 * parseInput("AQID"); // Returns Buffer<01 02 03>
 * parseInput(Buffer.from([1, 2, 3])); // Returns Buffer<01 02 03>
 * parseInput(new Uint8Array([1,2,3]).buffer); // Returns Buffer<01 02 03>
 * parseInput(new Uint8Array([1,2,3])); // Returns Buffer<01 02 03>
 * parseInput("invalid"); // Returns null
 */
export function parseInput(input) {
  if (typeof input === "string") {
    const normalizedInput = input.replace(/\s/g, "");
    const normalizedHexInput = normalizedInput.replace(/0x/g, "").toLowerCase();

    if (isHex(normalizedHexInput)) {
      return Buffer.from(normalizedHexInput, "hex");
    } else {
      try {
        return Buffer.from(normalizedInput, "base64");
      } catch (e) {
        return null;
      }
    }
  } else if (Buffer.isBuffer(input)) {
    return input; // Directly return Buffer input
  } else if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
    return Buffer.from(input); // Convert ArrayBuffer or Uint8Array to Buffer
  } else {
    return null; // Handle other input types as invalid
  }
}

/**
 * Checks if a string is a valid hexadecimal string.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is hexadecimal, false otherwise.
 */
function isHex(str) {
  return /^[0-9a-fA-F]+$/.test(str);
}

export function bufferLeToBeHex(buffer) {
  let output = "";
  for (const v of buffer) {
    const hex = v.toString(16);
    if (hex.length === 1) {
      output = "0" + hex + output;
    } else {
      output = hex + output;
    }
  }
  return output;
}

export const bufferToPrettyHex = (b) =>
  [...b].map((c) => c.toString(16).padStart(2, "0")).join(" ");
