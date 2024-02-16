import {EmbedModel} from "./EmbedModel.js";
import {Attachment} from "./Attachment.js";

export interface MessageModel {
    channelId: string;
    guildId: string;
    deleted: boolean;
    _id: string;
    type: string;
    system: boolean;
    content: string;
    authorId: string;
    pinned: boolean;
    tts: boolean;
    embeds: EmbedModel[];
    attachments: Attachment[];
    stickers: string[];
    createdTimestamp: number;
    editedTimestamp: number;
}