import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

interface BasePart {
    content?: string;
}

interface TextPart extends BasePart {
    type: 'text';
}
interface LinkPart extends BasePart {
    type: 'link';
    href: string;
    target?: string;
}

type Part = TextPart | LinkPart;

const SAFE_URL_PATTERN = /^(?:(?:https?):|[^&:/?#]*(?:[/?#]|$))/gi;
const LINK_PATTERN = new RegExp('<\s*a[^>]*>(.*?)<\s*/\s*a>', 'g');
const LINK_ATTRS_PATTERN = new RegExp('<\s*a (.*?)>', 'g');

@Component({
    selector: 'pl-chat-message',
    templateUrl: 'pl-chat-message.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PLChatMessageComponent implements OnInit {
    private _message = '';
    public parts: Part[] = [];

    @Input() set message(newMessage: string) {
        if (this._message === newMessage) {
            return;
        }

        if (!newMessage) {
            this._message = '';
            this.parts = [];
            return;
        }

        this._message = newMessage;

        this.processMessage();
    }

    constructor() { }

    ngOnInit() { }

    private processMessage() {
        const matches = this._message.match(LINK_PATTERN) || [];

        const restOfMessage = matches.reduce(this.processLink.bind(this), this._message);

        this.appendText(restOfMessage);
    }

    private processLink(message: string, link: string) {
        const start = message.indexOf(link);
        const end = start + link.length;

        if (start !== 0) {
            this.appendText(message.slice(0, start));
        }

        const [, content] = new RegExp(LINK_PATTERN).exec(link);
        const { href, target } = this.processLinkAttributes(link);

        if (href.match(SAFE_URL_PATTERN)) {
            this.appendLink(href, content, target);
        }

        if (end === message.length) {
            return '';
        }

        return message.slice(end);
    }

    private processLinkAttributes(link: string) {
        const [, attrsString] = new RegExp(LINK_ATTRS_PATTERN).exec(link);
        const attrs = attrsString
            .trim()
            .split(' ')
            .filter(Boolean)
            .reduce((acu, next) => {
                const [key, value] = next.split('=');
                acu[key] = value.replace(/"/g, '');
                return acu;
            }, {});

        return {
            href: attrs['href'] || '#',
            target: attrs['target'] || '',
        };
    }

    private appendLink(href: string, content: string, target?: string) {
        this.parts.push({
            href,
            content,
            target,
            type: 'link',
        });
    }

    private appendText(text: string) {
        this.parts.push({
            type: 'text',
            content: text,
        });
    }
}
