/** 
 * Merges 2-dimensional arrays into a single 1-dimensional array 
 * Uses the flat() method to concatenate sub-array elements.
 *
 * @param arr - A 2-dimensional array to be flattened.
 * @returns A single 1-dimensional array containing all the elements.
 * 
 * @example
 * // Flatten a 2-dimensional array
 * const flatArray = flatten([[1, 2], [3, 4]]); // [1, 2, 3, 4]
 *
 * @example
 * // Flatten an array with multiple sub-arrays
 * const flatArray = flatten([[1, 2], [3, 4], [5, 6]]); // [1, 2, 3, 4, 5, 6]
 */
export function flatten<T>(arr: T[][]): T[] {
  // The flat() method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth
  return arr.flat();
}

/**
 * Helper function to check if a value is an object.
 * Determines whether the value is a pure object (not array, not function, etc.)
 * 
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 * 
 * @example
 * // Check if a value is an object
 * const isObj = isObject({ key: 'value' }); // true
 * 
 * @example
 * // Check if a value is not an object
 * const isNotObj = isObject('string'); // false
 *
 * @example
 * // Check if an array is an object
 * const isNotObj = isObject([1, 2, 3]); // false
 */
export function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Determines if an object is empty
 * Uses Object.keys to check if the object has any properties.
 * 
 * @param obj - The object to check.
 * @returns True if the object is empty, false otherwise.
 * 
 * @example
 * // Check if an object is empty
 * const empty = isEmpty({}); // true
 * 
 * @example
 * // Check if an object is not empty
 * const notEmpty = isEmpty({ key: 'value' }); // false
 */
export function isEmpty<T extends object>(obj: T): boolean {
  // Uses Object.keys to check if the object has any properties
  return Object.keys(obj).length === 0;
}

/**
 * Acts like array.map(...) but for objects
 * Iterates over object keys and applies the function to each key-value pair.
 * 
 * @param obj - The object to map over.
 * @param fn - The function to apply to each value.
 * @returns A new object with the mapped values.
 * 
 * @example
 * // Map over an object
 * const mapped = mapObject({ a: 1, b: 2 }, (value) => value * 2); // { a: 2, b: 4 }
 * 
 * @example
 * // Map over an object with keys
 * const mapped = mapObject({ a: 1, b: 2 }, (value, key) => `${key}-${value}`); // { a: 'a-1', b: 'b-2' }
 */
export function mapObject<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string, obj: Record<string, T>) => U
): Record<string, U> {
  // Initialize an empty object to store the results
  const result: Record<string, U> = {};
  // Get all the keys of the input object
  const keys = Object.keys(obj);
  // Iterate over each key and apply the function to each key-value pair
  for (const key of keys) {
    result[key] = fn(obj[key], key, obj);
  }
  return result;
}

/**
 * Converts values to strings
 * Uses String to convert the input to a string.
 * 
 * @param input - The value to convert to a string.
 * @returns The string representation of the input.
 * 
 * @example
 * // Convert a number to a string
 * const str = toStr(123); // "123"
 * 
 * @example
 * // Convert a boolean to a string
 * const str = toStr(true); // "true"
 */
export function toStr(input: unknown): string {
  // Uses String constructor to convert the input to a string
  return String(input);
}

/**
 * Convert value to string, then trim any extra white space and line terminator characters from the string
 * 
 * @param str - The string to trim.
 * @returns The trimmed string.
 * 
 * @example
 * // Trim a string with extra spaces
 * const trimmed = trim("  hello  "); // "hello"
 */
export function trim(str: unknown): string {
  // Convert the input to a string and trim whitespace
  return toStr(str).trim();
}

/**
 * Returns the unit of a string, it does this by removing the number in the string
 * Parses the string to a float number and replaces the number part with an empty string to get the unit.
 * 
 * @param str - The string to extract the unit from.
 * @returns The unit part of the string.
 * 
 * @example
 * // Get the unit from a string with a number
 * const unit = getUnit("100px"); // "px"
 * 
 * @example
 * // Get the unit from a string with a percentage
 * const unit = getUnit("50%"); // "%"
 */
export function getUnit(str: string | number): string {
  // Parse the string to a float number
  const num = parseFloat(String(str));
  // Replace the number part with an empty string to get the unit
  return toStr(str).replace(toStr(num), "");
}

/**
 * Convert the input to an array
 * For strings, split the string at spaces
 * For arrays, return the input as is
 * For everything else, wrap the input in an array
 * 
 * @param input - The input to convert to an array.
 * @returns An array form of the input.
 * 
 * @example
 * // Convert a string to an array
 * const arr = toArr("a b c"); // ["a", "b", "c"]
 * 
 * @example
 * // Convert a number to an array
 * const arr = toArr(5); // [5]
 */
export function toArr(input: unknown): unknown[] {
  if (typeof input === 'string') return input.split(/\s+/);
  if (Array.isArray(input)) return input;
  return [input];
}

