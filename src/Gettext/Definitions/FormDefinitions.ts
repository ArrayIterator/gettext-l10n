export const DEFAULT_PLURAL_COUNT = 2;
export const DEFAULT_PLURAL_EXPRESSION = 'n != 1';
export const PLURAL_HEADER_KEY = 'Plural-Forms';
export const PLURAL_HEADER_REGEX = /^\s*nplurals\s*=\s*(\d+)\s*;plural\s*=\s*(.+)\s*;?\s*$/;
export const DEFAULT_PLURAL_FORM = `nplurals=${DEFAULT_PLURAL_COUNT};plural=${DEFAULT_PLURAL_EXPRESSION}`;
