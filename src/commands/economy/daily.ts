const addBalance = require('./util/addbalance')
const balance = require('./balance')
import {MongoUtil} from "../../util/mongoUtil";

module.exports = 
{
    name: "daily",
    description: "Claims the daily balance",
    aliases: [],
    async execute(message, args)
    {
        let userId = message.author.id
        console.log(userId)
        let dailyAmount = 5000
        console.log("In daily")
        let dbo = MongoUtil.getDb()
        let date = new Date()
        let userData = await dbo.collection("users").findOne({name: userId})

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
                addBalance.execute(userId, dailyAmount)
                dbo.collection("users").updateOne({ name: userId}, { $set: {date: date}}, function(err, res) {
                })
                message.channel.send("You claimed your daily balance of ${dailyAmount}. Wait 24h to claim it again")
                setTimeout(function() 
                {
                    let temp = []
                    balance.execute(message, temp)
                }, 100)
            }

            else
            {
                let storedDate = new Date(userData.date)
                let timeDiff = date.getTime() - storedDate.getTime()
                let targetTime = storedDate.getTime() + 24*3600000
                
                if(timeDiff > 24 * 3600000 )
                {
                    addBalance.execute(userId, dailyAmount)
                    dbo.collection("users").updateOne({ name: userId}, { $set: {date: date}}, function(err, res) {
                    })

                    message.channel.send(`You claimed your daily balance of ${dailyAmount}. Wait 24h to claim it again`)
                    setTimeout(function() 
                    {
                        balance.execute(message, [])
                    }, 100)
                }

                else
                {
                    targetTime = (storedDate.getTime() / 1000) + 24 *3600
                    let remainingTime = targetTime - (date.getTime() / 1000)
                    let remainingHours = Math.floor(remainingTime / 3600)
                    remainingTime -= remainingHours * 3600
                    let remainingMinutes = Math.floor(remainingTime / 60)
                    remainingTime -= remainingMinutes * 60
                    remainingTime = Math.floor(remainingTime)

                    let hours = remainingHours.toString()
                    let minutes = remainingMinutes.toString()
                    let seconds = remainingTime.toString()
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
    }
}