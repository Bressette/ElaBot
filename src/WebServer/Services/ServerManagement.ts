import {MongoUtil} from "../../util/mongoUtil.js";
import {
    ClientOptions,
    Collection,
    Guild,
    GuildChannel,
    GuildEmoji,
    GuildMember,
    Message,
    Role,
    Sticker
} from 'discord.js';
import {GuildModel} from "../../models/GuildModel.js";
import {logger} from "../../logger.js";
import {GuildMemberModel} from "../../models/GuildMemberModel.js";
import {UserModel} from "../../models/UserModel.js";
import {ChannelModel} from "../../models/ChannelModel.js";
import {RoleModel} from "../../models/RoleModel.js";
import {EmojiModel} from "../../models/EmojiModel.js";
import {Attachment} from "../../models/Attachment.js";
import {EmbedModel} from "../../models/EmbedModel.js";
import {MessageModel} from "../../models/MessageModel.js";
import {Utils} from "../../util/Utils.js";

export async function deleteChannel(client, serverId: string, channelId: string) {
    const guild = await client.guilds.fetch(serverId);
    const channel = await guild.channels.fetch(channelId);
    await channel.delete();
}

async function fetchChannelsByServerId(serverId, client) {
    const guild = await client.guilds.fetch(serverId);
    return await guild.channels.fetch();
}

async function fetchRolesByServerId(serverId, client) {
    const guild = await client.guilds.fetch(serverId);
    return await guild.roles.fetch();
}

async function fetchServers(client) {
    return await client.guilds.fetch();
}

async function fetchServerIconLink(client, serverId) {
    const guild = await client.guilds.fetch(serverId);
    return guild.iconURL({dynamic: true});
}

async function fetchServerById(client, serverId) {
    return await client.guilds.fetch(serverId);
}

async function postMessage(client, serverId, channelId, message) {
    const guild = await client.guilds.fetch(serverId);
    const channel = await guild.channels.fetch(channelId);
    await channel.send(message);
}

async function fetchServerMessagesByChannelId(serverId, channelId, messageCount) {
    const dbo = MongoUtil.getDb();
    return await dbo.collection("messages").find({channelId: channelId, guildId: serverId}, {limit: parseInt(messageCount)}).toArray();
}

async function copyServerContents(sourceGuildId, targetGuildId, client) {
    const channels = Array.from(await fetchChannelsByServerId(sourceGuildId, client));
    const targetGuild = await client.guilds.fetch(targetGuildId);
    const guildCategory = await targetGuild.channels.create(channels[0][1].guild.name, {type: "GUILD_CATEGORY"});
    for(const i of channels) {
        if(i[1].type === "GUILD_TEXT") {
            if(i[1].name !== "general") {
                const currentChannel = await targetGuild.channels.create(i[1].name, {type: "GUILD_TEXT", parent: guildCategory});
            const fetchedMessages = (await fetchServerMessagesByChannelId(sourceGuildId, i[1].id, 100000)).sort(function(a, b)
            {
                // @ts-ignore
                return new Date(a.createdTimestamp) - new Date(b.createdTimestamp)
            });
            for(const j of fetchedMessages) {
                console.log("send messages here");
                if(j.content.length > 0) {
                    for(let x = 0; x < j.content.length; x++)
                    {
                        for(let y = x; y < j.content.length; y++)
                        {
                            const tempString = j.content.substring(x, y+1)

                            const mention = Utils.getMention(tempString);
                            if(mention)
                            {
                                j.content = j.content.replace(mention, "")
                            }
                        }
                    }
		    let messageToSend = `${j.authorUsername}#${j.authorDiscriminator} on ${new Date(j.createdTimestamp).toDateString()} | ${j.content}`;
		    messageToSend = messageToSend.substring(0, 2000);
                    await currentChannel.send(messageToSend);
                }
                if(j.attachments.length > 0) {
                    for(const k of j.attachments) {
                        await currentChannel.send(`${j.authorUsername}#${j.authorDiscriminator} on ${new Date(j.createdTimestamp).toDateString()} | ${k}`);
                    }
                }
            }
            }
        }
    }
}

async function fetchMembersByServerId(client, serverId) {
    const guild = await client.guilds.fetch(serverId);
    return await guild.members.fetch();
}

