// noinspection JSUnusedGlobalSymbols
// noinspection JSUnusedGlobalSymbols

import {
    deep_freeze,
    is_string
} from './Helper';

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
 * @param {SimpleElement} parent
 */
// regex loop nested
const matchElement = <T extends SimpleElement | undefined>(content: string, parent: T = undefined as T): T => {
    if (!is_string(content)) {
        return parent;
    }
    // remove all comments
    content = content.replace(/<!--.*?-->/g, '');
    // get text node or node with while loop
    while (content.length > 0) {
        // regex match tag & text
        let match = content.match(/^([^<]+|<[^>\s]+[^>]*>)/sm);
        if (!match) {
            return parent;
        }
        if (!match[1].includes('<')) {
            let text = match[1];
            let textNode = new TextNode(text, parent);
            if (parent instanceof SimpleElement) {
                parent.appendChild(textNode);
            }
            content = content.substring(text.length);
            continue;
        }
        // get matched by root on top only
        // match one by one eg: <div1>(content)</div1><div2>(content)</div2>
        match = content.match(/^<([^>\s]+)([^>]*)?>(.*?)<\/\1>/sm);
        if (!match) {
            match = content.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*)?\/?>/sm);
            if (!match) {
                // check self closed
                match = content.match(/^<([^>\s]+)([^>]*)?\/>/sm);
            }
            if (!match) {
                return parent;
            }
        }
        let element = new SimpleElement(match[0], parent);
        if (parent instanceof SimpleElement) {
            parent.appendChild(element);
        }
        content = content.substring(match[0].length);
    }
    return parent;
}

/**
 * Parse attributes
 */
const parse_attributes = (attributes: string): {
    [key: string]: string
} => {
    let result: {
        [key: string]: string
    } = {};
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
    return result;
}

const self_close_tag : string[] = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];

/**
 *
 */
abstract class SimpleNode {
    public abstract get outerHTML(): string;
    public abstract get innerHTML(): string;
    public abstract get textContent(): string;
    public abstract remove(): void;
}
/**
 *
 */
export class TextNode extends SimpleNode {
    public readonly text: string;
    public readonly parentElement: SimpleElement | SimpleDocumentFragment | undefined;
    /**
     *
     */
    public constructor(text: string, parent: SimpleElement | SimpleDocumentFragment | undefined = undefined) {
        super();
        this.text = text;
        this.parentElement = parent;
    }
    /**
     *
     */
    public get outerHTML(): string {
        return this.text;
    }
    /**
     *
     */
    public get innerHTML(): string {
        return this.text;
    }
    /**
     *
     */
    public get textContent(): string {
        return this.text;
    }

    /**
     *
     */
    public remove(): void {
        if (this.parentElement instanceof SimpleElement) {
            this.parentElement.childNodes = this.parentElement.childNodes.filter((child) => child !== this);
        }
    }
}

/**
 * ReadonlySimpleElement - the simple element for read only element
 * The simple element implementation, but read only
 */
export class SimpleElement extends SimpleNode {
    /**
     * the document element type
     *
     * @private
     */
    public tagName: string;

