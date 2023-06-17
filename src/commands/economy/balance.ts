import {EconomyUtil} from "./util/EconomyUtil";

export class Balance
{
    public static commandName = "balance";
    public static description = "Retrieves the users balance";
    public static aliases = [];
    public static execute(message, args)
    {
        EconomyUtil.getBalance(message.author.id, function(amount)
        {
            message.channel.send("Your current balance is: " + amount)
        });
    }
}
