export interface ChannelModel {
    type: string;
    deleted: boolean;
    guildId: string;
    parentId: string;
    _id: string;
    name: string;
    rawPosition: number;
    createdTimestamp: number;
}