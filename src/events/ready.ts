export class Ready {
    static commandName = 'ready';
    static once = true;
    static execute(client) {
        client.user.setPresence(
            { activities:
                    [{
                        name: 'Rainbow Six Siege youtube.com/watch?v=NCRRt9izjP4',
                        type: "WATCHING",
                    }],
                status: 'online' })
    }
}
