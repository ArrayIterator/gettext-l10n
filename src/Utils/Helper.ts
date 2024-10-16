import {Scalar} from './Type';

const bigIntMax: bigint = BigInt(Number.MAX_SAFE_INTEGER);
const bigIntMin: bigint = BigInt(Number.MIN_SAFE_INTEGER);
export const ENTITY_REFERENCE: {
    [key: string]: string;
} = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': '\'',
    '&apos;': '\'',
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&cent;': '¢',
    '&pound;': '£',
    '&yen;': '¥',
    '&euro;': '€',
    '&sect;': '§',
    '&para;': '¶',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&laquo;': '«',
    '&raquo;': '»',
    '&lsaquo;': '‹',
    '&rsaquo;': '›',
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&bdquo;': '„',
    '&lsquo;': '‘',
    '&rsquo;': '’',
    '&sbquo;': '‚',
    '&iexcl;': '¡',
    '&iquest;': '¿',
    '&brvbar;': '¦',
    '&uml;': '¨',
    '&macr;': '¯',
    '&acute;': '´',
    '&cedil;': '¸',
    '&circ;': 'ˆ',
    '&tilde;': '˜',
    '&deg;': '°',
    '&ordf;': 'ª',
    '&ordm;': 'º',
    '&sup1;': '¹',
    '&sup2;': '²',
    '&sup3;': '³',
    '&frac14;': '¼',
    '&frac12;': '½',
    '&frac34;': '¾',
    '&times;': '×',
    '&divide;': '÷',
    '&micro;': 'µ',
    '&middot;': '·',
    '&bull;': '•',
    '&dagger;': '†',
    '&Dagger;': '‡',
    '&permil;': '‰',
    '&prime;': '′',
    '&Prime;': '″',
    '&oline;': '‾',
    '&curren;': '¤',
    '&brkbar;': '¦',
};
const HTML_ENTITY_REFERENCE_FLIPPED: {
    [key: string]: string;
} = {};
Object.freeze(ENTITY_REFERENCE); // freeze

/**
 * Regular expression for entity reference
 */
const REGEX_ENTITY_REFERENCE :RegExp = new RegExp(Object.keys(ENTITY_REFERENCE).join('|') + '|&#[0-9]{1,3};', 'g');

/**
 * Generate translation id
 *
 * @param {string} original the original
 * @param {string|undefined} context the context
 */
export const generateTranslationId = (original:string, context?:string) : string => {
    original = original + '';
    context = is_string(context) ? context : undefined;
    if (context === undefined) {
        return original;
    }
    return `${context}\x04${original}`;
}

/**
 * Normalize Header name
 */
export const normalizeHeaderName = (name: string): string => {
    if (!is_string(name)) {
        return '';
    }
    name = name.trim();
    if (name === '') {
        return '';
    }
    name = name.replace(/[\s\-_]+/g, '-');
    name = name.replace(/(^-|-$)/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '');
    if (name === '') {
        return '';
    }
    // ucwords on after (-)
    name = name.toLowerCase().replace(/(^|-)([a-z])/g, (_m, p1, p2) => {
        return p1 + p2.toUpperCase();
    });
    // po, pot & mime to uppercase
    name = name.replace(/^(mime|pot?)-/i, (_m, p1) => {
        return p1.toUpperCase() + '-';
    });
    return name;
}

/**
 * Normalize header value
 */
export const normalizeHeaderValue = (value: any): string => {
    // convert the value to string
    value = string_scalar_value(value);
    if (value === '') {
        return '';
    }
    value = string_scalar_value(value);
    // replace non-acceptable characters
    const replacer: {
        [key: string]: string;
    } = {
        '\x09' : ' ', // horizontal tab (HT or 0x09 (9) in ASCII) = \t
        '\x0d' : '', // carriage return (CR or 0x0D (13) in ASCII) = \r
        '\x0a' : ' ', // linefeed (LF or 0x0A (10) in ASCII) = \n
        '\x0b' : '', // vertical tab (VT or 0x0B (11) in ASCII) = \v
        '\f'   : '', // form feed (FF or 0x0C (12) in ASCII) = \f
        '\x1B' : '', // escape (ESC or 0x1B (27) in ASCII)
        '\x08' : '',
        '\x07' : '',
    };
    for (let key in replacer) {
        value = value.replaceAll(key, replacer[key])
    }
    return value;
}

/**
 * Unescape the string
 *
 * @param {string} str
 */
