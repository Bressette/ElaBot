const getBalance = require('./util/getbalance')
const addBalance = require('./util/addbalance')

module.exports = 
{
    name: "give",
    description: "Gives another user some of your money",
    aliases: [],
    execute(message, args)
    {
        userId = message.author.id
        content = message.content

        getBalance.execute(userId, (amount) => {
            //separates the mentioned user and the value
            targetUserId = args[0]
            targetValue = args[1]

            //gets the user id from the mention
            if(targetUserId.includes("!"))
            {
                targetUserId = targetUserId.split("!")[1].split(">")[0]
            }
            else if(targetUserId.includes("@"))
            {
                targetUserId = targetUserId.split("@")[1].split(">")[0]
            }

            if(targetUserId === message.author.id)
            {
                message.channel.send("You cannot give yourself money that you already have!")
            }

            else if(message.guild.member(targetUserId))
            {
                targetValue = parseInt(targetValue.trim())
                if(isNaN(targetValue) || !isFinite(targetValue))
                {
                    message.channel.send("You must enter a valid number to give money")
                }
                //checks if the user can give the specified value
                else if(targetValue > amount) 
                {
                    message.channel.send("You cannot give more than you have!")
                }

                else if(targetValue < 0) 
                {
                    message.channel.send("You cannot steal money!")
                }

                else if(targetValue === 0)
                {
                    message.channel.send("You cannot give 0!")
                }

                else 
                {
                    addBalance.execute(userId, -Math.abs(targetValue))
                    addBalance.execute(targetUserId, targetValue)
                    message.channel.send(targetValue + " was given to " + "<@" + targetUserId + ">")
                }
            }

            else
            {
                message.channel.send("That user does not exist...")
            }
        })
    }
}