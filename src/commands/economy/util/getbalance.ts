import {MongoUtil} from "../../../util/mongoUtil";

module.exports = 
{
    execute(name, fn)
    {
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
}