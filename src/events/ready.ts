module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.user.setPresence(
            { activities:
                    [{
                        name: 'Rainbow Six Siege youtube.com/watch?v=NCRRt9izjP4',
                        type: "WATCHING",
                    }],
                status: 'online' })
    }
}
