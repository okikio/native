import { hslToRgb, hexToRgb, hsvToRgb, hwbToRgb, xyzToSrgb, cmykToRgb, labToXyz, lchToLab, oklabToSrgb, yCbCrBT601ToSrgb, yCbCrBT709ToSrgb, yCgCoToSrgb, yDbDrToSrgb, yiqToSrgb, yPbPrToSrgb, ycCbcCrcToSrgb, lmsToXyz, luvToXyz, hunterLabToXyz, lch_abToXyz, lch_uvToXyz } from "@dynimorius/color-utilities/src/index.ts";
import * as colors from "./colors.ts"; // Assuming `colors` is predefined

/**
 * Converts angle units to degrees.
 * @param {string} value - The angle value with unit.
 * @returns {number} - The angle in degrees.
 */
export function convertAngleToDegrees(value: string): number {
  if (value.endsWith('deg')) {
    return parseFloat(value);
  } else if (value.endsWith('grad')) {
    return parseFloat(value) * 0.9;
  } else if (value.endsWith('rad')) {
    return parseFloat(value) * (180 / Math.PI);
  } else if (value.endsWith('turn')) {
    return parseFloat(value) * 360;
  }
  return parseFloat(value);
}

/**
 * Parses a CSS color value and converts it to an RGBA color.
 *
 * @param {string} color - The CSS color value to be parsed.
 * @returns {number[]} - The RGBA representation of the color.
 */
