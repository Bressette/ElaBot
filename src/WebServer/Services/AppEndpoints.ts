import express from 'express';
const app = express();
const port = 8093
import * as serverManagement from "./ServerManagement.js";
import bodyParser from 'body-parser';
import {Utils} from "../../util/Utils.js";
const jsonParser = bodyParser.json();
// @ts-ignore

const startEndpoints = function(client) {
    //endpoints used to retrieve server info for connected servers
    app.get('/discord/channels/:serverId', async (req, res) => {
        const channels = await serverManagement.fetchChannelsByServerId(req.params.serverId, client);
        res.json(channels);
    });

    app.get('/discord/roles/:serverId', async (req, res) => {
        const roles = await serverManagement.fetchRolesByServerId(req.params.serverId, client);
        const outputJson = JSON.stringify(roles, (key, value) =>
            typeof value === "bigint" ? value.toString() + "n" : value
        );
        res.setHeader('Content-Type', 'application/json');
        res.end(outputJson);
    });

    app.get('/discord/servers', async (req, res) => {
        const servers = await serverManagement.fetchServers(client);
        console.log(`Retrieved servers: ${servers.size}`)
        const outputJson = JSON.stringify(servers, (key, value) =>
            typeof value === "bigint" ? value.toString() + "n" : value
        );
        res.setHeader('Content-Type', 'application/json');
        res.end(outputJson);
    });

    app.get('/discord/server/icon/:serverId', async(req, res) => {
        res.json({iconUrl: await serverManagement.fetchServerIconLink(client, req.params.serverId)});
    });

    app.get('/discord/server/:serverId', async (req, res) => {
        res.json(await serverManagement.fetchServerById(client, req.params.serverId));
    });

    app.get('/discord/storeServer/:serverId', async (req, res) => {
        res.json(await serverManagement.storeServerContents(client, req.params.serverId));
    });

    app.get('/discord/server/:serverId/members', async (req, res) => {
        res.json(await serverManagement.fetchMembersByServerId(client, req.params.serverId));
    });

    app.get('/discord/server/:serverId/users', async(req, res) => {
        res.json(await serverManagement.fetchUsersByServerId(client, req.params.serverId));
    });

    app.get('/discord/server/:serverId/emojis', async(req, res) => {
        res.json(await serverManagement.fetchEmojisByServerId(client, req.params.serverId));
    });

    app.get('/discord/server/:serverId/stickers', async(req, res) => {
        res.json(await serverManagement.fetchStickersByServerId(client, req.params.serverId));
    });

// implement mongodb find to retrieve the messages for a certain channel in a server
    app.get('/discord/messages/:serverId/:channelId/:messageCount', async (req, res) => {
        const guild = await client.guilds.fetch(req.params.serverId);
        const channel = await guild.channels.fetch(req.params.channelId);
        res.json(await Utils.getMessages(channel, req.params.messageCount));
    });

    app.get('/discord/embed', async (req, res) => {
        const guild = await client.guilds.fetch("502575389550575636");
        const channel = await guild.channels.fetch("732241819374583916");
        res.json(await channel.messages.fetch("1064980486251876543"));
    });

    // //fetch messages directly from discord.js
    // app.get('/discordapi/messages/:serverId/:channelId/:messageCount', async(req, res) => {
    //     res.json(await fetchServerMessagesByChannelId(req.params.serverId, req.params.channelId, 10))
    // });

    app.post('/discord/message/:serverId/:channelId', jsonParser, async (req, res) => {
        await serverManagement.postMessage(client, req.params.serverId, req.params.channelId, req.body.message);
        res.sendStatus(200);
    });

    app.post('/discord/channel/:serverId/', async (req, res) => {
        await serverManagement.createChannel(client, req.params.serverId, req.query.channelName);
        res.sendStatus(200);
    });

    app.delete('/discord/channel/', async (req, res) => {
        await serverManagement.deleteChannel(client, req.query.serverId, req.query.channelId);
        res.sendStatus(200);
    })

    app.get('/discord/copy', async (req, res) => {
        await serverManagement.copyServerContents(req.query.sourceGuildId, req.query.targetGuildId, client);
    })
    app.listen(port, () => {
        console.log(`App listening at port: ${port}`);
    })
}

export default {startEndpoints}

