const mongoUtil = require('./mongoUtil.js')

module.exports = 
{
    //function that adds the balance to a record associated with the user id that is passed into the function
    addBalance : function(name, amount) 
    {
        //connect to mongodb
        dbo = mongoUtil.getDb()

        

        //retrieve the record for the given user
        dbo.collection("users").findOne({name: name}, function(err, result) {
        if (err) throw err
    
        //if the user does not exist insert the user with the given amount
        if(result === null) 
        {
            dbo.collection("users").insertOne({ name: name, amount: amount}, function(err, result) 
            {
                if(err) throw err
            })
        }

        //if the user already exists update the record with the new amount
        else 
        {
            dbo.collection("users").updateOne({ name: name}, { $set: {name: name, amount: (result.amount + amount)}}, function(err, res) {
            })
        }
        })
        
    },

    //function that gets the balance for a given user and passes the value into a callback function. If the user does not exist a new record is inserted with the user id and an amount of 0
    getBalance : function(name, fn) 
    {

        dbo = mongoUtil.getDb()
        

        //finds the record associated with the given userId
        dbo.collection("users").findOne({name: name}, function(err, result) {
        if (err) 
        {
            throw err
        }

        //if the user does not exist a new record is inserted with a default amount of 0
        if(result === null) 
        {
            dbo.collection("users").insertOne({ name: name, amount: 0}, function(err, result) 
            {
                if(err) throw err
                fn(0) //passes the amount for the user to the function fn()
            })
        }
    
        //if the user exists pass the result amount to the function fn()
        else 
        {
            fn(result.amount)
        }
        })
    },
    
    //function that sends a message after getting the balance from a userId that is passed into the function
    messageCurrentBalance : function(userTag, message) 
    {
        module.exports.getBalance(userTag, function(amount) 
        {
            message.channel.send("Your current balance is: " + amount)
        })
    },

    //function that adds the daily reward to a user if it has been less than 24 hours since previously claiming it (Date functionality currently WIP)
    daily : async function(userId, message, dailyAmount) 
    {
        dbo = mongoUtil.getDb()
        date = new Date()
        userData = await dbo.collection("users").findOne({name: userId})

        if(userData === undefined || userData === null)
        {
            dbo.collection("users").insertOne({ name: userId, amount: dailyAmount, date: date}, function(err, result) 
            {
                if(err) throw err
                message.channel.send(`You claimed your daily balance of ${dailyAmount}. Wait 24h to claim it again`)
            })
        }

        else
        {
            if(userData.date === null || userData.date === undefined)
            {
                module.exports.addBalance(userId, dailyAmount)
                dbo.collection("users").updateOne({ name: userId}, { $set: {date: date}}, function(err, res) {
                })
                message.channel.send("You claimed your daily balance of ${dailyAmount}. Wait 24h to claim it again")
                setTimeout(function() 
                {
                    module.exports.messageCurrentBalance(userId, message)
                }, 100)
            }

            else
            {
                storedDate = new Date(userData.date)
                timeDiff = date.getTime() - storedDate.getTime()
                targetTime = storedDate.getTime() + 24*3600000
                
                if(timeDiff > 24 * 3600000 )
                {
                    module.exports.addBalance(userId, dailyAmount)
                    dbo.collection("users").updateOne({ name: userId}, { $set: {date: date}}, function(err, res) {
                    })

                    message.channel.send(`You claimed your daily balance of ${dailyAmount}. Wait 24h to claim it again`)
                    setTimeout(function() 
                    {
                        module.exports.messageCurrentBalance(userId, message)
                    }, 100)
                }

                else
                {
                    targetTime = (storedDate.getTime() / 1000) + 24 *3600
                    remainingTime = targetTime - (date.getTime() / 1000)
                    remainingHours = Math.floor(remainingTime / 3600)
                    remainingTime -= remainingHours * 3600
                    remainingMinutes = Math.floor(remainingTime / 60)
                    remainingTime -= remainingMinutes * 60
                    remainingTime = Math.floor(remainingTime)

                    hours = remainingHours.toString()
                    minutes = remainingMinutes.toString()
                    seconds = remainingTime.toString()
                    if(remainingHours < 10)
                    {
                        hours = "0" + hours
                    }

                    if(remainingMinutes < 10)
                    {
                        minutes = "0" + minutes
                    }

                    if(remainingTime < 10)
                    {
                        seconds = "0" + seconds
                    }

                    message.channel.send(`You need to wait ${hours}:${minutes}:${seconds} to claim a daily balance`)
                }
            }
        }
    },


    //function that lets the user coinflip a certain value with a 50% chance that they double the staked money
    coinflip : function(content, message, userId)
    {
        //parse the staked amount from the content string 
        amount = parseInt(content.substr(8, content.length).trim())

        //call get balance to check if the user entered a value value to stake
        module.exports.getBalance(userId, function(balance) 
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
                        module.exports.addBalance(userId, amount)
                        message.channel.send("You won the coinflip and " + amount)
                    }

                    else 
                    {
                        module.exports.addBalance(userId, -Math.abs(amount))
                        message.channel.send("You lost the coinflip and " + amount)
                    }

                    //tell the user their new balance after waiting for db to finish
                    setTimeout(function() 
                    {
                        module.exports.messageCurrentBalance(userId, message)
                    }, 100)
                }
            }

            else
            {
                message.channel.send("You must enter a valid number to coinflip")
            }
        })
    },

    //method that returns the emoticon to display given a random value
    getSlotEmoji : function(value)
    {
        if(value < 50)
            return ":seven:"
        else if(value >= 50 && value < 70)
            return ":game_die:"
        else if(value >= 70 && value < 85)
            return ":cherries:"
        else if(value >= 85 && value < 95)
            return ":sunglasses:"
        else if(value >= 95 && value < 100)
            return ":moneybag:"
    },

    setSlotSize : function(content, message)
    {
        dbo = mongoUtil.getDb()
        newSize = parseInt(content.substr(8, content.length))
        if(!isNaN(newSize))
        {
            if(newSize < 3 || newSize > 12)
                message.channel.send("The slot size must be from 3-12")
            else
            {
                dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {slotsize: newSize}}, (err, value) =>
                {
                    message.channel.send("The new slot size is: " + newSize)
                })
            }   
        }
        else
        {
            message.channel.send("You must enter a valid number for slot size")
        }
    },

    getSlotSize : async(message) =>
    {
        dbo = mongoUtil.getDb()
        result = await dbo.collection("servers").findOne({id: message.guild.id})

        if(result.slotsize === undefined || result.slotsize === null)
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {slotsize: "3"}}, (err, value) =>
            {
                if(err) throw err

                return 3
            })
        }

        else
        {
            return parseInt(result.slotsize)
        }
    },

    //method that gambles balance and displays a slot machine
    slots : async function(content, message, userId)
    {
        slotSize = await module.exports.getSlotSize(message)
        if(slotSize === undefined)
            slotSize = 3

        console.log(`The slotsize is: ${slotSize}`)
        //parse the staked amount from the content string 
        amount = parseInt(content.substr(5, content.length).trim())

        //call get balance to check if the user entered a value value to stake
        module.exports.getBalance(userId, function(balance) {
            if(amount > balance)
            {
                message.channel.send("You cannot gamble more than you have!")
            }

            //if amount is a number execute the coinflip
            else if(!isNaN(amount)) 
            {
                let slotDisplay = ""
                let slotArray = []
                let results = []

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
                message.channel.send(slotDisplay)

                reward = 0
                if(results.length === 0)
                {
                    message.channel.send("No rows won")
                    module.exports.addBalance(userId, -Math.abs(amount))
                }
                    
                else
                {
                    //iterates over the winning rows and adds the winning amount to reward 
                    for(i of results)
                    {
                        switch(i)
                        {
                            case ":seven:":
                                reward = (3 * amount + amount)
                                break
                            case ":game_die:":
                                reward += 6 * amount + amount
                                break
                            case ":cherries:":
                                reward += 7 * amount + amount
                                break
                            case ":sunglasses:":
                                reward += 8 * amount + amount
                                break
                            case ":moneybag:":
                                reward += 10 * amount + amount
                                break
                        }
                    }
                    module.exports.addBalance(userId, Math.abs(reward))
                    message.channel.send("You won " + results.length + " rows")
                }

                //tell the user their new balance after waiting for db to finish
                setTimeout(function() 
                {
                    module.exports.messageCurrentBalance(userId, message)
                }, 100)
            }
        })
    },

    //function that lets a user give some of their balance to another user
    //The target user must be mentioned by the source user and 
    give : function(content, message, userId) 
    {
        //removes give from the content string
        content = content.substr(4, content.length).trim()


        module.exports.getBalance(userId, (amount) => {

            //separates the mentioned user and the value
            targetUserId = content.split(" ")[0]
            targetValue = content.split(" ")[1]

            //gets the user id from the mention
            if(targetUserId.includes("!"))
            {
                targetUserId = targetUserId.split("!")[1].split(">")[0]
            }
            else if(targetUserId.includes("@"))
            {
                targetUserId = targetUserId.split("@")[1].split(">")[0]
            }

            if(message.guild.member(targetUserId))
            {
                targetValue = parseInt(targetValue)
                //checks if the user can give the specified value
                if(targetValue > amount) 
                {
                    message.channel.send("You cannot give more than you have!")
                }

                else if(targetValue < 0) 
                {
                    message.channel.send("You cannot steal money!")
                }

                else 
                {
                    module.exports.addBalance(userId, -Math.abs(targetValue))
                    module.exports.addBalance(targetUserId, targetValue)
                    message.channel.send(targetValue + " was given to " + "<@" + targetUserId + ">")
                }
            }

            else
            {
                message.channel.send("That user does not exist...")
            }
        })
    },

    leaderboard : async function(message, client)
    {
        dbo = mongoUtil.getDb()
        cursor = dbo.collection("users").find({}).sort([['amount', -1]])
        results = await cursor.toArray()

        leaderBoardString = "```"

        for(i in results)
        {
            user = await client.users.fetch(results[i].name)
            userName = user.tag.split("#")[0]
            leaderBoardString += userName + " " + results[i].amount + "\n"
        }

        leaderBoardString += "```"

        message.channel.send(leaderBoardString)
    }
}