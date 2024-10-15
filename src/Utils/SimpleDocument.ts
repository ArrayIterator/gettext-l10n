// noinspection JSUnusedGlobalSymbols

/**
 * The RegExp for attributes
 */
const regexAttributes = new RegExp(
    '[\\s\\r\\t\\n]*([a-z0-9\\-_]+)[\\s\\r\\t\\n]*=[\\s\\r\\t\\n]*([\'"])((?:\\\\\\2|(?!\\2).)*)\\2',
    'ig'
);

/**
 * Normalize attribute name
 *
 * @param {string} name
 * @return {string} the normalized attribute name
 */
const normalize_attribute_name = (name: string): string => {
    return (name + '').toLowerCase();
}

/**
 * Match element
 *
 * @param {string} content
 * @param {ReadonlySimpleElement} parent
 */
// regex loop nested
const matchElement = <T extends ReadonlySimpleElement | undefined>(content: string, parent: T = undefined as T): T => {
    let matchAll: Array<RegExpExecArray> = content.matchAll(/<([a-zA-Z0-9_-]+)([^>]*)?>(.*?)<\/\1>/smg).toArray();
    if (!matchAll.length) {
        return parent;
    }
    matchAll.forEach((match) => {
        let element = new ReadonlySimpleElement(match[0], parent);
        const children = element.innerHTML;
        if (children.match(/<([a-zA-Z0-9_-]+)([^>]*)?>(.*?)<\/\1>/sm)) {
            matchElement(children, element);
        }
        if (parent instanceof ReadonlySimpleElement) {
            parent?.pushChild(element);
        }
    });
    return parent;
}

/**
 * Parse attributes
 */
const parse_attributes = (attributes: string): {
    class: string,
    [key: string]: string
} => {
    let result: {
        class: string,
        [key: string]: string
    } = {
        class: ''
    };
    // noinspection SuspiciousTypeOfGuard
    if (typeof attributes !== 'string') {
        return result;
    }
    let match = attributes.matchAll(regexAttributes).toArray();
    if (match.length > 0) {
        match.forEach((attr) => {
            let [_a, key, _b, value] = attr;
            key = normalize_attribute_name(key.trim());
            switch (key) {
                case 'class':
                    let val = value.split(' ').filter((v) => !!v);
                    let c : {
                        [key: string]: boolean
                    } = {};
                    val.forEach((v) => {
                        c[v] = true;
                    });
                    value = Object.keys(c).join(' ');
                    break;
            }
            result[key] = value;
        });
    }
    if (!result['class']) {
        result['class'] = '';
    }
    return result;
}

/**
 * ReadonlySimpleElement - the simple element for read only element
 * The simple element implementation, but read only
 */
export class ReadonlySimpleElement {
    /**
     * the document element type
     *
     * @private
     */
    private readonly _tagName: string;

    /**
     * the element innerHTML
     * @private
     */
    private readonly _innerHTML: string;

    /**
     * the document element children
     */
    private readonly _attributes: {
        class: string,
        [key: string]: string
    };

    /**
     * the document element children
     */
    private readonly _children: Array<ReadonlySimpleElement> = [];

    // noinspection TypeScriptFieldCanBeMadeReadonly
    /**
     * ReadonlySimpleElement constructor
     * @private
     */
    private _allowChange = false;

    /**
     * the parent element
     *
     * @private
     */
    private readonly _parentElement: ReadonlySimpleElement | SimpleDocumentFragment | undefined;

    /**
     * SimpleElement constructor
     */
    public constructor(content: string | ReadonlySimpleElement, parent: ReadonlySimpleElement | SimpleDocumentFragment | undefined = undefined) {
        this._parentElement = parent instanceof ReadonlySimpleElement || parent instanceof SimpleDocumentFragment ? parent : undefined;
        content = content instanceof ReadonlySimpleElement ? content.outerHTML : content;
        const match = content.match(/^\s*<([a-zA-Z0-9_-]+)([^>]*)?>(.*?)(?:\/\1)?$/sm);
        const attributes = parse_attributes(match ? match[2] : '');
        this._tagName = (match ? match[1] : '').toUpperCase();
        this._attributes = Object.assign({}, attributes);
        this._innerHTML = match ? match[3] : content;
        this._allowChange = true;
        this._children = matchElement(this._innerHTML, this).children;
        this._allowChange = false;
    }

    /**
     * Get parent element
     */
    public get parentElement(): ReadonlySimpleElement | SimpleDocumentFragment | undefined {
        return this._parentElement;
    }

