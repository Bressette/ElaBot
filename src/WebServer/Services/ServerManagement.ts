import {MongoUtil} from "../../util/mongoUtil";
import {Collection, Guild, GuildBan, GuildChannel, GuildEmoji, GuildMember, Role} from "discord.js";
import {GuildModel} from "../../models/GuildModel";
import {logger} from "../../logger";
import {GuildMemberModel} from "../../models/GuildMemberModel";
const getMention = require("../../util/getMention");
const getMessages = require("../../util/getMessages");
const isUrl = require("../../util/isUrl");

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

                            const mention = getMention.execute(tempString)
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
    guildRoles.forEach((value, key) => guildModel.roles.push(value.id));
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
    let result = await dbo.collection("guild").insertOne(guildModel);
    if(result === null || result === undefined) {
        logger.error("Guild insert was unsuccessful");
    }

    let guildMembersModels: GuildMemberModel[] = [];
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
        guildMembersModels.push(guildMemberModel);
    });

    result = await dbo.collection("guildmember").insertMany(guildMembersModels);
    if(result === null || result === undefined) {
        logger.error("GuildMember insert was unsuccessful");
    }

    return guildModel;
}

module.exports = {
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
    fetchStickersByServerId
}