async function fetchUsersByServerId(client, serverId) {
    const guild = await client.guilds.fetch(serverId);
    const guildMembers = Array.from(await guild.members.fetch());
    let users = [];
    for(let i of guildMembers) {
        users.push(await i[1].user.fetch());
    }
    return users;
}

async function fetchEmojisByServerId(client, serverId) {
    const guild = await client.guilds.fetch(serverId);
    return await guild.emojis.fetch();
}

async function fetchStickersByServerId(client, serverId) {
    const guild = await client.guilds.fetch(serverId);
    return await guild.stickers.fetch();
}

async function storeServerContents(client, serverId) {
    const guild: Guild = await client.guilds.fetch(serverId);
    await storeGuild(guild);
    let guildMembers: Collection<string, GuildMember> = await guild.members.fetch();
    await storeGuildMembers(guildMembers);
    let channels = await guild.channels.fetch();
    await storeGuildChannels(channels);
    const roles = await guild.roles.fetch();
    await storeGuildRoles(roles);
    const emojis = await guild.emojis.fetch();
    await storeEmojis(emojis);
    await storeMessages(guild);
    logger.info(`Finished saving data for guild: ${guild.id}`);
    return true;
}

async function storeGuild(guild) {
    let guildModel: GuildModel = <GuildModel>{};

    //setting guild properties to store in MongoDB
    guildModel._id = guild.id;
    guildModel.name = guild.name;
    guildModel.icon = guild.icon;
    guildModel.features = guild.features;
    let guildMembers: Collection<string, GuildMember> = await guild.members.fetch();
    guildModel.members = [];
    guildMembers.forEach((value, key) => guildModel.members.push(value.id));
    let guildChannels: Collection<string, GuildChannel> = await guild.channels.fetch();
    guildModel.channels = [];
    guildChannels.forEach((value, key) => guildModel.channels.push(value.id));
    let guildRoles: Collection<string, Role> = await guild.roles.fetch();
    guildModel.roles = [];

    // add guild roles
    guildRoles.forEach((value, key) => {
        guildModel.roles.push(value.id);
    });
    guildModel.splash = guild.splash;
    guildModel.verificationLevel = guild.verificationLevel;
    guildModel.nsfwLevel = guild.nsfwLevel;
    guildModel.memberCount = guild.memberCount;
    guildModel.afkTimeout = guild.afkTimeout;
    guildModel.afkChannelId = guild.afkChannelId;
    guildModel.systemChannelId = guild.systemChannelId;
    guildModel.premiumTier = guild.premiumTier;
    guildModel.premiumSubscriptionCount = guild.premiumSubscriptionCount;
    guildModel.explicitContentFilter = guild.explicitContentFilter;
    guildModel.joinedTimestamp = guild.joinedTimestamp;
    guildModel.defaultMessageNotifications = guild.defaultMessageNotifications;
    guildModel.maximumMembers = guild.maximumMembers;
    guildModel.maximumPresences = guild.maximumPresences;
    guildModel.preferredLocale = guild.preferredLocale;
    guildModel.ownerId = guild.ownerId;
    let emojis: Collection<string, GuildEmoji> = await guild.emojis.fetch();
    guildModel.emojis = [];
    emojis.forEach((value, key) => guildModel.emojis.push(value.id));
    guildModel.nameAcronym = guild.nameAcronym;
    guildModel.splashURL = guild.splashURL();
    guildModel.bannerURL = guild.bannerURL();
    guildModel.discoverySplashURL = guild.discoverySplashURL();

    const dbo = MongoUtil.getDb();
    try {
        let result = await dbo.collection("guild").insertOne(guildModel);
        if(result === null || result === undefined) {
            logger.error("Guild insert was unsuccessful");
        } else {
            logger.info(`Inserted Guild: {${guildModel.name}, ${guildModel._id}`);
        }
    } catch(err) {
        logger.error("Guild insert was unsuccessful: " + JSON.stringify(err));
    }


}

