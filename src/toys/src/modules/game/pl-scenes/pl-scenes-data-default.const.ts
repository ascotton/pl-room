import { SceneDescription, StickerPackDescription } from './pl-scenes-factory.service';

export const defaultScenes: SceneDescription[] = [
    {
        displayName: 'Playground',
        name: 'playground',
        background: 'background',
        preview: 'preview',
        stickerPackName: 'playground',
    },
    {
        displayName: 'Snow Day',
        name: 'snowday',
        background: 'background',
        preview: 'preview',
        stickerPackName: 'snowday',
    },
    {
        displayName: 'Carnival',
        name: 'carnival',
        background: 'background',
        preview: 'preview',
        stickerPackName: 'carnival',
    },
];

export const defaultStickerPacks: StickerPackDescription[] = [
    {
        name: 'playground',
        displayName: 'Playground',
        stickers: [
            {
                name: 'dog',
                width: 9.9,
                height: 6.6,
                displayName: 'Dog',
            },
            {
                name: 'ducky-bounce-girl',
                displayName: 'Ducky Bounce Girl',
                width: 14.1,
                height: 22.7,
            },
            {
                name: 'hopscotch',
                width: 30.7,
                height: 7.8,
            },
            {
                name: 'hopscotch-and-girl',
                width: 33.9,
                height: 22.6,
            },
            {
                name: 'hopscotch-jumping-girl',
                width: 19.5,
                height: 19.4,
            },
            {
                name: 'ice-cream-girl',
                width: 6.3,
                height: 15.1,
            },
            {
                name: 'jumprope-girl',
                displayName: 'Girl Jumproping',
                width: 11.3,
                height: 21.7,
            },
            {
                name: 'kick-ball',
                width: 3.8,
                height: 3.8,
            },
            {
                name: 'kickball-boy',
                width: 13.5,
                height: 17.4,
            },
            {
                name: 'kicking-boy',
                displayName: 'Boy Kicking',
                width: 9.2,
                height: 16.5,
            },
            {
                name: 'marbles',
                width: 14.5,
                height: 9.5,
            },
            {
                name: 'marbles-boys',
                width: 31.1,
                height: 19.6,
            },
            {
                name: 'marbles-pointing-boy',
                width: 8.3,
                height: 19.6,
            },
            {
                name: 'marbles-throwing-boy',
                displayName: 'Boy Throwing Marbles',
                width: 12.8,
                height: 15.4,
            },
            {
                name: 'running-boy',
                displayName: 'Boy Running',
                width: 8.8,
                height: 17.8,
            },
            {
                name: 'sandbox',
                width: 44.4,
                height: 15.6,
            },
            {
                name: 'sandbox-and-boy',
                width: 44.4,
                height: 22.6,
            },
            {
                name: 'sandbox-boy',
                displayName: 'Sand Castle Boy',
                width: 21.2,
                height: 14.9,
            },
            {
                name: 'see-saw-and-girl-boy',
                displayName: 'Girl and Boy on Seesaw',
                width: 32.6,
                height: 23.4,
            },
            {
                name: 'slide-and-girl-boy',
                displayName: 'Girl and Boy on Slide',
                width: 34.3,
                height: 24.9,
            },
            {
                name: 'swingset-and-girl-boy',
                displayName: 'Girl and Boy on Swing Set',
                width: 41.3,
                height: 23.8,
            },
        ],
    },
    {
        displayName: 'Snow Day',
        name: 'snowday',
        stickers: [
            {
                name: 'bird-feeder',
                width: 22,
                height: 17.9,
            },
            {
                name: 'boy-decorating',
                width: 11.2,
                height: 15.3,
            },
            {
                name: 'boy-w-snowball',
                displayName: 'Boy With Snowball',
                width: 10.2,
                height: 16.1,
            },
            {
                name: 'christmas-tree',
                width: 20.5,
                height: 36,
            },
            {
                name: 'dove-eating',
                width: 3.6,
                height: 4.5,
            },
            {
                name: 'dove-standing',
                width: 3.9,
                height: 3.6,
            },
            {
                name: 'dove-walking',
                width: 5.1,
                height: 4,
            },
            {
                name: 'hockey-player-1',
                width: 19.5,
                height: 17.6,
            },
            {
                name: 'hockey-player-2',
                width: 17.2,
                height: 19.2,
            },
            {
                name: 'ice-skaters',
                width: 31,
                height: 22.9,
            },
            {
                name: 'man-w-presents',
                displayName: 'Man With Presents',
                width: 11.4,
                height: 25,
            },
            {
                name: 'man-walking-dog',
                width: 23.6,
                height: 19.6,
            },
            {
                name: 'ornaments-box',
                width: 10.3,
                height: 0,
            },
            {
                name: 'sledders',
                width: 20.2,
                height: 17.8,
            },
            {
                name: 'snowman-girl',
                displayName: 'Girl and Snowman',
                width: 24.2,
                height: 24.7,
            },
            {
                name: 'large-tree',
                width: 18.5,
                height: 31.7,
            },
            {
                name: 'small-tree',
                width: 16.5,
                height: 28.8,
            },
            {
                name: 'woman-decorating',
                width: 19.2,
                height: 22.4,
            },
        ],
    },
    {
        displayName: 'Carnival',
        name: 'carnival',
        stickers: [
            {
                name: 'balloon-man',
                width: 16.5,
                height: 31.5,
            },
            {
                name: 'carousel',
                width: 39,
                height: 44.5,
            },
            {
                name: 'cheering-boy',
                displayName: 'Boy Cheering',
                width: 8.8,
                height: 14.2,
            },
            {
                name: 'cheering-girl',
                displayName: 'Girl Cheering',
                width: 8.6,
                height: 11.4,
            },
            {
                name: 'cotton-candy-girl',
                displayName: 'Girl With Cotton Candy',
                width: 8.5,
                height: 13.7,
            },
            {
                name: 'dog',
                width: 8.5,
                height: 5.7,
            },
            {
                name: 'french-fries-boy',
                displayName: 'Boy With French Fries',
                width: 4.7,
                height: 13.5,
            },
            {
                name: 'french-fry-place',
                displayName: 'French Fry Booth',
                width: 30.4,
                height: 33.9,
            },
            {
                name: 'ice-cream-girl',
                displayName: 'Girl With Ice Cream',
                width: 4.3,
                height: 10.37,
            },
            {
                name: 'kissing-couple',
                displayName: 'Couple Kissing',
                width: 14.2,
                height: 12,
            },
            {
                name: 'mother-son',
                displayName: 'Mother With Son',
                width: 14,
                height: 17,
            },
            {
                name: 'reaching-girl',
                displayName: 'Girl Reaching',
                width: 7,
                height: 10.3,
            },
            {
                name: 'reindeer-girl',
                width: 11.8,
                height: 21.1,
            },
            {
                name: 'strong-man',
                width: 23,
                height: 31.5,
            },
            {
                name: 'trash-can',
                width: 5.5,
                height: 10.7,
            },
            {
                name: 'unicorn-girl',
                width: 16.6,
                height: 21.1,
            },
            {
                name: 'woman-in-love',
                width: 5.2,
                height: 7.6,
            },
            {
                name: 'zebra-boy',
                width: 13.4,
                height: 21.1,
            },
        ],
    }
];
