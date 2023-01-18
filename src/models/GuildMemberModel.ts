export interface GuildMemberModel {
    guildId: string;
    joinedTimestamp: number;
    premiumSinceTimestamp: number;
    deleted: boolean;
    nickname: string;
    pending: boolean;
    userId: string;
    displayName: string;
    roles: string[];
}