async function storeGuildMembers(guildMembers) {
    let guildMembersModels: GuildMemberModel[] = [];
    let userModels: UserModel[] = [];
    guildMembers.forEach((value, key) => {
        let guildMemberModel = <GuildMemberModel>{};
        guildMemberModel.guildId = value.guild.id;
        let roles: Collection<string, Role> = value.roles.cache;
        guildMemberModel.roles = [];
        roles.forEach((role, key) => guildMemberModel.roles.push(role.id));
        guildMemberModel.deleted = value.deleted;
        guildMemberModel.joinedTimestamp = value.joinedTimestamp;
        guildMemberModel.nickname = value.nickname;
        guildMemberModel.displayName = value.displayName;
        guildMemberModel.pending = value.pending;
        guildMemberModel.premiumSinceTimestamp = value.premiumSinceTimestamp;
        guildMemberModel.userId = value.user.id;
        let userModel = <UserModel>{};
        userModel._id = value.user.id;
        userModel.bot = value.user.bot;
        userModel.tag = value.user.tag;
        userModel.createdTimestamp = value.user.createdTimestamp;
        userModel.avatar = value.user.avatar;
        userModel.avatarURL = value.user.avatarURL();
        userModel.defaultAvatarURL = value.user.defaultAvatarURL;
        userModel.discriminator = value.user.discriminator;
        userModel.system = value.user.system;
        userModel.username = value.user.username;
        userModels.push(userModel);
        guildMembersModels.push(guildMemberModel);
    });

    const dbo = MongoUtil.getDb();
    try {
        let result = await dbo.collection("guildmember").insertMany(guildMembersModels, {ordered: false});
        if (result === null || result === undefined) {
            logger.error("GuildMember insert was unsuccessful");
        } else {
            logger.info("Successfully inserted guild members");
        }
    }
    catch(err) {
        logger.error("GuildMember insert was unsuccessful");
    }
    try {
        const result = await dbo.collection("user").insertMany(userModels, {ordered: false});
        if(result === null || result === undefined) {
            logger.error("User insert was unsuccessful");
        } else {
            logger.info("Successfully inserted users");
        }
    } catch(err) {
        logger.error("User insert was unsuccessful");
    }
}

async function storeGuildChannels(channels) {
    let channelModels: ChannelModel[] = [];
    channels.forEach((value, key) => {
        let channelModel = <ChannelModel>{};
        channelModel._id = value.id;
        channelModel.name = value.name;
        channelModel.deleted = value.deleted;
        channelModel.createdTimestamp = value.createdTimestamp;
        channelModel.type = value.type;
        channelModel.guildId = value.guildId;
        channelModel.parentId = value.parentId;
        channelModel.rawPosition = value.rawPosition;
        channelModels.push(channelModel);
    });
    const dbo = MongoUtil.getDb();
    try {
        const result = await dbo.collection("channel").insertMany(channelModels, {ordered: false});
        if(result === null || result === undefined) {
            logger.error("Channel insert was unsuccessful");
        } else {
            logger.error("Channel insert was successful");
        }
    } catch(err) {
        logger.error("Channel insert was unsuccessful");
    }
}

async function createChannel(client: ClientOptions, serverId: string, channelName: string) {
    const guild = await client.guilds.fetch(serverId);
    guild.channels.create(channelName);

}

async function storeGuildRoles(roles: Collection<string, Role>) {
    const roleModels: RoleModel[] = [];
    roles.forEach((value) => {
        let roleModel = {} as RoleModel;
        roleModel.guild = value.guild.id;
        roleModel._id = value.id;
        roleModel.name = value.name;
        roleModel.color = value.color;
        roleModel.hoist = value.hoist;
        roleModel.rawPosition = value.rawPosition;
        roleModel.permissions = value.permissions.toArray();
        roleModel.managed = value.managed;
        roleModel.mentionable = value.mentionable;
        roleModel.deleted = value.deleted;
        roleModel.createdTimestamp = value.createdTimestamp;
        roleModels.push(roleModel);
    });

    try {
        const dbo = MongoUtil.getDb();
        const result = await dbo.collection("role").insertMany(roleModels, {ordered: false});
        if(result === null || result === undefined) {
            logger.error("Role insert was unsuccessful");
        } else {
            logger.error("Role insert was successful");
        }
    } catch(err) {
        logger.error("Role insert was unsuccessful");
    }
}

