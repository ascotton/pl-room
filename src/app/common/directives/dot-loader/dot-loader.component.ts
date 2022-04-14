class DotLoaderController {
    align: string;
    constructor() {
        this.align = this.align ? this.align : 'center';
    }
}

import { commonDirectivesModule } from '../common-directives.module';
const dotLoader = commonDirectivesModule.component('dotloader', {
    template: require('./dot-loader.component.html'),
    bindings: {
        align: '<',
    },
    controller: DotLoaderController
  });
