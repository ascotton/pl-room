/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare interface SVGElement {
  hasClass(className: string): void;
  addClass(className: string): void;
  removeClass(className: string): void;
  toggleClass(className: string, state: boolean): void;
}

/// <reference path="./firebase.d.ts" />
