module.exports = 
{
    name: "unmuteall",
    description: "Unmutes everyone in the channel",
    aliases: [],
    execute(message, args)
    {
        const voiceChannel = message.member.voice.channel
        let members = voiceChannel.members.array()
        for(let i of members) {
            i.voice.setMute(false, "Muted")
        }
    }
}