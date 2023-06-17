export class Ready {
    public static eventName = 'ready';
    public static once = true;
    public static execute(client) {
        client.user.setPresence(
            { activities:
                    [{
                        name: 'Rainbow Six Siege youtube.com/watch?v=NCRRt9izjP4',
                        type: "WATCHING",
                    }],
                status: 'online' })
    }
}
