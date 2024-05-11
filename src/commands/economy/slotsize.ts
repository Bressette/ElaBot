import {EconomyUtil} from "./util/EconomyUtil.js";

export class Slotsize
{
    public static commandName = "slotsize";
    public static description = "Prints the current slot size";
    public static aliases = [];
    public static async execute(message, args)
    {
        message.channel.send("The current slot size is: " + await EconomyUtil.getSlotSize(message))
    }
}
