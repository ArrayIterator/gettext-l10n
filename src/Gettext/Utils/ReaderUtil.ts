import {
    is_object,
    is_string
} from '../../Utils/Helper';

/**
 * Parse flags
 * @param {any} flags
 */
export const define_flags = (flags: any): Array<string> => {
    if (is_string(flags)) {
        flags = [flags];
    }
    flags = Array.isArray(flags) ? flags : [];
    // filter valid flags : /^([a-z]+([a-z-]*[a-z]+)?|range:[0-9]+-[0-9]+)$/i
    return flags
        .filter((flag: string) => {
            return (is_string(flag) && flag.trim() !== '' && flag.match(/^([a-z]+([a-z-]*[a-z]+)?|range:[0-9]+-[0-9]+)$/i) !== null)
        }).map((flag: string) => flag.trim());
}
/**
 * Parse comments
 * @param {any} comments
 */
export const define_comments = (comments: any): Array<string> => {
    if (is_string(comments)) {
        comments = [comments];
    }
    comments = Array.isArray(comments) ? comments : [];
    comments = comments.filter((comment: string) => is_string(comment));
    return comments;
}

/**
 * Parse references
 * @param {any} references
 * @returns {Array<{file: string, line?: number}>}
 */
export const define_references = (references: any): Array<{
    file: string;
    line?: number;
}> => {
    if (is_string(references)) {
        references = [references];
    }
    references = Array.isArray(references) ? references : [];
    references = references.filter((ref: string) => is_string(ref) && ref.trim() !== '');
    references = references.map((ref: string) => {
        ref = ref.trim();
        if (ref === '') {
            return false;
        }
        let matches;
        let definitions: {
            file: string;
            line?: number;
        } = {
            file: ref,
            line: undefined
        };
        if (ref.includes(':')) {
            matches = ref.match(/^(.+):([0-9]+)$/);
            if (!matches) {
                return false;
            }
            definitions.file = matches[1];
            definitions.line = parseInt(matches[2]);
        } else {
            definitions.file = ref;
        }
        return {
            file: definitions.file,
            line: definitions.line
        }
    });
    return references.filter((ref: {
        file: string;
        line?: number;
    }) => is_object(ref) && is_string(ref.file) && ref.file.trim() !== '');
}
