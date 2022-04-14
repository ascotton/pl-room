export interface PLImageDeckImage {
    id: string;
    title: string;
    url: string;
    thumbnailUrl: string;
    copies: number;
}
export interface PLImageDeck {
    id: number;
    uuid: string;
    name: string;
    creator: string;
    thumbnailUrl: string;
    description?: string;
    images: PLImageDeckImage[];
}