const mongoUtil = require("./../../util/mongoUtil");
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

module.exports = {
    fetchChannelsByServerId,
    fetchServers,
    fetchServerIconLink,
    fetchServerById,
    postMessage,
    fetchServerMessagesByChannelId
}