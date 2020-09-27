const { getSlotEmoji } = require("../../economy");
const getSlotSize = require('./util/getslotsize')
const getBalance = require('./util/getbalance')
const printBalance = require('./balance')
const addBalance = require('./util/addbalance')

module.exports = 
{
    name: "slots",
    description: "Gambles balance using a slot machine",
    aliases: [],
    async execute(message, args)
    {
        userId = message.author.id
        slotSize = await getSlotSize.execute(message)
        if(slotSize === undefined)
            slotSize = 3
        //parse the staked amount from the content string 
        amount = parseInt(args[0])
        if(!isNaN(amount) && isFinite(amount) && amount > 0)
        {
            //call get balance to check if the user entered a value to stake
            getBalance.execute(userId, function(balance) {
                if(amount > balance)
                {
                    message.channel.send("You cannot gamble more than you have!")
                }

                //if amount is a number execute the coinflip
                else 
                {
                    slotDisplay = ""
                    slotArray = []
                    results = []

                    //loop that computes the random values and adds the emoticons to slotDisplay
                    for(i = 1; i <= slotSize * slotSize; i++)
                    {
                        rollSlots = Math.floor(Math.random() * 100)
                        slotArray[i-1] = module.exports.getSlotEmoji(rollSlots)
                        slotDisplay += slotArray[i-1]

                        if(i % slotSize === 0)
                            slotDisplay += "\n"
                    }
                    //loop that computes if the rows and columns are winning values
                    for(i = 0; i < slotSize; i++)
                    {
                        rowCounter = 0
                        columnCounter = 0
                        for(j = 0; j < slotSize - 1; j++)
                        {
                            if(slotArray[i*slotSize + j] === slotArray[i*slotSize + j + 1])
                                rowCounter++
                            if(slotArray[j*slotSize + i] === slotArray[(j+1)*slotSize + i])
                                columnCounter++

                            if(rowCounter === slotSize - 1)
                                results.push(slotArray[i*slotSize])
                            if(columnCounter === slotSize - 1)
                                results.push(slotArray[i])
                        }
                    }

                    //loop that computes if the diagonals are winning values
                    counter = 0
                    secondCounter = 0
                    for(i = 0; i < slotSize - 1; i++)
                    {
                        if(slotArray[i*slotSize + i] === slotArray[(i+1)*slotSize + i + 1])
                            counter++
                        if(slotArray[slotSize*slotSize - slotSize - i*slotSize + i] === slotArray[slotSize*slotSize - slotSize - (i+1)*slotSize + i + 1])
                            secondCounter++
                        if(counter === slotSize - 1)
                            results.push(slotArray[0])
                        if(secondCounter === slotSize - 1)
                            results.push(slotArray[slotSize])
                    }

                    //displays the slot emoticons
                    if(slotDisplay)
                        message.channel.send(slotDisplay)
                    reward = 0
                    if(results.length === 0)
                    {
                        message.channel.send("No rows won")
                        addBalance.execute(userId, -Math.abs(amount))
                    }
                        
                    else
                    {
                        //iterates over the winning rows and adds the winning amount to reward 
                        for(i of results)
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
                        addBalance.execute(userId, Math.abs(reward))
                        message.channel.send("You won " + results.length + " rows")
                    }

                    //tell the user their new balance after waiting for db to finish
                    setTimeout(function() 
                    {
                        printBalance.execute(message, [])
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
    },

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