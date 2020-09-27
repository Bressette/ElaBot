const getSlotSize = require('./util/getslotsize')

module.exports = 
{
    name: "slotsize",
    description: "Prints the current slot size",
    aliases: [],
    async execute(message, args)
    {
        message.channel.send("The current slot size is: " + await getSlotSize.execute(message))
    }
}