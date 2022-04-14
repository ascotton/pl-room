import { Directive, Input, ElementRef } from '@angular/core';
import { AnimationPlayer, AnimationMetadata, style, animate, AnimationBuilder } from '@angular/animations';

@Directive({ selector: '[plSlideDown]' })
export class PLSlideDownDirective {
    private player: AnimationPlayer;
    private readonly inStyle = style({
        height: '*',
        'margin-top': '*',
        'margin-bottom': '*',
        'padding-top': '*',
        'padding-bottom': '*',
        overflow: '*',
        opacity: 1,
    });
    private readonly outStyle = style({
        height: '0px',
        'margin-top': '0px',
        'margin-bottom': '0px',
        'padding-top': '0px',
        'padding-bottom': '0px',
        overflow: 'hidden',
        opacity: 0,
    });

    @Input() set in(inVal: boolean) {
        if (this.player) {
            this.player.destroy();
        }

        const metadata = inVal ? this.slideIn() : this.slideOut();

        const factory = this.builder.build(metadata);
        this.player = factory.create(this.el.nativeElement);
        this.player.play();
    }

    constructor(
        private builder: AnimationBuilder,
        private el: ElementRef,
    ) { }

    private slideIn(): AnimationMetadata[] {
        return [
            this.outStyle,
            animate('225ms cubic-bezier(0.4, 0, 0.2, 1)', this.inStyle),
        ];
    }
    private slideOut(): AnimationMetadata[] {
        return [
            this.inStyle,
            animate('225ms cubic-bezier(0.4, 0, 0.2, 1)', this.outStyle),
        ];
    }
}
