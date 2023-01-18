export interface Channel {
    type: string;
    deleted: boolean;
    guildId: string;
    parentId: string;
    id: string;
    name: string;
    rawPosition: number;
    createdTimestamp: number;
}