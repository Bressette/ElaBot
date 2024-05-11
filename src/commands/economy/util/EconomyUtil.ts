import {MongoUtil} from "../../../util/mongoUtil.js";

export class EconomyUtil
{
    public static addBalance(name, amount) {
        //connect to mongodb
        let dbo = MongoUtil.getDb()
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
    }

    public static getBalance(name, fn) {
        let dbo = MongoUtil.getDb()


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
    }

    public static async getSlotSize(message) {
        let dbo = MongoUtil.getDb()
        let result = await dbo.collection("servers").findOne({id: message.guild.id})

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
    }
}
