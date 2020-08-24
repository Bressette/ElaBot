const getSlotSize = require('./util/getslotsize')

module.exports = 
{
    name: "slotsize",
    description: "Prints the current slot size",
    aliases: [],
    execute(message, args)
    {
        message.channel.send("The current slot size is: " + getSlotSize.execute(message))
    }
}