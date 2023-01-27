export interface EmojiModel {
    animated: boolean;
    name: string;
    _id: string;
    deleted: boolean;
    guildId: string;
    requiresColons: boolean;
    managed: boolean;
    available: boolean;
    author: string;
    createdTimestamp: number;
    url: string;
    identifier: string;
}