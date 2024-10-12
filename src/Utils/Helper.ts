import {Scalar} from "./Type";

const bigIntMax: bigint = BigInt(Number.MAX_SAFE_INTEGER);
const bigIntMin: bigint = BigInt(Number.MIN_SAFE_INTEGER);

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
    name = name.replace(/(^-|-$)/g, '');
    if (name === '') {
        return '';
    }
    // ucwords on after (-)
    name = name.toLowerCase().replace(/(^|-)([a-z])/g, (_m, p1, p2) => {
        return p1 + p2.toUpperCase();
    });
    if (name.startsWith('Mime-')) {
        name = 'MIME-' + name.substring(5);
    }
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
    // replace non-acceptable characters
    const replacer: {
        [key: string]: string;
    } = {
        "\t": ' ',
        "\r": '',
        "\n": ' ',
        "\v": '',
        "\f": '',
        "\e": '',
        "\x08": '',
        "\x07": '',
    };
    for (let key in replacer) {
        value = value.replace(key, replacer[key]);
    }
    return value;
}

/**
 * Finds the length of the initial segment of a string consisting entirely of characters contained within a given mask.
 */
export const strspn = (string: string, characters: string, offset: number = 0, length: number | null = null): number => {
    // check if the parameters are valid
    if (!is_string(string)
        || !is_string(characters)
        || !is_numeric_integer(offset)
        || (length !== null && !is_numeric_integer(length))
        || string.length === 0 || characters.length === 0 // if the string or characters are empty
    ) {
        return 0; // return 0 for safe result
    }

    // convert the offset and length to integer
    offset = !is_number(offset) ? parseInt(offset) : offset;

    let found: number,
        stringIndex: string,
        stringSubIndex: string,
        subIndex: number = 0,
        index: number = 0;

    offset = offset ? (offset < 0 ? string.length + offset : offset) : 0;
    length = length ? (length < 0 ? string.length + length - offset : length) : string.length - offset;
    string = string.substring(offset, length);

    // process the both string and characters
    for (; index < string.length; index++) {
        found = 0;
        stringIndex = string.substring(index, index + 1);
        for (subIndex = 0; subIndex <= characters.length; subIndex++) {
            stringSubIndex = characters.substring(subIndex, subIndex + 1);
            if (stringIndex === stringSubIndex) {
                found = 1;
                break;
            }
        }
        if (found !== 1) {
            return index;
        }
    }

    return index;
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
    return param && typeof param === 'object';
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
export const is_array_buffer_like = (param: any): param is ArrayBufferLike => {
    return param instanceof ArrayBuffer;
}

export const deep_freeze = <T extends any|object>(o: T) : T => {
    if (o && typeof o === 'object') {
        for (let i in o) {
            console.log(i)
            if (o.hasOwnProperty(i)) {
                o[i] = deep_freeze(o[i]);
            }
        }
        return Object.freeze(o);
    }
    return o;
}
