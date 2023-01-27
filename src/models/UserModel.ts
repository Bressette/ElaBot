export interface UserModel {
    _id: string;
    bot: boolean;
    system: boolean;
    flags: number;
    username: string;
    discriminator: string;
    avatar: string;
    createdTimestamp: number;
    defaultAvatarURL: string;
    tag: string;
    avatarURL: string;
    displayAvatarURL: string;
}