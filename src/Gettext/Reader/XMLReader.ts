import GettextReaderInterface from '../Interfaces/Reader/GettextReaderInterface';
import GettextTranslationsInterface from '../Interfaces/GettextTranslationsInterface';
import StreamBuffer from '../../Utils/StreamBuffer';
import {
    is_object,
    is_string
} from '../../Utils/Helper';
import RuntimeException from '../../Exceptions/RuntimeException';
import GettextTranslations from '../GettextTranslations';
import {
    define_comments,
    define_flags,
    define_references
} from '../Utils/ReaderUtil';
import GettextTranslationInterface from '../Interfaces/GettextTranslationInterface';
import {
    SimpleDocumentFragment,
    ReadonlySimpleElement
} from '../../Utils/SimpleDocument';

/**
 * XML Reader (example) :
 * <?xml version="1.0" encoding="UTF-8"?>
 * <translation
 *         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 *         xsi:noNamespaceSchemaLocation="gettext-l10n/src/Schema/translation.xsd"
 *         revision="1"
 * >
 *     <flags>
 *         <item>fuzzy</item>
 *         <item>c-format</item>
 *     </flags>
 *     <references>
 *         <item>src/file.js:10</item>
 *     </references>
 *     <comments>
 *         <item>This is a comment about the translation file.</item>
 *     </comments>
 *     <extracted-comments>
 *         <item>This is an extracted comment about the translation file.</item>
 *     </extracted-comments>
 *     <headers>
 *         <project-id-version>My Project 1.0</project-id-version>
 *         <creation-date>2023-10-01 12:00+0000</creation-date>
 *         <revision-date>2023-10-01 12:00+0000</revision-date>
 *         <last-translator>John Doe &lt;john.doe@example.com&gt;</last-translator>
 *         <language-team>English &lt;en@example.com&gt;</language-team>
 *         <language>en</language>
 *         <mime-version>1.0</mime-version>
 *         <content-type>text/plain; charset=UTF-8</content-type>
 *         <content-transfer-encoding>8bit</content-transfer-encoding>
 *         <plural-forms>nplurals=2; plural=(n != 1);</plural-forms>
 *         <header key="custom-header">custom header value</header>
 *     </headers>
 *     <translations>
 *         <context name="">
 *             <item>
 *                 <comments>
 *                     <item>This is a comment for the translator as a string.</item>
 *                 </comments>
 *                 <disabled/>
 *                 <msgid>as a key reference</msgid>
 *                 <msgid_plural/>
 *                 <msgstr/>
 *             </item>
 *             <item>
 *                 <comments/>
 *                 <references/>
 *                 <flags/>
 *                 <msgid/>
 *                 <msgid_plural>Hello, worlds!</msgid_plural>
 *                 <msgstr>
 *                     <item>Hello, world!</item>
 *                     <item>Hello, worlds!</item>
 *                 </msgstr>
 *             </item>
 *             <item>
 *                 <comments>
 *                     <item>the key is the msgid</item>
 *                     <item>the key will ignore or just be as a key reference</item>
 *                 </comments>
 *                 <references>
 *                     <item>src/file.js:10</item>
 *                 </references>
 *                 <flags>
 *                     <item>fuzzy</item>
 *                 </flags>
 *                 <msgid>The Cat</msgid>
 *                 <msgid_plural>The Cats</msgid_plural>
 *                 <msgstr>
 *                     <item>The Cat</item>
 *                     <item>The Cats</item>
 *                 </msgstr>
 *             </item>
 *             <item>
 *                 <comments>
 *                     <item>this translation is disabled or just as commented translation like po file with: #~ msgid
 *                         "Hello, world!"
 *                     </item>
 *                 </comments>
 *                 <references>
 *                     <item>src/file.js:10</item>
 *                 </references>
 *                 <flags>
 *                     <item>fuzzy</item>
 *                 </flags>
 *                 <enable>false</enable>
 *                 <msgid>Hello, world!</msgid>
 *                 <msgstr>
 *                     <item>Hello, world!</item>
 *                 </msgstr>
 *             </item>
 *         </context>
 *     </translations>
 * </translation>
 */
