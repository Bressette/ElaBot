export class MessageCreate {
    public static eventName = 'messageCreate';
    public static once = false;
    public static async execute(message) {
        console.log(message.content);
        let prefix = "-";
        if (!message.client.prefix.get(message.guild.id))
            message.client.prefix.set(message.guild.id, prefix);

        prefix = message.client.prefix.get(message.guild.id);

        if (message.author.bot || !message.content.trim().startsWith(prefix))
            return

        //check if message starts with the command prefix
        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
        message.content = message.content.substr(prefix.length, message.content.length).trim()

        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

        if (!command)
            return

        try {
            await command.execute(message, args)
        } catch (error) {
            console.error(error)
        }
    }
}
