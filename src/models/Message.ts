import {Embed} from "./Embed";

export interface Message {
    channelId: string;
    guildId: string;
    deleted: boolean;
    id: string;
    type: string;
    system: boolean;
    content: string;
    authorId: string;
    pinned: boolean;
    tts: boolean;
    embeds: Embed[];
    attachments: string[];
    stickers: string[];
    createdTimestamp: number;
    editedTimestamp: number;
}