export const decode_entities = (str: string): string => {
    str = str + '';
    if (!str.match(/&([a-z]+|#[0-9]{1,3});/)) {
        return str;
    }
    return str.replace(REGEX_ENTITY_REFERENCE, (m :string) : string => {
        if (m.substring(0, 2) === '&#') {
            let code = parseInt(m.substring(2, m.length - 1), 10);
            return String.fromCharCode(code);
        }
        return ENTITY_REFERENCE[m] || m;
    });
}

/**
 * Escape the string
 * @param {string} str
 *
 * @return {string}
 */
export const encode_entities = (str: string): string => {
    str = decode_entities(str);
    if (!str.match(/[&<>"']/)) {
        return str;
    }
    if (Object.keys(HTML_ENTITY_REFERENCE_FLIPPED).length === 0) {
        for (let key in ENTITY_REFERENCE) {
            HTML_ENTITY_REFERENCE_FLIPPED[ENTITY_REFERENCE[key]] = key;
        }
    }
    const RegExpEntityReference = new RegExp(Object.keys(HTML_ENTITY_REFERENCE_FLIPPED).join('|'), 'g');
    return str.replace(RegExpEntityReference, (m :string) : string => {
        return HTML_ENTITY_REFERENCE_FLIPPED[m] || m;
    });
}

/**
 * Finds the length of the initial segment of a string consisting entirely of characters contained within a given mask.
 *
 * @param {string} input - The input string.
 * @param {string} mask - The mask of allowed characters.
 * @param {number} [start=0] - The position in the string to start searching.
 * @param {number} [length=str.length] - The length of the segment to consider.
 * @return {number} The length of the initial segment containing only characters from the mask.
 */
export const strspn = (input : string, mask: string, start: number = 0, length: number = input.length) : number => {
    // Ensure the start and length are within the bounds of the string
    start = Math.max(0, start);
    length = Math.min(input.length - start, length);

    let count = 0;
    for (let i = start; i < start + length; i++) {
        if (mask.indexOf(input[i]) === -1) {
            break;
        }
        count++;
    }
    return count;
}

/**
 * Sub
 * @param {string} input The input string.
 * @param {number} start If start is non-negative, the returned string will start at the start position in string, counting from zero. For instance, in the string 'abcdef', the character at position 0 is 'a', the character at position 2 is 'c', and so forth.
 * @param {number|null} length If length is given and is positive, the string returned will contain at most length characters beginning from start (depending on the length of string).
 *
 * @return Returns the portion of string specified by the offset and length parameters.
 */
export const substr = (input: string, start: number, length?: number): string => {
    start = parseInt(start + '');
    const inputLength = input.length
    let end = inputLength

    if (start < 0) {
        start += end
    }

    if (typeof length !== 'undefined') {
        if (length < 0) {
            end = length + end;
        } else {
            end = length + start;
        }
    }

    if (start > inputLength || start < 0 || start > end) {
        return '';
    }

    return input.slice(start, end);
}

/**
 * Check if the parameter is a big integer
 */
export const is_bigint = (param: any): param is bigint => {
    return typeof param === 'bigint';
}

/**
 * Check if the parameter is a big integer or big number
 */
export const is_bigint_number = (param: any): param is bigint | string => {
    return is_bigint(param)
        || is_numeric(param) && (
            bigIntMax < BigInt(param) // positive
            || bigIntMin > BigInt(param) // negative
        ); // check if the number is greater than the maximum safe integer
}

/**
 * Check if the parameter is a numeric value
 */
export const is_numeric = (param: any): param is number | bigint | string => {
    return is_number(param) || is_bigint(param) || (typeof param === 'string' && /^\d+(\.\d+)?$/.test(param));
}

/**
 * Check if the parameter is a number
 */
export const is_number = (param: any): param is number => {
    return typeof param === 'number';
}

/**
 * Check if the parameter is a numeric integer or a string that represents an integer
 */
export const is_numeric_integer = (param: any): param is number | string => {
    return is_integer(param) || (is_string(param) && /^\d+$/.test(param));
}

/**
 * Check if the parameter is an integer
 */
export const is_integer = (param: any): param is number => {
    return is_number(param) && Number.isInteger(param);
}

/**
 * Convert the parameter to an integer
 */
export const is_string = (param: any): param is string => {
    return typeof param === 'string';
}

/**
 * Check if the parameter is a scalar value
 */
export const is_scalar = (param: any): Scalar<typeof param> => {
    return ['string', 'number', 'bigint', 'boolean'].includes(typeof param);
}

/**
 * Normalize number
 */
export const normalize_number = (param: any): number | bigint => {
    if (!is_numeric(param)) {
        return 0; // default value 0 for invalid number
    }
    if (is_bigint_number(param)) {
        param = BigInt(param);
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
        if (param > bigIntMin && param < bigIntMax) {
            return Number(param.toString());
        }
        return param;
    }
    return Number(param);
}

/**
 * Check if the parameter is undefined
 */
export const is_undefined = (param: any): param is undefined => {
    return typeof param === 'undefined';
}

/**
 * Check if param is object and not null
 */
export const is_object = (param: any): param is object => {
    return param !== null && typeof param === 'object';
}

/**
 * Convert scalar value
 */
export const string_scalar_value = (param: any): string => {
    if (!is_scalar(param)) {
        return '';
    }
    if (is_string(param)) {
        return param.toString(); // make real string neither String object
    }
    if (is_numeric(param)) {
        return param.toString();
    }
    return param ? '1' : '0';
}

/**
 * Check if the parameter is an arraybuffer like
 */
export const is_array_buffer_like_or_view = (param: any): param is ArrayBufferLike => {
    return param instanceof ArrayBuffer || param instanceof SharedArrayBuffer || ArrayBuffer.isView(param);
}

/**
 * @template T
 * Deep freeze the object
 * @param {T} o
 * @return {T}
 */
export const deep_freeze = <T extends any | object>(o: T): T => {
    if (o && typeof o === 'object') {
        for (let i in o) {
            if (o.hasOwnProperty(i)) {
                o[i] = deep_freeze(o[i]);
            }
        }
        return Object.freeze(o);
    }
    return o;
}
