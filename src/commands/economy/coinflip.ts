import {EconomyUtil} from "./util/EconomyUtil.js";


export class Coinflip
{
    public static commandName = "coinflip";
    public static description = "Coinflips a users balance doubling money if successfull";
    public static aliases = [];
    public static execute(message, args)
    {
        let userId = message.author.id
        //parse the staked amount from the content string 
        let amount = parseInt(args[0])

        EconomyUtil.getBalance(userId, function(balance)
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
                        EconomyUtil.addBalance(userId, amount);
                        message.channel.send("You won the coinflip and " + amount);
                    }

                    else
                    {
                        EconomyUtil.addBalance(userId, -Math.abs(amount));
                        message.channel.send("You lost the coinflip and " + amount)
                    }

                }
            }

            else
            {
                message.channel.send("You must enter a valid number to coinflip")
            }
        });
    }
}
