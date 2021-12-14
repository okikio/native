/** 
 * Based on color-rgba https://github.com/colorjs/color-rgba 
 */
import names from './colors';

export const hsl = {
    name: 'hsl',
    min: [0, 0, 0],
    max: [360, 100, 100],
    channel: ['hue', 'saturation', 'lightness'],
    alias: ['HSL'],

    rgb: function (hsl) {
        var h = hsl[0] / 360,
            s = hsl[1] / 100,
            l = hsl[2] / 100,
            t1, t2, t3, rgb, val;

        if (s === 0) {
            val = l * 255;
            return [val, val, val];
        }

        if (l < 0.5) {
            t2 = l * (1 + s);
        }
        else {
            t2 = l + s - l * s;
        }
        t1 = 2 * l - t2;

        rgb = [0, 0, 0];
        for (var i = 0; i < 3; i++) {
            t3 = h + 1 / 3 * - (i - 1);
            if (t3 < 0) {
                t3++;
            }
            else if (t3 > 1) {
                t3--;
            }

            if (6 * t3 < 1) {
                val = t1 + (t2 - t1) * 6 * t3;
            }
            else if (2 * t3 < 1) {
                val = t2;
            }
            else if (3 * t3 < 2) {
                val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
            }
            else {
                val = t1;
            }

            rgb[i] = val * 255;
        }

        return rgb;
    }
};


/**
 * Base hues
 * http://dev.w3.org/csswg/css-color/#typedef-named-hue
 */
//FIXME: use external hue detector
var baseHues = {
    red: 0,
    orange: 60,
    yellow: 120,
    green: 180,
    blue: 240,
    purple: 300
}

/**
 * Parse color from the string passed
 *
 * @return {Object} A space indicator `space`, an array `values` and `alpha`
 */
export const parse = (cstr) => {
    var m, parts = [], alpha = 1, space
    if (typeof cstr === 'string') {
        //keyword
        if (names[cstr]) {
            parts = names[cstr].slice()
            space = 'rgb'
        }

        //reserved words
        else if (cstr === 'transparent') {
            alpha = 0
            space = 'rgb'
            parts = [0, 0, 0]
        }

        //hex
        else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
            var base = cstr.slice(1)
            var size = base.length
            var isShort = size <= 4
            alpha = 1

            if (isShort) {
                parts = [
                    parseInt(base[0] + base[0], 16),
                    parseInt(base[1] + base[1], 16),
                    parseInt(base[2] + base[2], 16)
                ]
                if (size === 4) {
                    alpha = parseInt(base[3] + base[3], 16) / 255
                }
            }
            else {
                parts = [
                    parseInt(base[0] + base[1], 16),
                    parseInt(base[2] + base[3], 16),
                    parseInt(base[4] + base[5], 16)
                ]
                if (size === 8) {
                    alpha = parseInt(base[6] + base[7], 16) / 255
                }
            }

            if (!parts[0]) parts[0] = 0
            if (!parts[1]) parts[1] = 0
            if (!parts[2]) parts[2] = 0

            space = 'rgb'
        }

        //color space
        else if (m = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
            var name = m[1]
            var isRGB = name === 'rgb'
            var base: string = name.replace(/a$/, '');
            space = base
            var size = base === 'cmyk' ? 4 : base === 'gray' ? 1 : 3
            parts = m[2].trim()
                .split(/\s*[,\/]\s*|\s+/)
                .map(function (x, i) {
                    //<percentage>
                    if (/%$/.test(x)) {
                        //alpha
                        if (i === size) return parseFloat(x) / 100
                        //rgb
                        if (base === 'rgb') return parseFloat(x) * 255 / 100
                        return parseFloat(x)
                    }
                    //hue
                    else if (base[i] === 'h') {
                        //<deg>
                        if (/deg$/.test(x)) {
                            return parseFloat(x)
                        }
                        //<base-hue>
                        else if (baseHues[x] !== undefined) {
                            return baseHues[x]
                        }
                    }
                    return parseFloat(x)
                })

            if (name === base) parts.push(1)
            alpha = (isRGB) ? 1 : (parts[size] === undefined) ? 1 : parts[size]
            parts = parts.slice(0, size)
        }

        //named channels case
        else if (cstr.length > 10 && /[0-9](?:\s|\/)/.test(cstr)) {
            parts = cstr.match(/([0-9]+)/g).map(function (value) {
                return parseFloat(value)
            })

            space = cstr.match(/([a-z])/ig).join('').toLowerCase()
        }
    }

    //numeric case
    else if (!Number.isNaN(cstr)) {
        space = 'rgb'
        parts = [cstr >>> 16, (cstr & 0x00ff00) >>> 8, cstr & 0x0000ff]
    }

    //array-like
    else if (Array.isArray(cstr) || cstr.length) {
        parts = [cstr[0], cstr[1], cstr[2]]
        space = 'rgb'
        alpha = cstr.length === 4 ? cstr[3] : 1
    }

    //object case - detects css cases of rgb and hsl
    else if (cstr instanceof Object) {
        if (cstr.r != null || cstr.red != null || cstr.R != null) {
            space = 'rgb'
            parts = [
                cstr.r || cstr.red || cstr.R || 0,
                cstr.g || cstr.green || cstr.G || 0,
                cstr.b || cstr.blue || cstr.B || 0
            ]
        }
        else {
            space = 'hsl'
            parts = [
                cstr.h || cstr.hue || cstr.H || 0,
                cstr.s || cstr.saturation || cstr.S || 0,
                cstr.l || cstr.lightness || cstr.L || cstr.b || cstr.brightness
            ]
        }

        alpha = cstr.a || cstr.alpha || cstr.opacity || 1

        if (cstr.opacity != null) alpha /= 100
    }

    return {
        space: space,
        values: parts,
        alpha: alpha
    }
}

export const rgba = (color) => {
    // template literals
    // @ts-ignore
    if (Array.isArray(color) && color.raw) color = String.raw(...arguments)

    var values, i, l

    //attempt to parse non-array arguments
    var parsed = parse(color)

    if (!parsed.space) return []

    values = Array(3)
    values[0] = Math.min(Math.max(parsed.values[0], 0), 255)
    values[1] = Math.min(Math.max(parsed.values[1], 0), 255)
    values[2] = Math.min(Math.max(parsed.values[2], 0), 255)

    if (parsed.space[0] === 'h') {
        values = hsl.rgb(values)
    }

    values.push(Math.min(Math.max(parsed.alpha, 0), 1))

    return values
}

export default rgba;