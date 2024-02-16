// @ts-ignore
import {Getbalance as getBalance} from "./util/getbalance.js";

export class Balance
{
    static commandName = "balance";
    static description = "Retrieves the users balance";
    static aliases = [];
    static execute(message, args)
    {
        getBalance.execute(message.author.id, function(amount)
        {
            message.channel.send("Your current balance is: " + amount)
        })
    }
}