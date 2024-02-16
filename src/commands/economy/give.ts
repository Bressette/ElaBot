// // @ts-ignore
// import {Getbalance as getBalance} from "./util/getbalance";
// // @ts-ignore
// import {Addbalance as addBalance} from "./util/addbalance";
//
// export class Give
// {
//     static commandName = "give";
//     static description = "Gives another user some of your money";
//     static aliases = [];
//     static execute(message, args)
//     {
//         if(message.mentions.members.first() === null)
//             return message.content.send("That is not a valid user mention")
//         let userId = message.author.id
//         getBalance.execute(userId, (amount) => {
//             //separates the mentioned user and the value
//             let targetUserId = message.mentions.members.first().id
//             let targetValue = args[0]
//             console.log(`The target user id is ${targetUserId} and the target value is: ${targetValue}`)
//
//             //gets the user id from the mention
//             if(targetUserId.includes("!"))
//             {
//                 targetUserId = targetUserId.split("!")[1].split(">")[0]
//             }
//             else if(targetUserId.includes("@"))
//             {
//                 targetUserId = targetUserId.split("@")[1].split(">")[0]
//             }
//
//             if(targetUserId === message.author.id)
//             {
//                 message.channel.send("You cannot give yourself money that you already have!")
//             }
//
//             else if(message.guild.member(targetUserId))
//             {
//                 targetValue = parseInt(targetValue.trim())
//                 if(isNaN(targetValue) || !isFinite(targetValue))
//                 {
//                     message.channel.send("You must enter a valid number to give money")
//                 }
//                 //checks if the user can give the specified value
//                 else if(targetValue > amount)
//                 {
//                     message.channel.send("You cannot give more than you have!")
//                 }
//
//                 else if(targetValue < 0)
//                 {
//                     message.channel.send("You cannot steal money!")
//                 }
//
//                 else if(targetValue === 0)
//                 {
//                     message.channel.send("You cannot give 0!")
//                 }
//
//                 else
//                 {
//                     addBalance.execute(userId, -Math.abs(targetValue))
//                     addBalance.execute(targetUserId, targetValue)
//                     message.channel.send(targetValue + " was given to " + "<@" + targetUserId + ">")
//                 }
//             }
//
//             else
//             {
//                 message.channel.send("That user does not exist...")
//             }
//         })
//     }
// }