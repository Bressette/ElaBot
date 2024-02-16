// @ts-ignore
import {Getbalance as getBalance} from "./util/getbalance.js";
// @ts-ignore
import {Addbalance as addBalance} from "./util/addbalance.js";

export class Coinflip
{
    static commandName = "coinflip";
    static description = "Coinflips a users balance doubling money if successfull";
    static aliases = [];
    static execute(message, args)
    {
        let userId = message.author.id
        //parse the staked amount from the content string 
        let amount = parseInt(args[0])

        //call get balance to check if the user entered a value to stake
        getBalance.execute(userId, function(balance) 
        {
            if(!isNaN(amount) && isFinite(amount))
            {
                if(amount > balance)
                {
                    message.channel.send("You cannot coinflip more than you have!")
                }

                else if(amount < 0)
                {
                    message.channel.send("You cannot coinflip a negative number!")
                }

                else if(amount === 0)
                {
                    message.channel.send("You cannot coinflip 0!")
                }

                //execute the coinflip otherwise
                else
                {
                    if(Math.floor(Math.random() * 2) === 1) 
                    {
                        addBalance.execute(userId, amount)
                        message.channel.send("You won the coinflip and " + amount)
                    }

                    else 
                    {
                        addBalance.execute(userId, -Math.abs(amount))
                        message.channel.send("You lost the coinflip and " + amount)
                    }

                }
            }

            else
            {
                message.channel.send("You must enter a valid number to coinflip")
            }
        })
    }
}