const express = require('express');
const app = express();
const port = 8093
const serverManagement = require("./ServerManagement");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(client) {
    //endpoints used to retrieve server info for connected servers
    app.get('/discord/channels/:serverId', async (req, res) => {
        const channels = await serverManagement.fetchChannelsByServerId(req.params.serverId, client);
        res.json(channels);
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

    app.get('/discord/server/:serverId/members', async (req, res) => {
        res.json(await serverManagement.fetchMembersByServerId(client, req.params.serverId));
    });

// implement mongodb find to retrieve the messages for a certain channel in a server
    app.get('/discord/messages/:serverId/:channelId/:messageCount', async (req, res) => {
        res.json(await serverManagement.fetchServerMessagesByChannelId(req.params.serverId, req.params.channelId, req.params.messageCount));
    })

    app.post('/discord/message/:serverId/:channelId', jsonParser, async (req, res) => {
        await serverManagement.postMessage(client, req.params.serverId, req.params.channelId, req.body.message);
        res.sendStatus(200);
    })

    app.get('/discord/copy', async (req, res) => {
        await serverManagement.copyServerContents(req.query.sourceGuildId, req.query.targetGuildId, client);
    })
    app.listen(port, () => {
        console.log(`App listening at port: ${port}`);
    })
}