export function parseColorToRgba(color: string): number[] | null {
  color = color.trim().toLowerCase();

  // Check for variables or dynamic properties
  if (color.startsWith('var(') || color.startsWith('env(')) {
    return null; // Skip variables and dynamic properties
  }

  // Named colors
  if (colors[color]) {
    return colors[color];
  }

  // Transparent keyword
  if (color === 'transparent') {
    return [0, 0, 0, 0];
  }

  // Hex colors
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }

  // CSS color functions and other color spaces
  const colorFunctionMatch = color.match(/^([a-z]+)\(([^)]+)\)$/);
  if (colorFunctionMatch) {
    const functionName = colorFunctionMatch[1];
    const functionArgs = colorFunctionMatch[2].split(/,\s*|\s+/).map(arg => arg.trim());

    switch (functionName) {
      case 'rgb':
      case 'rgba':
        return [
          parseFloat(functionArgs[0]),
          parseFloat(functionArgs[1]),
          parseFloat(functionArgs[2]),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'hsl':
      case 'hsla':
        return [
          ...Object.values(hslToRgb({
            hue: convertAngleToDegrees(functionArgs[0]),
            saturation: parseFloat(functionArgs[1]),
            lightness: parseFloat(functionArgs[2])
          })),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'hsv':
      case 'hsva':
        return [
          ...Object.values(hsvToRgb({
            hue: convertAngleToDegrees(functionArgs[0]),
            saturation: parseFloat(functionArgs[1]),
            value: parseFloat(functionArgs[2])
          })),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'hwb':
        return [
          ...Object.values(hwbToRgb({
            hue: convertAngleToDegrees(functionArgs[0]),
            whiteness: parseFloat(functionArgs[1]),
            blackness: parseFloat(functionArgs[2])
          })),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'cmyk':
        return [
          ...Object.values(cmykToRgb({
            cyan: parseFloat(functionArgs[0]),
            magenta: parseFloat(functionArgs[1]),
            yellow: parseFloat(functionArgs[2]),
            black: parseFloat(functionArgs[3])
          })),
          functionArgs[4] !== undefined ? parseFloat(functionArgs[4]) : 1
        ];
      case 'lab':
        return [
          ...labToSrgb([
            parseFloat(functionArgs[0]),
            parseFloat(functionArgs[1]),
            parseFloat(functionArgs[2])
          ]),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'lch':
        return [
          ...labToSrgb(lchToLab([
            parseFloat(functionArgs[0]),
            parseFloat(functionArgs[1]),
            convertAngleToDegrees(functionArgs[2])
          ])),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'oklab':
        return [
          ...oklabToSrgb([
            parseFloat(functionArgs[0]),
            parseFloat(functionArgs[1]),
            parseFloat(functionArgs[2])
          ]),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'oklch':
        return [
          ...oklabToSrgb(oklchToOklab([
            parseFloat(functionArgs[0]),
            parseFloat(functionArgs[1]),
            convertAngleToDegrees(functionArgs[2])
          ])),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'xyz':
        return [
          ...xyzToSrgb([
            parseFloat(functionArgs[0]),
            parseFloat(functionArgs[1]),
            parseFloat(functionArgs[2])
          ]),
          functionArgs[3] !== undefined ? parseFloat(functionArgs[3]) : 1
        ];
      case 'color':
        const colorSpace = functionArgs.shift();
        const colorValues = functionArgs.map(parseFloat);
        return [
          ...colorSpaceToRgb(colorSpace!, colorValues),
          colorValues[3] !== undefined ? colorValues[3] : 1
        ];
      // Add more cases as needed for other color functions
      default:
        return null;
    }
  }

  // Handle numeric values (e.g., 0xRRGGBB)
  if (typeof color === 'number') {
    return [color >>> 16, (color & 0x00ff00) >>> 8, color & 0x0000ff, 1];
  }

  // Handle percentage values
  const percentageMatch = color.match(/^(\d+)%\s+(\d+)%\s+(\d+)%(\s+\/\s+(\d+(\.\d+)?%?))?$/);
  if (percentageMatch) {
    const red = parseInt(percentageMatch[1], 10) * 2.55;
    const green = parseInt(percentageMatch[2], 10) * 2.55;
    const blue = parseInt(percentageMatch[3], 10) * 2.55;
    const alpha = percentageMatch[5] ? parseFloat(percentageMatch[5]) : 1;
    return [red, green, blue, alpha];
  }

  // Fallback
  return null;
}



/**
 * Converts LCH to LAB.
 * @param {number[]} values - The LCH values.
 * @returns {number[]} - The LAB values.
 * @example
 * const lab = lchToLab([50, 60, 270]);
 * // lab = [50, 0, -60]
 */
export function lchToLab([l, c, h]: [number, number, number]): [number, number, number] {
  const hr = (h * Math.PI) / 180;
  return [l, c * Math.cos(hr), c * Math.sin(hr)];
}

/**
 * Converts OKLCH to OKLAB.
 * @param {number[]} values - The OKLCH values.
 * @returns {number[]} - The OKLAB values.
 * @example
 * const oklab = oklchToOklab([50, 60, 270]);
 * // oklab = [50, 0, -60]
 */
export function oklchToOklab([l, c, h]: [number, number, number]): [number, number, number] {
  const hr = (h * Math.PI) / 180;
  return [l, c * Math.cos(hr), c * Math.sin(hr)];
}

/**
 * Converts LAB to XYZ.
 * @param {number[]} lab - The LAB values.
 * @returns {number[]} - The XYZ values.
 * @example
 * const xyz = labToXyz([50, 0, 0]);
 * // xyz = [0.3457, 0.3585, 0.4125]
 */
export function labToXyz([l, a, b]: [number, number, number]): [number, number, number] {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xr = Math.pow(fx, 3) > 0.008856 ? Math.pow(fx, 3) : (116 * fx - 16) / 903.3;
  const yr = l > (903.3 * 0.008856) ? Math.pow((l + 16) / 116, 3) : l / 903.3;
  const zr = Math.pow(fz, 3) > 0.008856 ? Math.pow(fz, 3) : (116 * fz - 16) / 903.3;

  return [
    xr * 0.95047,
    yr * 1.00000,
    zr * 1.08883
  ];
}

/**
 * Converts XYZ to sRGB.
 * @param {number[]} xyz - The XYZ values.
 * @returns {number[]} - The sRGB values.
 * @example
 * const rgb = xyzToSrgb([0.3457, 0.3585, 0.4125]);
 * // rgb = [0.5, 0.5, 0.5]
 */
export function xyzToSrgb([x, y, z]: [number, number, number]): [number, number, number] {
  let r = 3.2406 * x - 1.5372 * y - 0.4986 * z;
  let g = -0.9689 * x + 1.8758 * y + 0.0415 * z;
  let b = 0.0557 * x - 0.2040 * y + 1.0570 * z;

  r = r > 0.0031308 ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : 12.92 * r;
  g = g > 0.0031308 ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : 12.92 * g;
  b = b > 0.0031308 ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : 12.92 * b;

  return [r, g, b];
}

/**
 * Converts LAB to sRGB.
 * @param {number[]} lab - The LAB values.
 * @returns {number[]} - The sRGB values.
 * @example
 * const rgb = labToSrgb([50, 0, 0]);
 * // rgb = [0.5, 0.5, 0.5]
 */
export function labToSrgb(lab: [number, number, number]): [number, number, number] {
  const xyz = labToXyz(lab);
  return xyzToSrgb(xyz);
}

/**
 * Converts OKLAB to XYZ.
 * @param {number[]} oklab - The OKLAB values.
 * @returns {number[]} - The XYZ values.
 * @example
 * const xyz = oklabToXyz([50, 0, 0]);
 * // xyz = [0.3457, 0.3585, 0.4125]
 */
export function oklabToXyz([l, a, b]: [number, number, number]): [number, number, number] {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = Math.pow(l_, 3);
  const m3 = Math.pow(m_, 3);
  const s3 = Math.pow(s_, 3);

  return [
    l3 * 0.4122214708 + m3 * 0.5363325363 + s3 * 0.0514459929,
    l3 * 0.2119034982 + m3 * 0.6806995451 + s3 * 0.1073969566,
    l3 * 0.0883024619 + m3 * 0.2817188376 + s3 * 0.6299787005
  ];
}

/**
 * Converts OKLAB to sRGB.
 * @param {number[]} oklab - The OKLAB values.
 * @returns {number[]} - The sRGB values.
 * @example
 * const rgb = oklabToSrgb([50, 0, 0]);
 * // rgb = [0.5, 0.5, 0.5]
 */
export function oklabToSrgb(oklab: [number, number, number]): [number, number, number] {
  const xyz = oklabToXyz(oklab);
  return xyzToSrgb(xyz);
}

/**
 * Converts from any color space to sRGB.
 * @param {string} space - The color space.
 * @param {number[]} values - The color values.
 * @returns {number[]} - The sRGB values.
 * @example
 * const rgb = colorSpaceToRgb('display-p3', [0.5, 0.5, 0.5]);
 * // rgb = [0.5, 0.5, 0.5]
 */
export function colorSpaceToRgb(space: string, values: number[]): number[] {
  switch (space) {
    case 'display-p3':
      return xyzToSrgb(displayP3ToXyz(values));
    case 'a98-rgb':
      return xyzToSrgb(adobe98RgbToXyz(values));
    case 'prophoto-rgb':
      return xyzToSrgb(proPhotoRgbToXyz(values));
    case 'rec2020':
      return xyzToSrgb(rec2020ToXyz(values));
    default:
      throw new Error(`Unsupported color space: ${space}`);
  }
}

/**
 * Converts Display-P3 to XYZ.
 * @param {number[]} values - The Display-P3 values.
 * @returns {number[]} - The XYZ values.
 * @example
 * const xyz = displayP3ToXyz([0.5, 0.5, 0.5]);
 * // xyz = [0.3457, 0.3585, 0.4125]
 */
export function displayP3ToXyz([r, g, b]: [number, number, number]): [number, number, number] {
  return [
    r * 0.4865709486482162 + g * 0.26566769316909306 + b * 0.1982172852343625,
    r * 0.2289745640697488 + g * 0.6917385218365064 + b * 0.07928691493707307,
    r * 0.0000000000000000 + g * 0.04511338185890264 + b * 1.0439443689009752
  ];
}

/**
 * Converts Adobe 98 RGB to XYZ.
 * @param {number[]} values - The Adobe 98 RGB values.
 * @returns {number[]} - The XYZ values.
 * @example
 * const xyz = adobe98RgbToXyz([0.5, 0.5, 0.5]);
 * // xyz = [0.47524, 0.47575, 0.54971]
 */
export function adobe98RgbToXyz([r, g, b]: [number, number, number]): [number, number, number] {
  return [
    r * 0.5767309 + g * 0.1855540 + b * 0.1881852,
    r * 0.2973769 + g * 0.6273491 + b * 0.0752741,
    r * 0.0270343 + g * 0.0706872 + b * 0.9911085
  ];
}

/**
 * Converts ProPhoto RGB to XYZ.
 * @param {number[]} values - The ProPhoto RGB values.
 * @returns {number[]} - The XYZ values.
 * @example
 * const xyz = proPhotoRgbToXyz([0.5, 0.5, 0.5]);
 * // xyz = [0.48211, 0.49953, 0.41261]
 */
export function proPhotoRgbToXyz([r, g, b]: [number, number, number]): [number, number, number] {
  r = r <= 0.00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
  g = g <= 0.00304 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
  b = b <= 0.00304 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - 0.055;

  return [
    r * 0.7976749 + g * 0.1351917 + b * 0.0313534,
    r * 0.2880402 + g * 0.7118741 + b * 0.0000857,
    r * 0.0000000 + g * 0.0000000 + b * 0.8252100
  ];
}

/**
 * Converts Rec. 2020 to XYZ.
 * @param {number[]} values - The Rec. 2020 values.
 * @returns {number[]} - The XYZ values.
 * @example
 * const xyz = rec2020ToXyz([0.5, 0.5, 0.5]);
 * // xyz = [0.49023, 0.50015, 0.53454]
 */
export function rec2020ToXyz([r, g, b]: [number, number, number]): [number, number, number] {
  r = r <= 0.081 ? r / 4.5 : Math.pow((r + 0.099) / 1.099, 1 / 0.45);
  g = g <= 0.081 ? g / 4.5 : Math.pow((g + 0.099) / 1.099, 1 / 0.45);
  b = b <= 0.081 ? b / 4.5 : Math.pow((b + 0.099) / 1.099, 1 / 0.45);

  return [
    r * 0.6369580 + g * 0.1446169 + b * 0.1688809,
    r * 0.2627002 + g * 0.6779981 + b * 0.0593017,
    r * 0.0000000 + g * 0.0280722 + b * 1.0609851
  ];
}
