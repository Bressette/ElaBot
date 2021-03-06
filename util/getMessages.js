module.exports = 
{
    name: "getMessages",
    description: "fetches messages from a given channel and returns the array of messages",
    async execute(channel, limit)
    {
        const sum_messages = [];
        let last_id;
    
        while (true) 
        {
            const options = { limit: 100 };
            if (last_id) 
            {
                options.before = last_id;
            }
    
            const messages = await channel.messages.fetch(options);
            sum_messages.push(...messages.array());
            last_id = messages.last().id;
    
            if (messages.size != 100 || sum_messages >= limit) 
            {
                break;
            }
        }
    
        return sum_messages;
    }
}