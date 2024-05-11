import {EconomyUtil} from "./util/EconomyUtil.js";
import {Balance} from "./balance.js";

export class Slots
{
    public static commandName = "slots";
    public static description = "Gambles balance using a slot machine";
    public static aliases = [];
    public static async execute(message, args)
    {
        let userId = message.author.id
        let slotSize = await EconomyUtil.getSlotSize(message);
        if(slotSize === undefined)
            slotSize = 3
        //parse the staked amount from the content string 
        let amount = parseInt(args[0])
        if(!isNaN(amount) && isFinite(amount) && amount > 0)
        {
            //call get balance to check if the user entered a value to stake
            EconomyUtil.getBalance(userId, function(balance) {
                if(amount > balance)
                {
                    message.channel.send("You cannot gamble more than you have!")
                }

                //if amount is a number execute the coinflip
                else 
                {
                    let slotDisplay = ""
                    let slotArray = []
                    let results = []

                    //loop that computes the random values and adds the emoticons to slotDisplay
                    for(let i = 1; i <= slotSize * slotSize; i++)
                    {
                        let rollSlots = Math.floor(Math.random() * 100)
                        slotArray[i-1] = module.exports.getSlotEmoji(rollSlots)
                        slotDisplay += slotArray[i-1]

                        if(i % slotSize === 0)
                            slotDisplay += "\n"
                    }
                    //loop that computes if the rows and columns are winning values
                    for(let i = 0; i < slotSize; i++)
                    {
                        let rowCounter = 0
                        let columnCounter = 0
                        for(let j = 0; j < slotSize - 1; j++)
                        {
                            if(slotArray[i*slotSize + j] === slotArray[i*slotSize + j + 1])
                                rowCounter++
                            if(slotArray[j*slotSize + i] === slotArray[(j+1)*slotSize + i])
                                columnCounter++
                        }
                        if(rowCounter === slotSize - 1)
                            results.push(slotArray[i*slotSize])
                        if(columnCounter === slotSize - 1)
                            results.push(slotArray[i])
                    }

                    //loop that computes if the diagonals are winning values
                    let counter = 0
                    let secondCounter = 0
                    for(let i = 0; i < slotSize - 1; i++)
                    {
                        if(slotArray[i*slotSize + i] === slotArray[(i+1)*slotSize + i + 1])
                            counter++
                        if(slotArray[slotSize*slotSize - slotSize - i*slotSize + i] === slotArray[slotSize*slotSize - slotSize - (i+1)*slotSize + i + 1])
                            secondCounter++
                        
                    }

                    if(counter === slotSize - 1)
                        results.push(slotArray[0])
                    if(secondCounter === slotSize - 1)
                        results.push(slotArray[slotSize])

                    //displays the slot emoticons
                    if(slotDisplay)
                        message.channel.send(slotDisplay)
                    let reward = 0
                    if(results.length === 0)
                    {
                        message.channel.send("No rows won")
                        EconomyUtil.addBalance(userId, -Math.abs(amount))
                    }
                        
                    else
                    {
                        //iterates over the winning rows and adds the winning amount to reward 
                        for(let i of results)
                        {
                            switch(i)
                            {
                                case ":seven:":
                                    reward += Math.ceil((1)*(slotSize / 3) * amount + amount)
                                    break
                                case ":game_die:":
                                    reward += Math.ceil((3/2)*(slotSize / 3) * amount + amount)
                                    break
                                case ":cherries:":
                                    reward += Math.ceil((2)*(slotSize / 3) * amount + amount)
                                    break
                                case ":crown:":
                                    reward += Math.ceil((5/2)*(slotSize / 3) * amount + amount)
                                    break
                                case ":moneybag:":
                                    reward += Math.ceil((5/2)*(slotSize / 3) * amount + amount)
                                    break
                            }
                        }
                        EconomyUtil.addBalance(userId, Math.abs(reward));
                        message.channel.send("You won " + results.length + " rows")
                    }

                    //tell the user their new balance after waiting for db to finish
                    setTimeout(function() 
                    {
                        Balance.execute(message, []);
                    }, 100)
                }
            })
        }

        else
        {
            if(isNaN(amount))
            {
                message.channel.send("You must enter a number to gamble!")
            }

            else if(!isFinite(amount))
            {
                message.channel.send("You cannot gamble an infinite amount of money!")
            }

            else if(amount < 0)
            {
                message.channel.send("You cannot gamble negative money!")
            }

            else if(amount === 0)
            {
                message.channel.send("You cannot gamble 0!")
            }

            else
            {
                message.channel.send("You must enter a valid number to gamble!")
            }
        }
    }

    getSlotEmoji(value)
    {
        if(value < 30)
            return ":seven:"
        else if(value >= 30 && value < 55)
            return ":game_die:"
        else if(value >= 55 && value < 70)
            return ":cherries:"
        else if(value >= 70 && value < 85)
            return ":crown:"
        else if(value >= 85 && value < 100)
            return ":moneybag:"
        else
            return ":seven:"
    }
}
