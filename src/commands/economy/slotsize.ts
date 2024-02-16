import {Getslotsize as fetchSlotSize} from "./util/getslotsize.js";

export class Slotsize
{
    static commandName = "slotsize";
    static description = "Prints the current slot size";
    static aliases = [];
    static async execute(message, args)
    {
        message.channel.send("The current slot size is: " + await fetchSlotSize.execute(message))
    }
}