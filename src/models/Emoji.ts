export interface Emoji {
    animated: boolean;
    name: string;
    id: string;
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