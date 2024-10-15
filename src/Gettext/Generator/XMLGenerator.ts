import GettextGeneratorInterface from '../Interfaces/Generator/GettextGeneratorInterface';
import TranslationEntries from '../../Translations/TranslationEntries';
import InvalidArgumentException from 'src/Exceptions/InvalidArgumentException';
import TranslationEntriesInterface from '../../Translations/Interfaces/TranslationEntriesInterface';
import StreamBuffer from '../../Utils/StreamBuffer';
import {
    encode_entities,
    is_string
} from '../../Utils/Helper';
import TranslationEntryInterface from '../../Translations/Interfaces/TranslationEntryInterface';

/**
 * The translation generator for XML files
 */
export default class XMLGenerator implements GettextGeneratorInterface {
    /**
     * Generate the XML file content
     * @inheritDoc
     * @throws {InvalidArgumentException} if the translations are not an instance of TranslationEntries
     */
    public generate(translations: TranslationEntriesInterface): StreamBuffer {
        if (!(translations instanceof TranslationEntries)) {
            throw new InvalidArgumentException(
                `The translations must be an instance of ${TranslationEntries.name}, ${typeof translations} given`
            );
        }

        const stream = new StreamBuffer();
        stream.write(`<?xml version="1.0" encoding="UTF-8"?>
<!--<translation-->
<!--        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"-->
<!--        xsi:noNamespaceSchemaLocation="/path/to/translation.xsd"-->
<!--        revision="${translations.revision}"-->
<!-->-->
<translation revision="${translations.revision}">
<title>Translation for language : ${translations.language}</title>
<description>Translation for language : ${translations.language}</description>
\n`);
        const spaces = ' '.repeat(4);

        if (translations.attributes.flags.length > 0) {
            let content: string[] = [`${spaces}<flags>`];
            translations.attributes.flags.forEach((flag: string) => {
                flag = encode_entities(flag);
                content.push(`${spaces.repeat(2)}<item>${flag}</item>`);
            });
            content.push(`${spaces}</flags>`);
            stream.write(content.join('\n') + '\n');
        }
        if (translations.attributes.references.length > 0) {
            let content: string[] = [`${spaces}<references>`];
            translations.attributes.references.forEach(([file, lines]) => {
                file = encode_entities(file);
                if (lines.length > 0) {
                    lines.forEach((line) => {
                        content.push(`${spaces.repeat(2)}<item>${file}:${line}</item>`);
                    });
                    return;
                }
                content.push(`${spaces.repeat(2)}<item>${file}</item>`);
            });
            content.push(`${spaces}</references>`);
            stream.write(content.join('\n') + '\n');
        }
        if (translations.attributes.comments.length > 0) {
            let content: string[] = [`${spaces}<comments>`];
            translations.attributes.comments.forEach((comment: string) => {
                comment = encode_entities(comment);
                content.push(`${spaces.repeat(2)}<item>${comment}</item>`);
            });
            content.push(`${spaces}</comments>`);
            stream.write(content.join('\n') + '\n');
        }
        if (translations.attributes.extractedComments.length > 0) {
            let content: string[] = [`${spaces}<extracted-comments>`];
            translations.attributes.extractedComments.forEach((comment: string) => {
                comment = encode_entities(comment);
                content.push(`${spaces.repeat(2)}<item>${comment}</item>`);
            });
            content.push(`${spaces}</extracted-comments>`);
            stream.write(content.join('\n') + '\n');
        }

        if (Object.keys(translations.headers).length > 0) {
            let content: string[] = [`${spaces}<headers>`];
            translations.headers.forEach((header, key) => {
                header = encode_entities(header);
                key = key.toLowerCase();
                if (key === 'header') {
                    if (header === '') {
                        content.push(`${spaces.repeat(2)}<header name="${key}"/>`);
                    } else {
                        content.push(`${spaces.repeat(2)}<header name="${key}">${header}</header>`);
                    }
                } else {
                    content.push(`${spaces.repeat(2)}<${key}>${header}</${key}>`);
                }
            });
            content.push(`${spaces}</headers>`);
            stream.write(content.join('\n') + '\n');
        }
        if (!translations.entries.length) {
            stream.write(`${spaces}<translations/>\n`);
            stream.write('<!-- empty translations -->');
            return stream;
        }
        const translationObject: {
            [key: string]: TranslationEntryInterface[]
        } = {
            '': []
        };
        translations.entries.forEach(([_id, translation]) => {
            const context: string = translation.context || '';
            if (!translationObject[context]) {
                translationObject[context] = [];
            }
            translationObject[context].push(translation);
        });
        stream.write(`${spaces}<translations>\n`);
        for (const context in translationObject) {
            if (translationObject[context].length === 0) {
                continue;
            }
            stream.write(`${spaces.repeat(2)}<context name="${encode_entities(context)}">\n`);
            translationObject[context].forEach((translation: TranslationEntryInterface): void => {
                stream.write(`${spaces.repeat(3)}<item>\n`);
                const msgid = encode_entities(translation.original);
                if (msgid === '') {
                    stream.write(`${spaces.repeat(4)}<msgid/>\n`);
                } else {
                    stream.write(`${spaces.repeat(4)}<msgid>${msgid}</msgid>\n`);
                }
                if (is_string(translation.plural)) {
                    const msgid_plural = encode_entities(translation.plural);
                    if (msgid_plural === '') {
                        stream.write(`${spaces.repeat(4)}<msgid_plural/>\n`);
                    } else {
                        stream.write(`${spaces.repeat(4)}<msgid_plural>${msgid_plural}</msgid_plural>\n`);
                    }
                }
                const plurals: string[] = translation.pluralTranslations.map((translation) => encode_entities(translation));
                if (plurals.length === 0) {
                    if (!is_string(translation.translation)) {
                        stream.write(`${spaces.repeat(4)}<msgstr/>\n`);
                    } else {
                        let content: string[] = [`${spaces.repeat(4)}<msgstr>`];
                        content.push(`${spaces.repeat(5)}<item>${encode_entities(translation.translation)}</item>`);
                        content.push(`${spaces.repeat(4)}</msgstr>`);
                        stream.write(content.join('\n') + '\n');
                    }
                } else {
                    plurals.unshift(encode_entities(translation.translation || ''));
                    let content: string[] = [`${spaces.repeat(4)}<msgstr>`];
                    plurals.forEach((translation) => {
                        content.push(`${spaces.repeat(5)}<item>${translation}</item>`);
                    });
                    content.push(`${spaces.repeat(4)}</msgstr>`);
                    stream.write(content.join('\n') + '\n');
                }
                if (translation.attributes.flags.length > 0) {
                    let content: string[] = [`${spaces.repeat(4)}<flags>`];
                    translation.attributes.flags.forEach((flag: string) => {
                        flag = encode_entities(flag);
                        content.push(`${spaces.repeat(5)}<item>${flag}</item>`);
                    });
                    content.push(`${spaces}</flags>`);
                    stream.write(content.join('\n') + '\n');
                }
                if (translation.attributes.references.length > 0) {
                    let content: string[] = [`${spaces.repeat(4)}<references>`];
                    translation.attributes.references.forEach(([file, lines]) => {
                        file = encode_entities(file);
                        if (lines.length > 0) {
                            lines.forEach((line) => {
                                content.push(`${spaces.repeat(5)}<item>${file}:${line}</item>`);
                            });
                            return;
                        }
                        content.push(`${spaces.repeat(5)}<item>${file}</item>`);
                    });
                    content.push(`${spaces}</references>`);
                    stream.write(content.join('\n') + '\n');
                }
                if (translation.attributes.comments.length > 0) {
                    let content: string[] = [`${spaces.repeat(4)}<comments>`];
                    translation.attributes.comments.forEach((comment: string) => {
                        comment = encode_entities(comment);
                        content.push(`${spaces.repeat(5)}<item>${comment}</item>`);
                    });
                    content.push(`${spaces.repeat(4)}</comments>`);
                    stream.write(content.join('\n') + '\n');
                }
                if (translation.attributes.extractedComments.length > 0) {
                    let content: string[] = [`${spaces.repeat(4)}<extracted-comments>`];
                    translation.attributes.extractedComments.forEach((comment: string) => {
                        comment = encode_entities(comment);
                        content.push(`${spaces.repeat(5)}<item>${comment}</item>`);
                    });
                    content.push(`${spaces.repeat(4)}</extracted-comments>`);
                    stream.write(content.join('\n') + '\n');
                }
                // end item
                stream.write(`${spaces.repeat(3)}</item>\n`);
            });
            stream.write(`${spaces.repeat(2)}</context>\n`);
        }
        stream.write(`${spaces}</translations>`);
        return stream;
    }
}