    /**
     * Push child
     *
     * @param {ReadonlySimpleElement} child
     */
    public pushChild(child: ReadonlySimpleElement): void {
        if (!this._allowChange) {
            return;
        }
        // noinspection SuspiciousTypeOfGuard
        if (child === this || !(child instanceof ReadonlySimpleElement)) {
            return;
        }
        this._children.push(child);
    }

    /**
     * Get children
     */
    public get children(): Array<ReadonlySimpleElement> {
        return Array.from(this._children);
    }

    /**
     * Get tagName
     */
    public get tagName(): string {
        return this._tagName;
    }

    /**
     * Set tagName
     * skip
     */
    public set tagName(_value: string) {
        // skip
    }

    /**
     * Get innerHTML
     */
    public get innerHTML(): string {
        return this._innerHTML;
    }

    /**
     * Set innerHTML
     * skip
     */
    public set innerHTML(_value: string) {
        // skip
    }

    /**
     * Set attribute
     */
    public getAttribute(key: string): string | null {
        key = normalize_attribute_name(key);
        return key in this._attributes ? this._attributes[key] : null;
    }

    /**
     * Set attribute
     */
    public setAttribute(key: string, value: string): void {
        key = normalize_attribute_name(key);
        value = value ? value + '' : '';
        this._attributes[key] = value;
    }

    /**
     * Check if object has attribute
     *
     * @param key
     */
    public hasAttribute(key: string): boolean {
        key = normalize_attribute_name(key);
        return key in this._attributes;
    }

    /**
     * Has attribute
     */
    public get textContent(): string {
        return this._innerHTML.replace(/<[^>]+>/g, '');
    }

    /**
     * Get class List
     */
    public get classList(): Array<string> & {
        add: (value: string) => void,
        remove: (value: string) => void,
        toggle: (value: string) => void,
        contains: (value: string) => boolean
        } {
        const obj = this.className.split(' ');
        Object.defineProperties(obj, {
            add: {
                /**
                 *
                 */
                value: (_value: string) => {
                    // skip
                }
            },
            remove: {
                /**
                 *
                 */
                value: (_value: string) => {
                    // skip
                }
            },
            toggle: {
                /**
                 *
                 */
                value: (_value: string) => {
                    // skip
                }
            },
            contains: {
                /**
                 *
                 */
                value: (value: string) => {
                    return obj.includes(value);
                }
            }
        });

        Object.freeze(obj);
        return obj as Array<string> & {
            add: (value: string) => void,
            remove: (value: string) => void,
            toggle: (value: string) => void,
            contains: (value: string) => boolean
        };
    }

    /**
     * Get className
     */
    public get className(): string {
        return this._attributes.class;
    }

    /**
     * Set className
     */
    public get attributes(): {
        length: number;
        class: string;
        [key: string]: string|number;
        } {
        const attributes : {
            length: number;
            class: string;
            [key: string]: string|number;
        } = Object.assign({}, this._attributes) as {
            length: number;
            class: string;
            [key: string]: string|number;
        };
        Object.defineProperties(attributes, {
            class: {
                /**
                 *
                 */
                get: () => {
                    return this.className;
                },
                /**
                 *
                 */
                set: (_value: string) => {
                    // skip
                }
            },
            length: {
                /**
                 *
                 */
                get: () => {
                    return Object.keys(attributes).length;
                }
            }
        });
        Object.freeze(attributes);
        return attributes;
    }

    /**
     * Set textContent
     */
    public get outerHTML(): string {
        return this._tagName
            ? `<${this._tagName}${Object.keys(this._attributes).map((key) => ` ${key}="${this._attributes[key]}"`).join('')}>${this._innerHTML}</${this._tagName}>`
            : this._innerHTML;
    }

