import { PLImageDeckImage } from '../pl-image-decks/image-decks.model';

export interface PLWidget {
    $id?: string;
    type: string;
    name: string;
    iconScale?: number;
    icon: string;
    params: any;
    settings: any[];
    top_x: number;
    top_y: number;
    initial_top_x: number;
    initial_top_y: number;
    initial_width: number;
    actions: any;
    opacity: number;
    clicked: boolean;
    scaled: boolean;
    added: boolean;
    zIndex: number;
    hidden: boolean;
}

export interface PLDiceParams {
    callerId?: number;
    dice: number[];
    dices: number;
    counter: boolean;
    colored: boolean;
    animating: boolean;
    type: string;
    numberOfSides: number;
    selectedSides: string[];
}

export interface PLFlashcardsWidgetParams {
    deckUuid: string;
    cards: PLImageDeckImage[];
    drawnCards: number;
}