    /**
     * the document element children
     */
    #attributes: {
        [key: string]: string
    };

    /**
     * The attributes list
     */
    public attributeList : {
        [key: string]: string
    } = {};

    /**
     * the document element children
     */
    public childNodes: Array<SimpleNode> = [];

    /**
     * the parent element
     *
     * @private
     */
    public parentElement: SimpleElement | SimpleDocumentFragment | undefined;

    // noinspection TypeScriptFieldCanBeMadeReadonly
    /**
     * Check if the element is XML
     *
     * @private
     */
    #isXML: boolean = false;

    /**
     * Inner HTML
     * @private
     */
    readonly #innerText: string = '';

    /**
     * SimpleElement constructor
     */
    public constructor(content: string | SimpleElement, parent: SimpleElement | SimpleDocumentFragment | undefined = undefined) {
        super();
        this.parentElement = parent instanceof SimpleElement || parent instanceof SimpleDocumentFragment ? parent : undefined;
        content = content instanceof SimpleElement ? content.outerHTML : content;
        content = is_string(content) ? content : '';
        // replace all comments
        content = content.replace(/<!--.*?-->/g, '');
        let match = content.match(/^(\s+)</);
        if (match) {
            this.childNodes.push(new TextNode(match[1]));
            content = content.substring(match[0].length - 1);
        }
        match = content.match(/^<([a-zA-Z0-9_-]+)([^>]*)?>(.*?)<\/\1>$/sm);
        if (!match) {
            match = content.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*)?\/?>/sm);
            if (!match) {
                // check self closed
                match = content.match(/^<([a-zA-Z0-9_-]+)([^>]*)?\/>\s*$/sm);
            }
        }
        const attributes = parse_attributes(match ? match[2] : '');
        this.tagName = (match ? match[1] : '').toUpperCase();
        this.#attributes = Object.assign({}, attributes);
        this.attributeList = Object.assign({}, attributes);
        this.childNodes = matchElement(match ? (is_string(match[3]) ? match[3] : '') : '', this).childNodes;
        if (this.childNodes.length === 0) {
            this.#innerText = match ? (is_string(match[3]) ? match[3] : '') : '';
        }
        let parentElement = this.parentElement;
        if (parentElement instanceof SimpleDocumentFragment) {
            this.#isXML = parentElement.type === 'xml';
        } else if (parentElement) {
            this.#isXML = parentElement.#isXML;
        }
    }

    /**
     * Get the parent element
     */
    public get children(): SimpleElement[] {
        return this.childNodes.filter((child) => child instanceof SimpleElement);
    }

    /**
     * Get the closest selector
     *
     * @param {string} selector
     */
    public closest(selector: string): SimpleElement | null {
        let parent = this.parentElement;
        while (parent instanceof SimpleElement) {
            if (parent.querySelector(selector)) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    /**
     * Push child
     *
     * @param {SimpleElement} child
     * @param _children
     */
    public appendChild(child: SimpleNode, ..._children: SimpleNode[]): void {
        // noinspection SuspiciousTypeOfGuard
        if (child === this || !(child instanceof SimpleNode)) {
            return;
        }
        // check if contains remove child
        child.remove();
        if (child instanceof SimpleElement) {
            child.parentElement = this;
        }
        this.childNodes.push(child);
        _children.forEach((c) => {
            // noinspection SuspiciousTypeOfGuard
            if (c === this || !(c instanceof SimpleNode)) {
                return;
            }
            this.childNodes.push(c);
            c.remove();
            if (c instanceof SimpleElement) {
                c.parentElement = this;
            }
        });
    }

    /**
     * Replace child
     */
    public replaceChildren(children: SimpleNode, ..._children: SimpleNode[]): void {
        this.childNodes = [];
        this.appendChild(children, ..._children);
    }

    /**
     * Replace child
     */
    public replaceWith(child: SimpleElement): void {
        // noinspection SuspiciousTypeOfGuard
        if (child === this || !(child instanceof SimpleElement)) {
            return;
        }
        if (this.parentElement instanceof SimpleElement) {
            this.parentElement.appendChild(child);
        }
        this.#attributes = child.#attributes;
        this.childNodes = child.childNodes;
        this.tagName = child.tagName;
        child.#isXML = this.#isXML;
        child.parentElement = this.parentElement;
        this.remove();
    }

    /**
     * Remove child
     */
    public remove(): void {
        if (this.parentElement instanceof SimpleElement) {
            this.parentElement.childNodes = this.parentElement.childNodes.filter((child) => child !== this);
            this.parentElement = undefined;
        }
    }

    /**
     * Remove child
     */
    public removeChild(child: SimpleNode|any): void {
        if (child instanceof SimpleNode) {
            for (let c of this.childNodes) {
                if (c === child) {
                    c.remove();
                    return;
                }
            }
        }
    }

    /**
     * Get innerHTML
     */
    public get innerHTML(): string {
        return this.childNodes.length > 0
            ? this.childNodes.map((child) => child.outerHTML).join('')
            : this.#innerText;
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
    public getAttributeNames(): string[] {
        return Object.keys(this.#attributes);
    }

    /**
     * Get attributes
     *
     * @return {{
     *      [key: string]: string
     * }} the attributes
     */
    public getAttributes(): {[key: string]: string} {
        return Object.assign({}, this.#attributes);
    }

    /**
     * Set attribute
     */
    public getAttribute(key: string): string | null {
        key = normalize_attribute_name(key);
        return key in this.#attributes ? this.#attributes[key] : null;
    }

    /**
     * Set attribute
     */
    public setAttribute(key: string, value: string): void {
        key = normalize_attribute_name(key);
        value = value ? value + '' : '';
        this.#attributes[key] = value;
        this.attributeList = Object.assign({}, this.#attributes);
    }

    /**
     * Check if object has attribute
     *
     * @param key
     */
    public hasAttribute(key: string): boolean {
        key = normalize_attribute_name(key);
        return key in this.#attributes;
    }

    /**
     * Has attribute
     */
    public get textContent(): string {
        return this.innerHTML.replace(/<[^>]+>/g, '');
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
        return this.#attributes.class || '';
    }

    /**
     * Set className
     */
    public get attributes(): {readonly length: number; [key: string]: string|number;} {
        const attributes : {
            length: number;
            [key: string]: string|number;
        } = Object.assign({}, this.#attributes) as {
            length: number;
            [key: string]: string|number;
        };
        Object.defineProperties(attributes, {
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
        const tagName = this.tagName.toLowerCase();
        if (tagName && (this.#isXML && this.innerHTML === '' || self_close_tag.includes(tagName.toLowerCase()))) {
            return `<${this.tagName}${Object.keys(this.#attributes).map((key) => ` ${key}="${this.#attributes[key]}"`).join('')}/>`;
        }
        return tagName
            ? `<${tagName}${Object.keys(this.#attributes).map((key) => ` ${key}="${this.#attributes[key]}"`).join('')}>${this.innerHTML}</${tagName}>`
            : this.innerHTML;
    }

    /**
     * Query selector, find the first element that match the selector
     *
     * @param {string} selectors
     * @param {Array<SimpleElement>} excludes - the excludes element
     * @param {boolean} findAll - find all elements
     */
    private findIndex(selectors: string, excludes : Array<SimpleElement> = [], findAll: boolean = false): SimpleElement|SimpleElement[]|null {
        let results: SimpleElement[] = [];
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
        excludes = (!Array.isArray(excludes) ? [] : excludes).filter((node) => node instanceof SimpleElement);
        for (let selector of the_selectors) {
            selector = selector.trim();
            const match = selector.match(/^>?((?:[.#]?[a-zA-Z0-9_-]+|\*)?)(?:(\[.+?])*([\s>].+)?)?$/);
            if (!match) {
                return findAll ? results : null;
            }
            const isRoot = selector.startsWith('>');
            let tagName = match[1].toUpperCase();
            let prefix = ['.', '#'].includes(tagName[0]) ? tagName[0] : '';
            let attr = match[2] || '';
            const subSelector = match[3];
            let attributes: {
                [key: string]: string
            } = {};
            switch (prefix) {
                case '.':
                    tagName = '*';
                    attributes['class'] = match[1].substring(1);
                    break;
                case '#':
                    tagName = '*';
                    attributes['id'] = match[1].substring(1);
                    break;
                default:
                    tagName = tagName.trim();
                    tagName = tagName === '' ? '*' : tagName;
                    break;
            }
            tagName = tagName.toUpperCase();
            let do_continue = false;
            for (let child of this.children) {
                if (child.tagName !== tagName && tagName !== '*') {
                    let c = child.findIndex(selector, excludes, false) as SimpleElement;
                    if (c) {
                        if (!findAll) {
                            return c;
                        }
                        results.push(c);
                        excludes.push(c);
                    }
                    continue;
                }
                do_continue = false;
                if (!attr && Object.keys(attributes).length === 0) {
                    if (subSelector) {
                        let c = child.findIndex(subSelector, excludes, false) as SimpleElement;
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
                        const attributeValue = attributes[key] || '';
                        switch (key) {
                            case 'class':
                                do_continue = true;
                                if (attributeValue !== '' && !child.classList.contains(attributes[key])) {
                                    if (isRoot) {
                                        if (!findAll) {
                                            return null;
                                        }
                                        break;
                                    }
                                    let c = child.findIndex(selector, excludes, false) as SimpleElement;
                                    if (c) {
                                        if (!findAll) {
                                            return c;
                                        }
                                        results.push(c);
                                        excludes.push(c);
                                    }
                                    break;
                                }
                                results.push(child);
                                excludes.push(child);
                                break;
                            case 'id':
                                if (attributeValue !== '' && child.getAttribute(key) !== attributeValue) {
                                    if (isRoot) {
                                        if (!findAll) {
                                            return null;
                                        }
                                        do_continue = true;
                                        break;
                                    }
                                    let c = child.findIndex(selector, excludes, false) as SimpleElement;
                                    if (c) {
                                        return findAll ? [c] : c;
                                    }
                                    do_continue = true;
                                    break;
                                }
                                return findAll ? [child] : child;
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
                    value = value || '';
                    key = normalize_attribute_name(key).toLowerCase();
                    const isId = key === 'id';
                    if (value === '') {
                        if (child.hasAttribute(key)) {
                            continue;
                        }
                        if (isRoot) {
                            return null;
                        }
                        let c = child.findIndex(selector, excludes, false) as SimpleElement;
                        if (c) {
                            if (!findAll) {
                                return c;
                            }
                            if (isId) {
                                return findAll ? [c] : c;
                            }
                            results.push(c);
                            excludes.push(c);
                        }
                        continue;
                    }
                    let attrValue = child.getAttribute(key);
                    if (attrValue === null) {
                        if (isRoot) {
                            if (!findAll) {
                                return null;
                            }
                            continue;
                        }
                        let c = child.findIndex(selector, excludes, false) as SimpleElement;
                        if (c) {
                            if (!findAll) {
                                return c;
                            }
                            if (isId) {
                                return findAll ? [c] : c;
                            }
                            results.push(c);
                            excludes.push(c);
                        }
                        continue;
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
                            let c = child.findIndex(selector, excludes, false) as SimpleElement;
                            if (c) {
                                if (!findAll) {
                                    return c;
                                }
                                if (isId) {
                                    return findAll ? [c] : c;
                                }
                                results.push(c);
                                excludes.push(c);
                            }
                            continue;
                        }
                    }
                    if (subSelector) {
                        let c = child.findIndex(subSelector, excludes, false) as SimpleElement;
                        if (c) {
                            if (!findAll) {
                                return c;
                            }
                            if (isId) {
                                return findAll ? [c] : c;
                            }
                            results.push(c);
                            excludes.push(c);
                        }
                    }
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
        return findAll ? [...new Set(results)] : null;
    }

    /**
     * Query selector, find the first element that match the selector
     *
     * @param {string} selector
     */
    public querySelector(selector: string): SimpleElement | null {
        return this.findIndex(selector, [this], false) as SimpleElement|null;
    }

    /**
     * Query selector all, find all elements that match the selector
     */
    public querySelectorAll(selector: string): SimpleElement[] {
        return this.findIndex(selector, [this], true) as SimpleElement[];
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
    public readonly tagName: string;

    /**
     * the document element
     * @private
     */
    public readonly documentElement: SimpleElement;

    /**
     * the document element attributes
     * @private
     */
    public readonly attributes: {
        [key: string]: string
    };

    /**
     * SimpleDocumentFragment constructor
     */
    public constructor(content: string | SimpleDocumentFragment | SimpleElement, type: 'xml' | 'html' = 'html') {
        // noinspection SuspiciousTypeOfGuard
        if (content instanceof SimpleDocumentFragment || content instanceof SimpleDocumentFragment) {
            content = content.outerHTML;
        } else {
            content = content + '';
        }
        content = content.trim();
        // noinspection SuspiciousTypeOfGuard
        type = typeof type === 'string' ? type.trim().toLowerCase() as 'html' : 'html';
        type = ['xml', 'html'].includes(type) ? type : 'html';
        content = (content as string).trim();
        let tagName: string = 'document';
        let match: RegExpMatchArray | null = null;
        content = content.replace(/<!--.*?-->/g, '');
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
        this.tagName = tagName.trim().toLowerCase();
        this.attributes = deep_freeze(parse_attributes(attributes));
        let element = new SimpleElement(content, this);
        if (type === 'xml') {
            this.documentElement = element;
            return;
        }
        // noinspection HtmlRequiredLangAttribute,HtmlRequiredTitleElement
        let htmlElement = new SimpleElement('<html><head></head><body></body></html>', this);
        if (element.tagName === 'HTML') {
            let body = element.querySelector('body');
            let head = element.querySelector('head');
            element.removeChild(body);
            element.removeChild(head);
            if (head) {
                htmlElement.querySelector('head')?.replaceWith(head);
            }
            if (body) {
                htmlElement.querySelector('body')?.replaceWith(body);
            } else {
                htmlElement.querySelector('body')?.replaceChildren(element);
            }
        } else  {
            htmlElement.querySelector('body')?.appendChild(element);
        }
        this.documentElement = htmlElement;
    }

    /**
     * Get innerHTML
     */
    public get innerHTML(): string {
        return this.documentElement.outerHTML;
    }

    /**
     * Set innerHTML
     * skip
     */
    public set innerHTML(_value: string) {
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
        if (this.type === 'xml') {
            return `<?${this.tagName}${Object.keys(this.attributes).map((key) => ` ${key}="${this.attributes[key]}"`).join('')}?>${this.innerHTML}`;
        }
        if (this.tagName === 'document') {
            let innerHTML = this.innerHTML;
            let content = '<!DOCTYPE html>';
            if (this.documentElement.tagName !== 'HTML') {
                // noinspection HtmlRequiredLangAttribute
                content += '<html>';
            }
            // find head
            let head = this.documentElement.querySelector('> html > head');
            if (!head) {
                // noinspection HtmlRequiredTitleElement
                content += '<head></head>';
            }
            let body = this.documentElement.querySelector('> html > body');
            if (!body) {
                content += '<body>';
            }
            content += innerHTML;
            if (body) {
                content += '</body>';
            }
            if (this.documentElement.tagName !== 'HTML') {
                content += '</html>';
            }
            return content;
        }
        return `<!${this.tagName}${Object.keys(this.attributes).map((key) => ` ${key}="${this.attributes[key]}"`).join('')}>${this.innerHTML}`;
    }
}