    /**
     * Query selector, find the first element that match the selector
     *
     * @param {string} selectors
     * @param {Array<ReadonlySimpleElement>} excludes - the excludes element
     * @param {boolean} findAll - find all elements
     */
    private findIndex(selectors: string, excludes : Array<ReadonlySimpleElement> = [], findAll: boolean = false): ReadonlySimpleElement|ReadonlySimpleElement[]| null {
        let results: ReadonlySimpleElement[] = [];
        // noinspection SuspiciousTypeOfGuard
        if (typeof selectors !== 'string') {
            return findAll ? results : null;
        }
        selectors = selectors.trim();
        const the_selectors = selectors.split(',').map((selector) => selector.trim());
        if (!the_selectors.filter((selector) => selector !== '').length // make sure not empty
            || the_selectors.find((selector) => selector === '') // make sure no empty selector
        ) {
            return findAll ? results : null;
        }
        excludes = (!Array.isArray(excludes) ? [] : excludes).filter((node) => node instanceof ReadonlySimpleElement);
        for (let selector of the_selectors) {
            selector = selector.trim();
            const match = selector.match(/^>?((?:[.#][a-zA-Z0-9_-]+|\*)?)(?:(\[.+?])*([\s>].+)?)?$/);
            if (!match) {
                return findAll ? results : null;
            }
            const isRoot = selector.startsWith('>');
            let tagName = match[1].toUpperCase();
            let prefix = ['.', '#'].includes(tagName[0]) ? tagName[0] : '';
            let attr = match[2];
            const subSelector = match[3];
            let attributes: {
                [key: string]: string
            } = {};
            switch (prefix) {
                case '.':
                    tagName = '*';
                    attributes['class'] = attr.substring(1);
                    break;
                case '#':
                    tagName = '*';
                    attributes['id'] = attr.substring(1);
                    break;
                default:
                    tagName = tagName.trim();
                    tagName = tagName === '' ? '*' : tagName;
                    break;
            }
            let do_continue = false;
            for (let child of this.children) {
                do_continue = false;
                if (child.tagName !== tagName && tagName !== '*') {
                    continue;
                }
                if (!attr) {
                    if (subSelector) {
                        let c = child.findIndex(subSelector, excludes, false) as ReadonlySimpleElement;
                        if (c) {
                            if (!findAll) {
                                return c;
                            }
                            results.push(c);
                            excludes.push(c);
                        }
                        continue;
                    }
                    if (!excludes.includes(child)) {
                        if (!findAll) {
                            return child;
                        }
                        results.push(child);
                        excludes.push(child);
                    }
                    continue;
                }
                if (Object.keys(attributes).length) {
                    for (let key in attributes) {
                        switch (key) {
                            case 'class':
                                if (!child.classList.contains(attributes[key])) {
                                    if (isRoot) {
                                        if (!findAll) {
                                            return null;
                                        }
                                        do_continue = true;
                                        break;
                                    }
                                    let c = child.children.find((node) => node.findIndex(selector, excludes, false));
                                    if (c) {
                                        if (!findAll) {
                                            return c;
                                        }
                                        results.push(c);
                                        excludes.push(c);
                                    }
                                    do_continue = true;
                                }
                                break;
                            case 'id':
                                if (child.getAttribute(key) !== attributes[key]) {
                                    if (isRoot) {
                                        if (!findAll) {
                                            return null;
                                        }
                                        do_continue = true;
                                        break;
                                    }
                                    let c = child.children.find((node) => node.findIndex(selector, excludes, false));
                                    if (c) {
                                        if (!findAll) {
                                            return c;
                                        }
                                        results.push(c);
                                        excludes.push(c);
                                    }
                                    do_continue = true;
                                }
                                break;
                        }
                    }
                }
                if (do_continue) {
                    continue;
                }
                const matchesAttributeList = attr.matchAll(/\[([a-zA-Z0-9_-]+)(?:([\^*]*)=([^\]]+))?]/g).toArray();
                if (!matchesAttributeList.length) {
                    continue;
                }
                for (let match of matchesAttributeList) {
                    let [_, key, operator, value] = match;
                    key = normalize_attribute_name(key).toLowerCase();
                    if (value === '') {
                        if (child.hasAttribute(key)) {
                            continue;
                        }
                        if (isRoot) {
                            return null;
                        }
                        return child.findIndex(selector);
                    }
                    let attrValue = child.getAttribute(key);
                    if (attrValue === null) {
                        return null;
                    }
                    const start = value.startsWith('"') ? '"' : (value.startsWith('\'') ? '\'' : '');
                    const end = value.substring(value.length - 1);
                    if (start !== '') {
                        if (start !== end) {
                            return findAll ? results : null;
                        }
                        value = value.substring(1, value.length - 1);
                    }
                    if (operator === '*' || attrValue !== value || operator === '^' && !attrValue.startsWith(value)) {
                        if (!attrValue.includes(value)) {
                            if (isRoot) {
                                if (!findAll) {
                                    return null;
                                }
                                continue;
                            }
                            let c = child.findIndex(selector, excludes, false) as ReadonlySimpleElement;
                            if (c) {
                                if (!findAll) {
                                    return c;
                                }
                                results.push(c);
                                excludes.push(c);
                            }
                            continue;
                        }
                    }
                    if (subSelector) {
                        let c = child.findIndex(subSelector, excludes, false) as ReadonlySimpleElement;
                        if (c) {
                            if (!findAll) {
                                return c;
                            }
                            results.push(c);
                            excludes.push(c);
                        }
                        continue;
                    }
                    if (!excludes.includes(child)) {
                        if (!findAll) {
                            return child;
                        }
                        results.push(child);
                        excludes.push(child);
                    }
                }
            }
        }
        excludes = []; // clear
        return findAll ? [...new Set(results)] : null;
    }

    /**
     * Query selector, find the first element that match the selector
     *
     * @param {string} selector
     */
    public querySelector(selector: string): ReadonlySimpleElement | null {
        return this.findIndex(selector, [this], false) as ReadonlySimpleElement|null;
    }

    /**
     * Query selector all, find all elements that match the selector
     */
    public querySelectorAll(selector: string): ReadonlySimpleElement[] {
        return this.findIndex(selector, [this], true) as ReadonlySimpleElement[];
    }
}

/**
 *
 */
export class SimpleDocumentFragment {
    /**
     * the document element type
     */
    public readonly type: 'xml' | 'html' = 'html';

    /**
     * the document element tag name
     * @private
     */
    private readonly _tagName: string;

    /**
     * the document element
     * @private
     */
    private readonly _documentElement: ReadonlySimpleElement;

    /**
     * the document element attributes
     * @private
     */
    private readonly _attributes: {
        [key: string]: string
    };

    /**
     * SimpleDocumentFragment constructor
     */
    public constructor(content: string | SimpleDocumentFragment | ReadonlySimpleElement, type: 'xml' | 'html' = 'html') {
        // noinspection SuspiciousTypeOfGuard
        if (content instanceof SimpleDocumentFragment || content instanceof SimpleDocumentFragment) {
            content = content.outerHTML;
        } else {
            content = content + '';
        }
        content = content.trim().replace(/<!--(.*?)-->/g, '');
        // noinspection SuspiciousTypeOfGuard
        type = typeof type === 'string' ? type.trim().toLowerCase() as 'html' : 'html';
        type = ['xml', 'html'].includes(type) ? type : 'html';
        content = (content as string).trim();
        let tagName: string = 'document';
        let match: RegExpMatchArray | null = null;
        if (content.match(/^<\?[^>]+>\s*$/)) {
            match = content.match(/^<\?([a-zA-Z0-9_-]+)([^>]*)?>\s*$/);
            if (match) {
                tagName = match[1];
            } else {
                tagName = 'xml';
            }
            if (tagName === 'xml') {
                type = 'xml';
            }
        } else if (content.match(/^<![^>]+>$/)) {
            type = 'html';
            match = content.match(/^<!([a-zA-Z0-9_-]+)?>\s*$/);
        }

        content = match ? content.substring(match[0].length).trim() : content;
        tagName = (match ? match[1] : tagName).toLowerCase();
        if (tagName === 'doctype') {
            tagName = 'document';
        }
        let attributes = match ? match[2] : '';
        this.type = type;
        this._tagName = tagName.trim().toLowerCase();
        this._attributes = parse_attributes(attributes);
        this._documentElement = new ReadonlySimpleElement(content, this);
    }

    /**
     * Get tagName
     */
    public get tagName(): string {
        return this._tagName;
    }

    /**
     * Set tagName
     * skip
     */
    public set tagName(_value: string) {
        // skip
    }

    /**
     * Get documentElement
     */
    public get documentElement(): ReadonlySimpleElement {
        return this._documentElement;
    }

    /**
     * Set documentElement
     */
    public set documentElement(_value: ReadonlySimpleElement) {
        // skip
    }

    /**
     * Get innerHTML
     */
    public get innerHTML(): string {
        return this._documentElement.outerHTML;
    }

    /**
     * Set innerHTML
     * skip
     */
    public set innerHTML(_value: string) {
        // skip
    }

    /**
     * Get attributes
     */
    public get attributes(): {[key: string]: string} {
        return Object.assign({}, this._attributes);
    }

    /**
     * Set attributes
     * skip
     */
    public set attributes(_value: {
        [key: string]: string
    }) {
        // skip
    }

    /**
     * Has attribute
     */
    public hasAttribute(key: string): boolean {
        return normalize_attribute_name(key) in this.attributes;
    }

    /**
     * Get attribute
     */
    public getAttribute(key: string): string | null {
        if (!this.hasAttribute(key)) {
            return null;
        }
        key = normalize_attribute_name(key);
        return key in this.attributes ? this.attributes[key] : null;
    }

    /**
     * Get textContent
     */
    public get textContent(): string {
        return this.innerHTML.replace(/<[^>]+>/g, '');
    }

    /**
     * Set textContent
     * skip
     */
    public set textContent(_value: string) {
        // skip
    }

    /**
     * Get outerHTML
     */
    public get outerHTML(): string {
        return `<?${this._tagName}${Object.keys(this.attributes).map((key) => ` ${key}="${this.attributes[key]}"`).join('')}?>${this.innerHTML}`;
    }
}