export default class XMLReader implements GettextReaderInterface {
    /**
     * @inheritDoc
     *
     * @throws {RuntimeException} if the content is not valid
     */
    public read(content: string | ArrayBufferLike): GettextTranslationsInterface {
        content = new StreamBuffer(content).toString();
        let rootElement = this.parseFromString(content)?.documentElement;
        if (rootElement?.tagName !== 'translation') {
            throw new RuntimeException(
                `The root element must be <translation> but <${rootElement?.tagName}> given`
            );
        }

        type ElementMixed = ReadonlySimpleElement|Element;
        type ElementsMixed = HTMLCollection|ElementMixed[];

        /**
         * Create filter
         */
        const rootFilter = <T extends ElementMixed>(tagName: string, children: ElementsMixed) : T[]  => {
            tagName = (tagName + '').toUpperCase();
            return Object
                .values(children)
                .filter((node) => is_object(node) && ((node as {tagName: any}).tagName + '').toUpperCase() === tagName) as T[];
        }

        /**
         * Get root items
         * <selector> > <item>+
         */
        const rootItems = <T extends ElementMixed>(tagName: string, children: ElementsMixed) : T[] => {
            return rootFilter('item', (rootFilter(tagName, children).shift() as Element|ReadonlySimpleElement)?.children)
                .filter((node) => is_object(node) && is_string((node as ReadonlySimpleElement|Element).textContent)) as T[];
        }

        const revision = rootElement.getAttribute('revision')?.trim() || '0';
        if (!revision.match(/^\d+$/)) {
            throw new RuntimeException(
                `The revision must be a number, "${revision}" given`
            );
        }

        const translationRoot = rootFilter('translations', rootElement.children).shift();
        if (!translationRoot) {
            throw new RuntimeException(
                'The <translations> element is required'
            );
        }
        const translations = new GettextTranslations(parseInt(revision + ''));

        // <context name="xs:string"> > <item>+
        rootFilter('context', translationRoot.children).forEach((contextElement) : void => {
            const context = contextElement.getAttribute('name') || '';
            rootFilter('item', contextElement.children)
                .filter((node) => is_object(node))
                .forEach((itemElement) => {
                    let msgid = rootFilter('msgid', itemElement?.children)
                        .map((node) => node.textContent)[0];
                    if (!is_string(msgid)) {
                        return;
                    }
                    let msgstr : string[] = rootItems('msgstr', itemElement?.children).map((node) => node.textContent) as string[];
                    if (!msgstr.every(is_string)) {
                        throw new RuntimeException(
                            'All the msgstr should be a string, msgstr contains non-string value'
                        );
                    }
                    msgstr = msgstr.map((str) => this.cleanData(str));
                    msgid = this.cleanData(msgid);
                    // the empty context and msgid is a meta header
                    if (context === '' && msgid === '') {
                        for (let header of msgstr) {
                            header = header.trim();
                            if (header === '') {
                                continue;
                            }
                            // should start with a letter and can contain letters, numbers, and hyphens
                            // and end with a letter or number
                            let match = header.match(/^([a-z]+([a-z0-9-]*[a-z0-9]+))\s*:(.+)$/i);
                            if (!match) {
                                continue;
                            }
                            let key = match[1].trim();
                            let value = match[2].trim();
                            if (key === '' || value === '') {
                                continue;
                            }
                            translations.headers.set(key, value);
                        }
                        return; // skip empty as root meta
                    }
                    let msgid_plural : string|undefined = rootFilter('msgid_plural', itemElement?.children).map((node) => node.textContent)[0] as string;
                    msgid_plural = is_string(msgid_plural) ? this.cleanData(msgid_plural) : undefined;
                    let translation = msgstr.shift();
                    translation = is_string(translation) ? this.cleanData(translation) : undefined;
                    let gettextTranslation: GettextTranslationInterface;
                    try {
                        gettextTranslation = translations.createTranslation(
                            context,
                            msgid,
                            msgid_plural,
                            translation,
                            ...msgstr
                        );
                    } catch (e) {
                        throw new RuntimeException(
                            `The translation is not valid, ${(e as Error).message}`
                        );
                    }
                    // append translation
                    translations.add(gettextTranslation);
                    // <comments> > <item>+
                    define_comments(
                        rootItems('comments', itemElement?.children)
                            .map((node) => is_string(node.textContent) ? this.cleanData(node.textContent) : null)
                            .filter((comment) => comment !== null)
                    ).forEach((comment: string) => {
                        gettextTranslation.attributes.comments.add(this.cleanData(comment));
                    });
                    // <flags> > <item>+
                    define_flags(
                        rootItems('flags', itemElement?.children)
                            .map((node) => is_string(node.textContent) ? this.cleanData(node.textContent) : null)
                            .filter((flag) => flag !== null)
                    ).forEach((flag) => {
                        gettextTranslation.attributes.flags.add(this.cleanData(flag));
                    });
                    // <extracted-comments> > <item>+
                    define_comments(
                        rootItems('extracted-comments', itemElement?.children)
                            .map((node) => is_string(node.textContent) ? this.cleanData(node.textContent) : null)
                            .filter((comment) => comment !== null)
                    ).forEach((flag) => {
                        gettextTranslation.attributes.extractedComments.add(flag);
                    });
                    // <references> > <item>+
                    define_references(
                        rootItems('references', itemElement?.children)
                            .map((node) => is_string(node.textContent) ? this.cleanData(node.textContent) : null)
                            .filter((ref) => ref !== null)
                    ).forEach((ref: {
                        file: string;
                        line?: number;
                    }) => {
                        gettextTranslation.attributes.references.add(ref.file, ref.line);
                    });
                })
        });

        // <comments> > <item>+
        define_comments(
            rootItems('comments', rootElement?.children)
                .map((node) => is_string(node.textContent) ? this.cleanData(node.textContent) : null)

        ).forEach((comment: string) => {
            translations.attributes.comments.add(comment);
        });
        // <flags> > <item>+
        define_flags(
            rootItems('flags', rootElement?.children)
                .map((node) => is_string(node.textContent) ? this.cleanData(node.textContent) : null)
        ).forEach((flag) => {
            translations.attributes.flags.add(flag);
        });
        // <extracted-comments> > <item>+
        define_comments(
            rootItems('extracted-comments', rootElement?.children)
                .map((node) => is_string(node.textContent) ? this.cleanData(node.textContent) : null)
                .filter((comment) => comment !== null)
        ).forEach((flag) => {
            translations.attributes.extractedComments.add(flag);
        });
        // <references> > <item>+
        define_references(
            rootItems('references', rootElement?.children)
                .map((node) => is_string(node.textContent) ? this.cleanData(node.textContent) : null)
                .filter((ref) => ref !== null)
        ).forEach((ref: {
            file: string;
            line?: number;
        }) => {
            translations.attributes.references.add(ref.file, ref.line);
        });
        // set plural form
        translations.setEntriesPluralForm(translations.headers.pluralForm);
        return translations;
    }

    /**
     * parse CDATA if exist
     *
     * @param {string} content
     * @returns {string}
     */
    private cleanData(content: string) : string {
        if (content.trim().startsWith('<![CDATA[') && content.endsWith(']]>')) {
            return content.trim().substring(9, content.length - 3);
        }
        return content;
    }

    /**
     * Parse string to DOMElement
     *
     * @param content
     * @private
     */
    private parseFromString(content: string) : SimpleDocumentFragment|Document {
        let domParser : typeof DOMParser = (window?.DOMParser);
        if (!domParser) {
            // noinspection TypeScriptUnresolvedReference
            // @ts-expect-error ignore
            let _require = require || null;
            let jsDom = (_require ? _require('jsdom') : null)?.JSDOM;
            domParser = (typeof jsDom === 'function' ? (jsDom as {
                window: {
                    DOMParser: typeof DOMParser
                }
            })?.window.DOMParser : null) as { new(): DOMParser; prototype: DOMParser; };
        }
        if (typeof domParser.prototype?.parseFromString === 'function') {
            const dom = new domParser();
            return dom.parseFromString(content, 'text/xml');
        }

        return new SimpleDocumentFragment(content, 'xml');
    }
}