/**
 * Checks if a value is valid/truthy; it counts empty arrays and strings as falsey,
 * as well as null, undefined, and NaN, everything else is valid
 *
 * > **Note**: 0 counts as valid
 * > **Note**: Checks for and marks empty arrays and strings, null, undefined, and NaN as invalid
 *
 * @param value - Anything to check for validity.
 * @returns true or false
 * 
 * @example
 * // Check if 0 is valid
 * const valid = isValid(0); // true
 * 
 * @example
 * // Check if an empty string is valid
 * const invalid = isValid(""); // false
 */
export function isValid(value: unknown): boolean {
  if (Array.isArray(value) || typeof value === 'string') return value.length > 0;
  return value != null && !Number.isNaN(value);
}

/**
 * Convert a camelCase string to a kebab-case string
 * 
 * @param camelCaseStr - The camelCase string to convert.
 * @returns The kebab-case string.
 * 
 * @example
 * // Convert a camelCase string to kebab-case
 * const kebab = camelCaseToKebabCase("camelCase"); // "camel-case"
 */
export function camelCaseToKebabCase(camelCaseStr: string): string {
  // Replace uppercase letters with a dash followed by the lowercase letter
  return camelCaseStr.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

/**
 * Convert a kebab-case string into camelCase. 
 * If there is a double dash, which may indicate a different convention,
 * we avoid changing these strings to camelCase to preserve their intended format.
 * 
 * @param kebabCaseStr - The kebab-case string to convert.
 * @returns The camelCase string.
 * 
 * @example
 * // Convert a kebab-case string to camelCase
 * const camel = kebabCaseToCamelCase("kebab-case"); // "kebabCase"
 * 
 * @example
 * // Do NOT convert a double dash-separated string to camelCase
 * const camel = kebabCaseToCamelCase("--kebab-case"); // "--kebab-case"
 */
export function kebabCaseToCamelCase(kebabCaseStr: string): string {
  // The double dash check is required to handle cases where there are multiple dashes which may indicate a different convention
  // We avoid changing these strings to camelCase to preserve their intended format
  if (/--/.test(kebabCaseStr)) return kebabCaseStr;
  // Replace dashes followed by a letter with the uppercase version of the letter
  return kebabCaseStr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Return a copy of the object without the keys specified in the keys argument
 *
 * @param keys - Array of keys to remove from the object
 * @param obj - The object in question
 * @returns A copy of the object without certain keys
 *
 * @example
 * // Omit a key from an object
 * const obj = { a: 1, b: 2, c: 3 };
 * const result = omit(['b'], obj); // { a: 1, c: 3 }
 */
export function omit<T extends Record<string, unknown>>(keys: string[], obj: T): Partial<T> {
  // Create a set of keys to omit for faster lookup
  const omitSet = new Set(keys);
  // Create a shallow copy of the object using Object.assign to avoid modifying the original object
  const result: Partial<T> = Object.assign({}, obj);
  // Iterate over the keys in the set and delete them from the result object
  for (const key of omitSet) {
    delete result[key];
  }
  return result;
}

/**
 * Return a copy of the object with only the keys specified in the keys argument.
 *
 * @param keys - Array of keys to keep from the object.
 * @param obj - The object in question.
 * @returns A copy of the object with only certain keys.
 *
 * @example
 * // Pick certain keys from an object
 * const obj = { a: 1, b: 2, c: 3 };
 * const result = pick(['a', 'c'], obj); // { a: 1, c: 3 }
 */
export function pick<T extends Record<PropertyKey, unknown>>(keys: (keyof T)[], obj: T): Partial<T> {
  // Initialize the result object as an empty object of type Partial<T>
  const result: Partial<T> = {};

  // Iterate over the keys and add them to the result if they exist in the object and are valid
  for (const key of keys) {
    if (isValid(obj[key])) {
      // Use type assertion to assure TypeScript that it is safe to write to the result object
      result[key] = obj[key] as T[keyof T];
    }
  }

  return result;
}

/**
 * Flips the rows and columns of 2-dimensional arrays.
 * Finds the length of the longest array, creates an array of arrays where each sub-array represents a column, and maps over the rows to get the values, filtering out invalid values.
 *
 * Read more on [underscorejs.org](https://underscorejs.org/#zip) & [lodash.com](https://lodash.com/docs/4.17.15#zip)
 *
 * @example
 * // Transpose rows and columns of 2D arrays
 * transpose(
 *   ['moe', 'larry', 'curly'],
 *   [30, 40, 50],
 *   [true, false, false]
 * );
 * // [
 * //   ["moe", 30, true],
 * //   ["larry", 40, false],
 * //   ["curly", 50, false]
 * // ]
 * @param args - The arrays to process as a set of arguments
 * @returns The new array of grouped elements
 */
export function transpose(args: unknown[][]): unknown[][] {
  // Find the length of the longest array
  const maxLength = Math.max(...args.map(arr => arr.length));
  // Create an array of arrays where each sub-array represents a column
  return Array.from({ length: maxLength }, (_, colIndex) =>
    // For each column, map over the rows to get the values, and filter out invalid values
    args.map(row => row[colIndex]).filter(isValid)
  );
}