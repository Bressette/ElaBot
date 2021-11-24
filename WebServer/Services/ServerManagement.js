const mongoUtil = require("./../../util/mongoUtil");
const getMention = require("./../../util/getMention");
const isUrl = require("./../../util/isUrl");

async function fetchChannelsByServerId(serverId, client) {
    const guild = await client.guilds.fetch(serverId);
    return await guild.channels.fetch();
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
    const dbo = mongoUtil.getDb();
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

module.exports = {
    fetchChannelsByServerId,
    fetchServers,
    fetchServerIconLink,
    fetchServerById,
    postMessage,
    fetchServerMessagesByChannelId,
    copyServerContents,
    fetchMembersByServerId
}
