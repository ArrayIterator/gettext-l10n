/**
 * Message ID
 */
export const ATTRIBUTE_MESSAGE_ID = 'msgid';

/**
 * Plural ID
 */
export const ATTRIBUTE_MESSAGE_ID_PLURAL = 'msgid_plural';

/**
 * Translation string
 */
export const ATTRIBUTE_MESSAGE_STR = 'msgstr';

/**
 * Context
 */
export const ATTRIBUTE_MESSAGE_CONTEXT = 'msgctx';

/**
 * Comment identifier
 */
export const ATTRIBUTE_COMMENT = '#';

/**
 * Commented translations
 */
export const ATTRIBUTE_COMMENTED_TRANSLATIONS = '#~';

/**
 * Extracted comments
 */
export const ATTRIBUTE_EXTRACTED_COMMENT = '#.';

/**
 * Flags
 */
export const ATTRIBUTE_FLAGS = '#,';

/**
 * References
 */
export const ATTRIBUTE_REFERENCES = '#:';

/**
 * The flag list (for reference only)
 *
 * @type {Array<string>}
 */
export const FLAG_LISTS: Array<string> = [
    'fuzzy',
    'c-format',
    'no-c-format',
    'objc-format',
    'no-objc-format',
    'python-format',
    'no-python-format',
    'python-brace-format',
    'no-python-brace-format',
    'java-format',
    'no-java-format',
    'java-printf-format',
    'no-java-printf-format',
    'csharp-format',
    'no-csharp-format',
    'javascript-format',
    'no-javascript-format',
    'scheme-format',
    'no-scheme-format',
    'lisp-format',
    'no-lisp-format',
    'elisp-format',
    'no-elisp-format',
    'librep-format',
    'no-librep-format',
    'ruby-format',
    'no-ruby-format',
    'sh-format',
    'no-sh-format',
    'awk-format',
    'no-awk-format',
    'lua-format',
    'no-lua-format',
    'object-pascal-format',
    'no-object-pascal-format',
    'smalltalk-format',
    'no-smalltalk-format',
    'qt-format',
    'no-qt-format',
    'qt-plural-format',
    'no-qt-plural-format',
    'kde-format',
    'no-kde-format',
    'boost-format',
    'no-boost-format',
    'tcl-format',
    'no-tcl-format',
    'perl-format',
    'no-perl-format',
    'perl-brace-format',
    'no-perl-brace-format',
    'php-format',
    'no-php-format',
    'gcc-internal-format',
    'no-gcc-internal-format',
    'gfc-internal-format',
    'no-gfc-internal-format',
    'ycp-format',
    'no-ycp-format',
    'range:',
];

Object.freeze(FLAG_LISTS); // freeze