async function storeEmojis(emojis: Collection<string, GuildEmoji>) {
    const emojiModels: EmojiModel[] = []
    emojis.forEach((value) => {
        const emojiModel = {} as EmojiModel;
        emojiModel._id = value.id;
        emojiModel.animated = value.animated;
        emojiModel.name = value.name;
        emojiModel.deleted = value.deleted;
        emojiModel.guildId = value.guild.id;
        emojiModel.requiresColons = value.requiresColons;
        emojiModel.managed = value.managed;
        emojiModel.available = value.available;
        emojiModel.author = value.author.id;
        emojiModel.createdTimestamp = value.createdTimestamp;
        emojiModel.url = value.url;
        emojiModel.identifier = value.identifier;
        emojiModels.push(emojiModel);
    });
    try {
        const dbo = MongoUtil.getDb();
        const result = await dbo.collection("emoji").insertMany(emojiModels, {ordered: false});
        if(result === null || result === undefined) {
            logger.error("Emoji insert was unsuccessful");
        } else {
            logger.error("Emoji insert was successful");
        }
    } catch(err) {
        logger.error("Emoji insert was unsuccessful");
    }
}

async function storeMessages(guild: Guild) {
    let channels: Collection<string, GuildChannel> = await guild.channels.fetch();
    let allMessages = [];
    channels = channels.filter((value => value.isText()));
    const channelValues: IterableIterator<GuildChannel> = channels.values();
    try {
        for(let channel; !(channel = channelValues.next().value).done;) {
            logger.info(`Fetching messages for guild: ${guild.id}, channel: ${channel.name}`);
            let messages = await Utils.getMessages(channel, 100000000);
            for(const i of messages)
            {
                const message: MessageModel = {} as Message;
                if(i[1].attachments.size > 0) {
                    const attachments: Attachment[] = [];
                    i[1].attachments.forEach(value => {
                        const attachment = {} as Attachment;
                        attachment._id = value.id;
                        attachment.height = value.height;
                        attachment.contentType = value.contentType;
                        attachment.name = value.name;
                        attachment.proxyURL = value.proxyURL;
                        attachment.size = value.size;
                        attachment.spoiler = value.spoiler;
                        attachment.url = value.url;
                        attachment.width = value.width;
                        attachments.push(attachment);
                    });
                    message.attachments = attachments;
                }
                if(i[1].embeds.size > 0) {
                    const embeds: EmbedModel[] = [];
                    i[1].embeds.forEach(value => {
                        const embed = {} as EmbedModel;
                        embed.title = value.title;
                        embed.description = value.description;
                        embed.url = value.url;
                        embed.color = value.color;
                        embed.timestamp = value.timestamp;
                        embed.thumbnail = value.thumbnail;
                        embed.image = value.image;
                        embed.video = value.video;
                        embed.author = value.author;
                        embed.provider = value.provider;
                        embeds.push(embed);
                    });
                    message.embeds = embeds;
                }


                const stickers: Collection<string, Sticker> = await i[1].stickers;
                const stickerIds: string[] = [];
                stickers.forEach(value => {
                    stickerIds.push(value.id);
                });
                message.stickers = stickerIds;
                message.createdTimestamp = i[1].createdTimestamp;
                message.editedTimestamp = i[1].editedTimestamp;
                message.channelId = i[1].channel.id;
                message.guildId = i[1].guild.id;
                message.deleted = i[1].deleted;
                message._id = i[1].id;
                message.type = i[1].type;
                message.system = i[1].system;
                message.content = i[1].content;
                message.authorId = i[1].author.id;
                message.pinned = i[1].pinned;
                message.tts = i[1].tts;
                allMessages.push(message);
            }
            await persistMessagesForChannel(allMessages);
        }
    } catch(err) {
        logger.error(`Error inserting messages: ${err}`);
    }
}

async function persistMessagesForChannel(messages: Message[]) {
    try {
        while(messages.length > 0) {
            const subMessages = messages.splice(0, 100);
            const dbo = MongoUtil.getDb();
            const result = await dbo.collection("message").insertMany(subMessages, {ordered: false});
            if(result === null || result === undefined) {
                logger.error("Messages were inserted unsuccessfully");
            } else {
                logger.error("Messages were inserted successfully");
            }
        }
    } catch(err) {
        logger.error(err);
    }
}

export {
    fetchChannelsByServerId,
    fetchServers,
    fetchServerIconLink,
    fetchServerById,
    postMessage,
    storeServerContents,
    fetchServerMessagesByChannelId,
    copyServerContents,
    fetchMembersByServerId,
    fetchRolesByServerId,
    fetchUsersByServerId,
    fetchEmojisByServerId,
    fetchStickersByServerId,
    createChannel
}
